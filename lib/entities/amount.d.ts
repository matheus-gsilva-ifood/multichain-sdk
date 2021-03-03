import BigNumber from 'bignumber.js';
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare enum AmountType {
    BASE_AMOUNT = 0,
    ASSET_AMOUNT = 1
}
export declare const EMPTY_FORMAT: BigNumber.Format;
export declare const NUMBER_FORMAT: BigNumber.Format;
export interface IAmount {
    readonly baseAmount: BigNumber;
    readonly assetAmount: BigNumber;
    readonly decimal: number;
    _0_AMOUNT: Amount;
    add(amount: Amount): Amount;
    sub(amount: Amount): Amount;
    times(value: Amount): Amount;
    mul(value: BigNumber.Value | Amount): Amount;
    div(value: BigNumber.Value | Amount): Amount;
    gte(amount: Amount): boolean;
    gt(amount: Amount): boolean;
    lte(amount: Amount): boolean;
    lt(amount: Amount): boolean;
    eq(amount: Amount): boolean;
    toSignificant(significantDigits?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixedDecimal(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
}
export declare class Amount implements IAmount {
    readonly assetAmount: BigNumber;
    readonly baseAmount: BigNumber;
    readonly decimal: number;
    static fromMidgard(amount?: BigNumber.Value): Amount;
    static fromBaseAmount(amount: BigNumber.Value, decimal: number): Amount;
    static fromAssetAmount(amount: BigNumber.Value, decimal: number): Amount;
    static fromNormalAmount(amount?: BigNumber.Value): Amount;
    static sorter(a: Amount, b: Amount): number;
    constructor(amount: BigNumber.Value, type: AmountType | undefined, decimal: number);
    get _0_AMOUNT(): Amount;
    add(amount: Amount): Amount;
    sub(amount: Amount): Amount;
    times(value: Amount): Amount;
    mul(value: BigNumber.Value | Amount): Amount;
    div(value: BigNumber.Value | Amount): Amount;
    gte(amount: Amount): boolean;
    gt(amount: Amount): boolean;
    lte(amount: Amount): boolean;
    lt(amount: Amount): boolean;
    eq(amount: Amount): boolean;
    toSignificant(significantDigits?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixedDecimal(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
}
export declare const formatBigNumber: (bn: BigNumber, decimalPlaces?: number, rounding?: Rounding) => string;
