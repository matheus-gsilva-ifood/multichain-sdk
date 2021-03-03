import { TxHash, Network } from '@xchainjs/xchain-client';
import { Client as EthClient } from '@xchainjs/xchain-ethereum';
import { Chain } from '@xchainjs/xchain-util';
import { Asset, AssetAmount } from '../entities';
import { IClient } from './client';
import { TxParams } from './types';
export interface IEthChain extends IClient {
    getClient(): EthClient;
}
export declare class EthChain implements IEthChain {
    private balances;
    private client;
    readonly chain: Chain;
    constructor({ network, phrase, }: {
        network?: Network;
        phrase: string;
    });
    /**
     * get xchain-binance client
     */
    getClient(): EthClient;
    get balance(): AssetAmount[];
    loadBalance: () => Promise<AssetAmount[]>;
    hasAmountInBalance: (assetAmount: AssetAmount) => Promise<boolean>;
    getAssetBalance: (asset: Asset) => Promise<AssetAmount>;
    /**
     * transfer on binance chain
     * @param {TxParams} tx transfer parameter
     */
    transfer: (tx: TxParams) => Promise<TxHash>;
}
