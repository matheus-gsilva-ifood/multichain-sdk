import { Amount } from './amount';
import { AssetAmount } from './assetAmount';
import { Percent } from './percent';
import { Pool } from './pool';
export declare type WithdrawAmount = {
    runeAmount: AssetAmount;
    assetAmount: AssetAmount;
};
export interface ILiquidity {
    readonly pool: Pool;
    readonly poolUnits: Amount;
    readonly liquidityUnits: Amount;
    assetShare: AssetAmount;
    runeShare: AssetAmount;
    getLiquidityUnits(runeAddAmount: AssetAmount, assetAddAmount: AssetAmount): Amount;
    getLiquiditySlip(runeAddAmount: AssetAmount, assetAddAmount: AssetAmount): Percent;
    getWithdrawAmount(percent: Percent): WithdrawAmount;
}
export declare class Liquidity implements ILiquidity {
    readonly pool: Pool;
    readonly poolUnits: Amount;
    readonly liquidityUnits: Amount;
    constructor(pool: Pool, liquidityUnits: Amount);
    get assetShare(): AssetAmount;
    get runeShare(): AssetAmount;
    /**
     * get liquidity units after liquidity is added to the pool
     *
     * @param runeAddAmount rune amount to add
     * @param assetAddAmount asset amount to add
     */
    getLiquidityUnits(runeAddAmount: AssetAmount, assetAddAmount: AssetAmount): Amount;
    /**
     * get slip for add liquidity
     *
     * @param runeAddAmount rune amount to add
     * @param assetAddAmount asset amount to add
     */
    getLiquiditySlip(runeAddAmount: AssetAmount, assetAddAmount: AssetAmount): Percent;
    getWithdrawAmount(percent: Percent): WithdrawAmount;
}
