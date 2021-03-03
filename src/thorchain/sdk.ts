import { Network } from '@xchainjs/xchain-client'
import { validatePhrase } from '@xchainjs/xchain-crypto'

import { MultiChain, Wallet } from '../clients'
import { Asset, Amount, AssetAmount, Swap, Pool } from '../entities'

export interface IThorchainSDK {
  multichain: MultiChain
  pools: Pool[]

  quote(inputAsset: string, outputAsset: string, amount: number): Swap
  swap(swapEntity: Swap): Promise<string>
  validatePhrase(phrase: string): boolean
  setPhrase(phrase: string): void
  loadWallet(): Promise<Wallet | null>
  refresh(): Promise<void>
}

export class ThorchainSDK implements IThorchainSDK {
  public multichain: MultiChain

  public pools: Pool[] = []

  constructor({
    network = 'testnet',
    phrase = '',
  }: {
    network?: Network
    phrase?: string
  }) {
    this.multichain = new MultiChain({ network, phrase })
  }

  validatePhrase = (phrase: string): boolean => {
    return validatePhrase(phrase)
  }

  setPhrase = (phrase: string): void => {
    this.multichain.setPhrase(phrase)
  }

  loadWallet = async (): Promise<Wallet | null> => {
    return await this.multichain.loadAllWallets()
  }

  refresh = async () => {
    await this.fetchPools()
  }

  private fetchPools = async () => {
    try {
      // get pool details
      const poolDetails = await this.multichain.midgard.getPools()

      // transform raw pool details to Pool Entities
      this.pools = poolDetails.reduce((res: Pool[], poolDetail) => {
        const poolObj = Pool.fromPoolData(poolDetail)
        if (poolObj) {
          res.push(poolObj)
        }
        return res
      }, [])
    } catch (error) {
      console.log(error)
    }
  }

  quote = (inputAsset: string, outputAsset: string, amount: number): Swap => {
    const input = Asset.fromAssetString(inputAsset)
    const output = Asset.fromAssetString(outputAsset)

    if (!input || !output) {
      throw Error('invalid asset')
    }

    if (!this.pools.length) {
      throw Error('invalid pool data')
    }

    const amountEntity = Amount.fromAssetAmount(amount, input.decimal)
    const inputAssetAmount = new AssetAmount(input, amountEntity)

    try {
      const swapEntity = new Swap(input, output, this.pools, inputAssetAmount)

      return swapEntity
    } catch (error) {
      throw error
    }
  }

  swap = async (swapEntity: Swap): Promise<string> => {
    try {
      const txHash = await this.multichain.swap(swapEntity)

      // get tx explorer url
      const txExplorer = this.multichain.getExplorerAddressUrl(
        swapEntity.inputAsset.chain,
        txHash,
      )

      return txExplorer
    } catch (error) {
      throw error
    }
  }
}
