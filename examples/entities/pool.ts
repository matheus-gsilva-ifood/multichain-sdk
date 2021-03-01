/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Pool, Asset } from '../../src'

// create pool obj
// @ts-ignore
const pool = new Pool(asset, runeDepth, assetDepth, poolDetail)

// @ts-ignore
const pool1 = Pool.fromPoolData(poolData)

// properties
pool.asset
pool.runeDepth
pool.assetDepth
pool.assetUSDPrice
pool.detail // pool detail from midgard
pool.assetPriceInRune
pool.runePriceInAsset
pool.involvesAsset(Asset.RUNE())
pool.priceOf(Asset.RUNE())
pool.depthOf(Asset.RUNE())
