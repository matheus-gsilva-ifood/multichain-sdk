import { TxHash, Network } from '@xchainjs/xchain-client';
import { Client as ThorClient } from '@xchainjs/xchain-thorchain';
import { Chain } from '@xchainjs/xchain-util';
import { Asset, AssetAmount } from '../entities';
import { IClient } from './client';
import { TxParams } from './types';
export declare type DepositParam = {
    assetAmount: AssetAmount;
    memo?: string;
};
export interface IThorChain extends IClient {
    getClient(): ThorClient;
    deposit(tx: DepositParam): Promise<TxHash>;
}
export declare class ThorChain implements IThorChain {
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
    getClient(): ThorClient;
    get balance(): AssetAmount[];
    loadBalance: () => Promise<AssetAmount[]>;
    hasAmountInBalance: (assetAmount: AssetAmount) => Promise<boolean>;
    getAssetBalance: (asset: Asset) => Promise<AssetAmount>;
    /**
     * transfer on binance chain
     * @param {TxParams} tx transfer parameter
     */
    transfer: (tx: TxParams) => Promise<TxHash>;
    deposit(tx: DepositParam): Promise<TxHash>;
}
