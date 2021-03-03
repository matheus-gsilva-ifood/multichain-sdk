import { Chain } from '@xchainjs/xchain-util';
export declare type AssetNetwork = 'mainnet' | 'testnet';
export interface IAsset {
    readonly chain: Chain;
    readonly symbol: string;
    readonly ticker: string;
    readonly decimal: number;
    toString(): string;
    currencySymbol(): string;
    eq(asset: Asset): boolean;
    isRUNE(): boolean;
    isBNB(): boolean;
    sortsBefore(asset: Asset): number;
}
export declare class Asset implements IAsset {
    readonly chain: Chain;
    readonly symbol: string;
    readonly ticker: string;
    readonly decimal: number;
    static USD(): Asset;
    static BNB(): Asset;
    static RUNE(): Asset;
    static BTC(): Asset;
    static ETH(): Asset;
    static LTC(): Asset;
    static fromAssetString(asset: string): Asset | null;
    static getDecimalByChain(chain: Chain): number;
    constructor(chain: Chain, symbol: string);
    static getTicker(symbol: string): string;
    private getAssetObj;
    toString(): string;
    currencySymbol(): string;
    eq(asset: Asset): boolean;
    isRUNE(): boolean;
    isBNB(): boolean;
    sortsBefore(asset: Asset): number;
}
