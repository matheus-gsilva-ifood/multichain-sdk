import { TxHash } from '@xchainjs/xchain-client';
import { Client as LtcClient, Network } from '@xchainjs/xchain-litecoin';
import { Chain } from '@xchainjs/xchain-util';
import { Asset, AssetAmount } from '../entities';
import { IClient } from './client';
import { TxParams } from './types';
export interface ILtcChain extends IClient {
    getClient(): LtcClient;
}
export declare class LtcChain implements ILtcChain {
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
    getClient(): LtcClient;
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
