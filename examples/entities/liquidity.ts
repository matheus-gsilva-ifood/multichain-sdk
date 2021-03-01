import { Liquidity, Amount } from '../../src'

// create pool
const pool: any = null
const liquidityUnits = Amount.fromAssetAmount(100, 8)

// create Liquidity Obj
const liquidity = new Liquidity(pool, liquidityUnits)

// properties
liquidity.pool
liquidity.poolUnits
liquidity.liquidityUnits

// getters
liquidity.assetShare
liquidity.runeShare

// calculations usage
/*
  liquidity.getLiquidityUnits(runeAddAmount, assetAddAmount)
  liquidity.getLiquiditySlip(runeAddAmount, assetAddAmount)
  liquidity.getWithdrawAmount(percent)
*/
