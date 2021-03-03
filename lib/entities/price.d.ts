import BigNumber from 'bignumber.js';
import { Amount, IAmount, Rounding } from './amount';
import { Asset } from './asset';
import { Pool } from './pool';
export interface IPrice extends IAmount {
    readonly baseAsset: Asset;
    readonly quoteAsset: Asset;
    readonly unitPrice: BigNumber;
    readonly price: BigNumber;
    readonly amount: Amount;
    raw(): BigNumber;
    invert(): BigNumber;
}
export declare class Price extends Amount {
    readonly baseAsset: Asset;
    readonly quoteAsset?: Asset;
    readonly unitPrice: BigNumber;
    readonly price: BigNumber;
    readonly amount: Amount;
    constructor({ baseAsset, quoteAsset, pools, priceAmount, }: {
        baseAsset: Asset;
        quoteAsset?: Asset;
        pools: Pool[];
        priceAmount?: Amount;
    });
    raw(): BigNumber;
    invert(): BigNumber;
    toCurrencyFormat(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixedRaw(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixedInverted(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
}
