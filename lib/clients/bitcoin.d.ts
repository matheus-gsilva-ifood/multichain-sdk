import { Client as BtcClient, Network } from '@xchainjs/xchain-bitcoin';
import { TxHash } from '@xchainjs/xchain-client';
import { Chain } from '@xchainjs/xchain-util';
import { Asset, AssetAmount } from '../entities';
import { IClient } from './client';
import { TxParams } from './types';
export interface IBtcChain extends IClient {
    getClient(): BtcClient;
}
export declare class BtcChain implements IBtcChain {
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
    getClient(): BtcClient;
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
