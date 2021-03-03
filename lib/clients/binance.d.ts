import { Client as BncClient, Network } from '@xchainjs/xchain-binance';
import { TxHash } from '@xchainjs/xchain-client';
import { Chain } from '@xchainjs/xchain-util';
import { Asset, AssetAmount } from '../entities';
import { IClient } from './client';
import { TxParams, MultiSendParams } from './types';
export interface IBnbChain extends IClient {
    getClient(): BncClient;
    multiSend(params: MultiSendParams): Promise<TxHash>;
}
export declare class BnbChain implements IBnbChain {
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
    getClient(): BncClient;
    get balance(): AssetAmount[];
    loadBalance: () => Promise<AssetAmount[]>;
    hasAmountInBalance: (assetAmount: AssetAmount) => Promise<boolean>;
    getAssetBalance: (asset: Asset) => Promise<AssetAmount>;
    /**
     * transfer on binance chain
     * @param {TxParams} tx transfer parameter
     */
    transfer: (tx: TxParams) => Promise<TxHash>;
    /**
     * multiSend on binance chain
     * @param {MultiSendParams} params transfer parameter
     */
    multiSend: (params: MultiSendParams) => Promise<TxHash>;
}
