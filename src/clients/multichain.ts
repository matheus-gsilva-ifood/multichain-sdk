import {
  TxHash,
  Network,
  Fees,
  TxsPage,
  TxHistoryParams,
  Tx,
} from '@xchainjs/xchain-client'
import { decryptFromKeystore, Keystore } from '@xchainjs/xchain-crypto'
import {
  baseAmount,
  Chain,
  THORChain,
  chains
  // BCHChain,
} from '@xchainjs/xchain-util'
import {
  MidgardV2,
  NetworkType as MidgardNetwork,
  PoolAddress,
} from 'midgard-sdk'

import { Swap, Memo, Asset, AssetAmount } from '../entities'
import { BnbChain } from './binance'
import { BtcChain } from './bitcoin'
import { IClient } from './client'
// import { BchChain } from './bitcoinCash'
import { EthChain } from './ethereum'
import { LtcChain } from './litecoin'
import { ThorChain } from './thorchain'
import {
  TxParams,
  AddLiquidityParams,
  WithdrawParams,
  Wallet,
  ChainWallet,
  supportedChains,
  SupportedChain,
  AddLiquidityTxns,
  SupportedChainsEnum,
} from './types'

// specifying non-eth client is needed for getFees method
type NonETHChainClient = BnbChain | BtcChain | LtcChain | ThorChain

// thorchain pool address is empty string
const THORCHAIN_POOL_ADDRESS = ''

export interface IMultiChain {
  chains: typeof supportedChains
  midgard: MidgardV2
  network: string

  wallets: Wallet | null

  getPhrase(): string
  setPhrase(phrase: string): void
  validateKeystore(keystore: Keystore, password: string): Promise<boolean>

  getMidgard(): MidgardV2

  getChainClient(chain: Chain): void

  getPoolAddressByChain(chain: Chain): Promise<PoolAddress>

  getWalletByChain(chain: Chain): Promise<ChainWallet>
  loadAllWallets(): Promise<Wallet | null>
  getWalletAddressByChain(chain: Chain): string | null

  getExplorerUrl(chain: Chain): string
  getExplorerAddressUrl(chain: Chain, address: string): string
  getExplorerTxUrl(chain: Chain, txHash: string): string

  getTransactions(chain: Chain, params?: TxHistoryParams): Promise<TxsPage>
  getTransactionData(chain: Chain, txHash: string): Promise<Tx>

  getFees(chain: Chain): Promise<Fees>

  transfer(tx: TxParams, native?: boolean): Promise<TxHash>
  swap(swap: Swap, recipient?: string): Promise<TxHash>
  addLiquidity(params: AddLiquidityParams): Promise<AddLiquidityTxns>
  withdraw(params: WithdrawParams): Promise<TxHash>
}

export class MultiChain implements IMultiChain {
  private phrase: string

  private wallet: Wallet | null = null

  public readonly chains = supportedChains

  public readonly midgard: MidgardV2

  public readonly network: Network

  public clients: Record<SupportedChainsEnum, IClient<any>>;

  constructor({
    network = 'testnet',
    phrase = '',
  }: {
    network?: Network
    phrase?: string
  }) {
    this.network = network
    this.phrase = phrase

    // create midgard client
    this.midgard = new MidgardV2(MultiChain.getMidgardNetwork(network))

    // create chain clients
    this.clients = {
      [SupportedChainsEnum.Thor]: new ThorChain({ network, phrase }),
      [SupportedChainsEnum.Bnb]: new BnbChain({ network, phrase }),
      [SupportedChainsEnum.Btc]: new BtcChain({ network, phrase }),
      [SupportedChainsEnum.Eth]: new EthChain({ network, phrase }),
      [SupportedChainsEnum.Ltc]: new LtcChain({ network, phrase })
    }
    // this.bch = new BchChain({ network, phrase })
  }

  setPhrase = (phrase: string) => {
    this.phrase = phrase
    Object.keys(this.clients).forEach((chain: string) => {
      const chainName = chain as unknown as SupportedChainsEnum
      this.clients[chainName].getClient().setPhrase(phrase)
    })

    this.initWallet()
  }

  getPhrase = () => {
    return this.phrase
  }

  // used to validate keystore and password with phrase
  validateKeystore = async (keystore: Keystore, password: string) => {
    const phrase = await decryptFromKeystore(keystore, password)

    return phrase === this.phrase
  }

  initWallet = () => {
    this.wallet = {
      THOR: {
        address: this.clients[SupportedChainsEnum.Thor].getClient().getAddress(),
        balance: [],
      },
      BNB: {
        address: this.clients[SupportedChainsEnum.Bnb].getClient().getAddress(),
        balance: [],
      },
      BTC: {
        address: this.clients[SupportedChainsEnum.Btc].getClient().getAddress(),
        balance: [],
      },
      ETH: {
        address: this.clients[SupportedChainsEnum.Eth].getClient().getAddress(),
        balance: [],
      },
      LTC: {
        address: this.clients[SupportedChainsEnum.Ltc].getClient().getAddress(),
        balance: [],
      },
      // BCH: {
      //   address: this.bch.getClient().getAddress(),
      //   balance: [],
      // },
    }
  }

  /**
   * return midgard network type
   *
   * @param network mainnet or testnet
   */
  public static getMidgardNetwork(network: Network): MidgardNetwork {
    if (network === 'testnet') return 'testnet'
    return 'chaosnet'
  }

  get wallets(): Wallet | null {
    return this.wallet
  }

  /**
   * get midgard client
   */
  getMidgard(): MidgardV2 {
    return this.midgard
  }

  getPoolAddressByChain = async (chain: Chain): Promise<PoolAddress> => {
    try {
      // for thorchain, return empty string
      if (chain === THORChain) return THORCHAIN_POOL_ADDRESS

      const poolAddress = await this.midgard.getInboundAddressByChain(chain)

      return poolAddress
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getChainClient = (chain: Chain) => {
    const chainSelected = chain.toLowerCase() as SupportedChainsEnum
    if(chains.includes(chain)) {
      return this.clients[chainSelected]
    }
    return null
  }

  getWalletByChain = async (chain: Chain): Promise<ChainWallet> => {
    const chainClient = this.getChainClient(chain)

    if (!chainClient) throw new Error('invalid chain')

    try {
      const balance = (await chainClient?.loadBalance()) ?? []
      const address = chainClient.getClient().getAddress()

      if (this.wallet && chain in this.wallet) {
        this.wallet = {
          ...this.wallet,
          [chain]: {
            address,
            balance,
          },
        }
      }

      return {
        address,
        balance,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  loadAllWallets = async (): Promise<Wallet | null> => {
    try {
      await Promise.all(
        this.chains.map((chain: SupportedChain) => {
          return new Promise((resolve) => {
            this.getWalletByChain(chain)
              .then((data) => resolve(data))
              .catch((err) => {
                console.log(err)
                resolve([])
              })
          })
        }),
      )

      console.log('wallet', this.wallet)
      return this.wallet
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getWalletAddressByChain = (chain: Chain): string | null => {
    if (this.wallet && chain in this.wallet) {
      return this.wallet?.[chain as SupportedChain]?.address ?? null
    }

    return null
  }

  getExplorerUrl = (chain: Chain): string => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) return '#'

    return chainClient.getClient().getExplorerUrl()
  }

  getExplorerAddressUrl = (chain: Chain, address: string): string => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) return '#'

    return chainClient.getClient().getExplorerAddressUrl(address)
  }

  getExplorerTxUrl = (chain: Chain, txHash: string): string => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) return '#'

    return chainClient.getClient().getExplorerTxUrl(txHash)
  }

  getTransactions = (
    chain: Chain,
    params?: TxHistoryParams,
  ): Promise<TxsPage> => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) throw new Error('invalid chain')

    return chainClient.getClient().getTransactions(params)
  }

  getTransactionData = (chain: Chain, txHash: string): Promise<Tx> => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) throw new Error('invalid chain')

    return chainClient.getClient().getTransactionData(txHash)
  }

  getFees = (chain: Chain, tx?: TxParams): Promise<Fees> => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) throw new Error('invalid chain')

    if (chain === 'ETH' && tx) {
      const { assetAmount, recipient } = tx
      const { asset } = assetAmount
      const amount = baseAmount(assetAmount.amount.baseAmount)

      const assetObj = {
        chain: asset.chain,
        symbol: asset.symbol,
        ticker: asset.ticker,
      }
      return chainClient.getClient().getFees({
        asset: assetObj,
        amount,
        recipient,
      })
    }

    return (chainClient as NonETHChainClient).getClient().getFees()
  }

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (tx: TxParams, native = true): Promise<TxHash> => {
    const { chain } = tx.assetAmount.asset

    // for swap, add, withdraw tx in thorchain, send deposit tx
    if (
      chain === THORChain &&
      tx.recipient === THORCHAIN_POOL_ADDRESS &&
      native
    ) {
      return this.thor.deposit(tx)
    }

    const chainClient = this.getChainClient(chain)
    if (chainClient) {
      try {
        return await chainClient.transfer(tx)
      } catch (error) {
        return Promise.reject(error)
      }
    } else {
      throw new Error('Chain does not exist')
    }
  }

  /**
   * swap assets
   * @param {Swap} swap Swap Object
   */
  swap = async (swap: Swap, recipient?: string): Promise<TxHash> => {
    /**
     * 1. check if swap has sufficient fee
     * 2. get pool address
     * 3. get swap memo
     * 4. transfer input asset to pool address
     */

    try {
      if (!this.wallet) {
        return await Promise.reject(new Error('Wallet not detected'))
      }

      const walletAddress = this.getWalletAddressByChain(swap.outputAsset.chain)

      if (!walletAddress) {
        return await Promise.reject(new Error('Wallet Address not detected'))
      }

      if (swap.hasInSufficientFee) {
        return await Promise.reject(new Error('Insufficient Fee'))
      }

      const recipientAddress = recipient || walletAddress

      const poolAddress = await this.getPoolAddressByChain(
        swap.inputAsset.chain,
      )
      const memo = Memo.swapMemo(
        swap.outputAsset,
        recipientAddress,
        swap.minOutputAmount, // slip limit
      )

      return await this.transfer({
        assetAmount: swap.inputAmount,
        recipient: poolAddress,
        memo,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * add liquidity to pool
   * @param {AddLiquidityParams} params
   */
  addLiquidity = async (
    params: AddLiquidityParams,
  ): Promise<AddLiquidityTxns> => {
    /**
     * 1. get pool address
     * 2. get add liquidity memo
     * 3. check add type (Sym or Asym add)
     * 4. add liquidity to pool
     */

    try {
      const { pool, runeAmount, assetAmount } = params
      const { chain } = pool.asset

      const poolAddress = await this.getPoolAddressByChain(chain)

      // sym stake
      if (runeAmount && runeAmount.gt(runeAmount._0_AMOUNT)) {
        if (assetAmount.lte(assetAmount._0_AMOUNT)) {
          return await Promise.reject(new Error('Invalid Asset Amount'))
        }

        // 1. send rune (NOTE: recipient should be empty string)
        const runeTx = await this.transfer({
          assetAmount: runeAmount,
          recipient: THORCHAIN_POOL_ADDRESS,
          memo: Memo.depositMemo(Asset.RUNE()),
        })

        // 2. send asset
        const assetTx = await this.transfer({
          assetAmount,
          recipient: poolAddress,
          memo: Memo.depositMemo(pool.asset),
        })

        return {
          runeTx,
          assetTx,
        }
      }
      // asym stake
      if (assetAmount.lte(assetAmount._0_AMOUNT)) {
        return await Promise.reject(new Error('Invalid Asset Amount'))
      }

      const assetTx = await this.transfer({
        assetAmount,
        recipient: poolAddress,
        memo: Memo.depositMemo(pool.asset),
      })

      return {
        assetTx,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * withdraw asset from pool
   * @param {WithdrawParams} params
   */
  withdraw = async (params: WithdrawParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get withdraw memo
     * 3. transfer withdraw tx
     */

    try {
      const { pool, percent } = params
      const memo = Memo.withdrawMemo(pool.asset, percent)
      const { chain } = pool.asset

      const poolAddress = await this.getPoolAddressByChain(chain)

      const txHash = await this.transfer({
        assetAmount: AssetAmount.getMinAmountByChain(chain),
        recipient: poolAddress,
        memo,
      })

      return txHash
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
