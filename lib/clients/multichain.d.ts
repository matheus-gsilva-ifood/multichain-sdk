import { TxHash, Network, Fees, TxsPage, TxHistoryParams, Tx } from '@xchainjs/xchain-client';
import { Keystore } from '@xchainjs/xchain-crypto';
import { Chain } from '@xchainjs/xchain-util';
import { MidgardV2, NetworkType as MidgardNetwork, PoolAddress } from 'midgard-sdk';
import { Swap } from '../entities';
import { BnbChain } from './binance';
import { BtcChain } from './bitcoin';
import { EthChain } from './ethereum';
import { LtcChain } from './litecoin';
import { ThorChain } from './thorchain';
import { TxParams, AddLiquidityParams, WithdrawParams, Wallet, ChainWallet, supportedChains, AddLiquidityTxns } from './types';
export interface IMultiChain {
    chains: typeof supportedChains;
    midgard: MidgardV2;
    network: string;
    wallets: Wallet | null;
    thor: ThorChain;
    btc: BtcChain;
    bnb: BnbChain;
    eth: EthChain;
    ltc: LtcChain;
    getPhrase(): string;
    setPhrase(phrase: string): void;
    validateKeystore(keystore: Keystore, password: string): Promise<boolean>;
    getMidgard(): MidgardV2;
    getChainClient(chain: Chain): void;
    getPoolAddressByChain(chain: Chain): Promise<PoolAddress>;
    getWalletByChain(chain: Chain): Promise<ChainWallet>;
    loadAllWallets(): Promise<Wallet | null>;
    getWalletAddressByChain(chain: Chain): string | null;
    getExplorerUrl(chain: Chain): string;
    getExplorerAddressUrl(chain: Chain, address: string): string;
    getExplorerTxUrl(chain: Chain, txHash: string): string;
    getTransactions(chain: Chain, params?: TxHistoryParams): Promise<TxsPage>;
    getTransactionData(chain: Chain, txHash: string): Promise<Tx>;
    getFees(chain: Chain): Promise<Fees>;
    transfer(tx: TxParams, native?: boolean): Promise<TxHash>;
    swap(swap: Swap, recipient?: string): Promise<TxHash>;
    addLiquidity(params: AddLiquidityParams): Promise<AddLiquidityTxns>;
    withdraw(params: WithdrawParams): Promise<TxHash>;
}
export declare class MultiChain implements IMultiChain {
    private phrase;
    private wallet;
    readonly chains: readonly ["BTC", "BNB", "THOR", "ETH", "LTC"];
    readonly midgard: MidgardV2;
    readonly network: Network;
    thor: ThorChain;
    btc: BtcChain;
    bnb: BnbChain;
    eth: EthChain;
    ltc: LtcChain;
    constructor({ network, phrase, }: {
        network?: Network;
        phrase?: string;
    });
    setPhrase: (phrase: string) => void;
    getPhrase: () => string;
    validateKeystore: (keystore: Keystore, password: string) => Promise<boolean>;
    initWallet: () => void;
    /**
     * return midgard network type
     *
     * @param network mainnet or testnet
     */
    static getMidgardNetwork(network: Network): MidgardNetwork;
    get wallets(): Wallet | null;
    /**
     * get midgard client
     */
    getMidgard(): MidgardV2;
    getPoolAddressByChain: (chain: Chain) => Promise<PoolAddress>;
    getChainClient: (chain: Chain) => BnbChain | BtcChain | EthChain | LtcChain | ThorChain | null;
    getWalletByChain: (chain: Chain) => Promise<ChainWallet>;
    loadAllWallets: () => Promise<Wallet | null>;
    getWalletAddressByChain: (chain: Chain) => string | null;
    getExplorerUrl: (chain: Chain) => string;
    getExplorerAddressUrl: (chain: Chain, address: string) => string;
    getExplorerTxUrl: (chain: Chain, txHash: string) => string;
    getTransactions: (chain: Chain, params?: TxHistoryParams | undefined) => Promise<TxsPage>;
    getTransactionData: (chain: Chain, txHash: string) => Promise<Tx>;
    getFees: (chain: Chain, tx?: TxParams | undefined) => Promise<Fees>;
    /**
     * transfer on binance chain
     * @param {TxParams} tx transfer parameter
     */
    transfer: (tx: TxParams, native?: boolean) => Promise<TxHash>;
    /**
     * swap assets
     * @param {Swap} swap Swap Object
     */
    swap: (swap: Swap, recipient?: string | undefined) => Promise<TxHash>;
    /**
     * add liquidity to pool
     * @param {AddLiquidityParams} params
     */
    addLiquidity: (params: AddLiquidityParams) => Promise<AddLiquidityTxns>;
    /**
     * withdraw asset from pool
     * @param {WithdrawParams} params
     */
    withdraw: (params: WithdrawParams) => Promise<TxHash>;
}
