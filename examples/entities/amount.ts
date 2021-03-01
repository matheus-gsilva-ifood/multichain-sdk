import { Amount, AmountType } from '../../src'

// create Amount obj with 10 asset amount and 8 decimal
const amount1 = new Amount(10, AmountType.ASSET_AMOUNT, 8)

// create Amount obj from the asset amount value
const amount2 = Amount.fromAssetAmount(10, 8)

// create Amount obj with 5*10^8 base amount and 8 decimal
const amount3 = new Amount(500000000, AmountType.BASE_AMOUNT, 8)

// create Amount obj from the asset amount value
const amount4 = Amount.fromBaseAmount(500000000, 8)

// create Amount obj from the midgard value, default decimal = 8
const midgardAmount = Amount.fromMidgard(500000000)

// create normal amount with no decimal, default deciaml = 1
const normalAmount = Amount.fromNormalAmount(15)

// properties
amount1.baseAmount
amount2.assetAmount
amount1.decimal

// + - * / operators
amount1.add(amount2)
amount1.sub(amount2)
amount1.times(amount2)
amount1.mul(amount2)
amount1.div(amount2)

// compare
amount1.eq(amount2)
amount1.gt(amount2)
amount1.gte(amount2)
amount1.lt(amount2)
amount1.lte(amount2)

// format
amount1.toFixed(8)
amount1.toSignificant(4)
