import BigNumber from 'bignumber.js';
import { Rounding, Amount, AmountType } from './amount';
export declare class Percent extends Amount {
    constructor(amount: BigNumber.Value, type?: AmountType);
    toSignificant(significantDigits?: number, format?: BigNumber.Format, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: BigNumber.Format, rounding?: Rounding): string;
}
