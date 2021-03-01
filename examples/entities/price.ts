import { Price, Asset, Amount } from '../../src'

// create price obj

const price = new Price({
  baseAsset: Asset.RUNE(),
  quoteAsset: Asset.BNB(),
  pools: [], // should input pool objects
  priceAmount: Amount.fromAssetAmount(10, 8), // optional
})

// properties
price.baseAsset
price.quoteAsset
price.unitPrice
price.amount
price.raw()
price.invert()

// format

price.toFixedRaw(8)
price.toFixedInverted(8)
price.toCurrencyFormat(4)
