import { Asset } from '../../src'

// create Asset obj
const btc1 = Asset.BTC()
const btc2 = new Asset('BTC', 'BTC.BTC') // chain, symbol
const btc3 = Asset.fromAssetString('BTC.BTC')

// properties
btc1.chain
btc1.symbol
btc1.ticker
btc1.decimal

// sorter
btc1.sortsBefore(Asset.BNB())

// get asset string
btc1.toString() // BTC.BTC

// operator
btc1.eq(btc2)
btc1.isRUNE() // false
