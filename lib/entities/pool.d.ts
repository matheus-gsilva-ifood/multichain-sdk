import { PoolDetail } from 'midgard-sdk';
import { Amount } from './amount';
import { Asset } from './asset';
export interface IPool {
    readonly asset: Asset;
    readonly runeDepth: Amount;
    readonly assetDepth: Amount;
    readonly assetUSDPrice: Amount;
    readonly detail: PoolDetail;
    assetPriceInRune: Amount;
    runePriceInAsset: Amount;
    involvesAsset(asset: Asset): boolean;
    priceOf(asset: Asset): Amount;
    depthOf(asset: Asset): Amount;
}
export declare class Pool implements IPool {
    readonly asset: Asset;
    readonly runeDepth: Amount;
    readonly assetDepth: Amount;
    readonly assetUSDPrice: Amount;
    readonly detail: PoolDetail;
    static byAsset(asset: Asset, pools: Pool[]): Pool | undefined;
    static fromPoolData(poolDetail: PoolDetail): Pool | null;
    constructor(asset: Asset, runeDepth: Amount, assetDepth: Amount, detail: PoolDetail);
    get assetPriceInRune(): Amount;
    get runePriceInAsset(): Amount;
    involvesAsset(asset: Asset): boolean;
    priceOf(asset: Asset): Amount;
    depthOf(asset: Asset): Amount;
}
