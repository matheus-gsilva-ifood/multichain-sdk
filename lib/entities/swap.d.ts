import { Amount } from './amount';
import { Asset } from './asset';
import { AssetAmount } from './assetAmount';
import { Percent } from './percent';
import { Pool } from './pool';
import { Price } from './price';
export declare enum SwapType {
    SINGLE_SWAP = 0,
    DOUBLE_SWAP = 1
}
export declare enum QuoteType {
    EXACT_IN = 0,
    EXACT_OUT = 1
}
export interface ISwap {
    readonly swapType: SwapType;
    readonly quoteType: QuoteType;
    readonly inputAsset: Asset;
    readonly outputAsset: Asset;
    readonly price: Price;
    readonly swapPools: Pool[];
    readonly inputAmount: AssetAmount;
    readonly outputAmount: AssetAmount;
    readonly outputAmountAfterFee: AssetAmount;
    readonly fee: AssetAmount;
    readonly outputPercent: Percent;
    readonly feePercent: Percent;
    readonly slip: Percent;
    readonly hasInSufficientFee: boolean;
    readonly estimatedNetworkFee: AssetAmount;
    minOutputAmount: Amount;
    setSlipLimitPercent(limit: number): void;
    getSlipLimitPercent(): number;
    getOutputAmount(inputAmount: AssetAmount): AssetAmount;
    getOutputAfterNetworkFee(inputAmount: AssetAmount): AssetAmount;
    getOutputPercent(inputAmount: AssetAmount): Percent;
    getFeePercent(inputAmount: AssetAmount): Percent;
    getInputAmount(outputAmount: AssetAmount): AssetAmount;
    getSlip(inputAmount: AssetAmount): Percent;
    getFee(inputAmount: AssetAmount): AssetAmount;
}
export declare class Swap implements ISwap {
    private slipLimitPercent;
    readonly swapType: SwapType;
    readonly inputAsset: Asset;
    readonly outputAsset: Asset;
    readonly price: Price;
    readonly swapPools: Pool[];
    readonly quoteType: QuoteType;
    readonly inputAmount: AssetAmount;
    readonly outputAmount: AssetAmount;
    readonly outputAmountAfterFee: AssetAmount;
    readonly fee: AssetAmount;
    readonly outputPercent: Percent;
    readonly feePercent: Percent;
    readonly slip: Percent;
    readonly estimatedNetworkFee: AssetAmount;
    readonly hasInSufficientFee: boolean;
    private _0_AMOUNT;
    constructor(inputAsset: Asset, outputAsset: Asset, pools: Pool[], amount: AssetAmount);
    setSlipLimitPercent(limit: number): void;
    getSlipLimitPercent(): number;
    get minOutputAmount(): Amount;
    static getSingleSwapOutput(inputAmount: AssetAmount, pool: Pool): AssetAmount;
    getOutputAmount(inputAmount: AssetAmount): AssetAmount;
    private getSingleSwapOutputAfterNetworkFee;
    private getNetworkFee;
    getOutputAfterNetworkFee(inputAmount: AssetAmount): AssetAmount;
    getOutputPercent(inputAmount: AssetAmount): Percent;
    getFeePercent(inputAmount: AssetAmount): Percent;
    static getSingleSwapInput(outputAmount: AssetAmount, pool: Pool): AssetAmount;
    getInputAmount(outputAmount: AssetAmount): AssetAmount;
    static getSingleSwapSlip(inputAmount: AssetAmount, pool: Pool): Percent;
    getSlip(inputAmount: AssetAmount): Percent;
    static getSingleSwapFee(inputAmount: AssetAmount, pool: Pool): AssetAmount;
    getFee(inputAmount: AssetAmount): AssetAmount;
}
