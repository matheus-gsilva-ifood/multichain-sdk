import { Chain } from '@xchainjs/xchain-util';
import BigNumber from 'bignumber.js';
import { Rounding, Amount, IAmount } from './amount';
import { Asset } from './asset';
import { Pool } from './pool';
import { Price } from './price';
export interface IAssetAmount extends IAmount {
    readonly asset: Asset;
    readonly amount: Amount;
    add(amount: AssetAmount): AssetAmount;
    sub(amount: AssetAmount): AssetAmount;
    mul(value: BigNumber.Value | Amount): AssetAmount;
    div(value: BigNumber.Value | Amount): AssetAmount;
    toCurrencyFormat({ significantDigits, format, rounding, }: {
        significantDigits?: number;
        format?: BigNumber.Format;
        rounding?: Rounding;
    }, isPrefix?: boolean): string;
    unitPriceIn(asset: Asset, pools: Pool[]): Price;
    totalPriceIn(asset: Asset, pools: Pool[]): Price;
}
export declare class AssetAmount extends Amount implements IAssetAmount {
    readonly asset: Asset;
    readonly amount: Amount;
    static getMinAmountByChain(chain: Chain): AssetAmount;
    constructor(asset: Asset, amount: Amount);
    add(amount: AssetAmount): AssetAmount;
    sub(amount: AssetAmount): AssetAmount;
    mul(value: BigNumber.Value | Amount): AssetAmount;
    div(value: BigNumber.Value | Amount): AssetAmount;
    toCurrencyFormat({ significantDigits, format, rounding, }: {
        significantDigits?: number;
        format?: BigNumber.Format;
        rounding?: Rounding;
    }, isPrefix?: boolean): string;
    unitPriceIn(quoteAsset: Asset, pools: Pool[]): Price;
    totalPriceIn(quoteAsset: Asset, pools: Pool[]): Price;
}
