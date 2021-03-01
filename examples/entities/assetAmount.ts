import { BNBChain } from '@xchainjs/xchain-util'

import { AssetAmount, Asset, Amount } from '../../src'

const asset = Asset.BNB()
const amount = Amount.fromAssetAmount(10, asset.decimal)

const assetAmount = new AssetAmount(asset, amount)
const assetAmount2 = new AssetAmount(asset, amount)

// get min transferrable amount
AssetAmount.getMinAmountByChain(BNBChain)

// operators
assetAmount.add(assetAmount2)
assetAmount.sub(assetAmount2)
assetAmount.mul(assetAmount2)
assetAmount.div(assetAmount2)

// format
assetAmount.toFixed(8)

// get price
const price = assetAmount.totalPriceIn(Asset.BTC(), []) // quoteAsset, pools
