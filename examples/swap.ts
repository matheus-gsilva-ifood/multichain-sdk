import { MultiChain, Asset, Amount, AssetAmount, Swap, Pool } from '../src'

const client = new MultiChain({ network: 'testnet', phrase: 'xxxx' })

// define input asset and amount
const inputAsset = Asset.BTC()
const inputAmount = Amount.fromAssetAmount(10, inputAsset.decimal)
const inputAssetAmount = new AssetAmount(inputAsset, inputAmount)

// define output asset
const outputAsset = Asset.BNB()

// prepare pool info
const poolDetail1: any = null // should be pool detail from midgard
const pool1 = Pool.fromPoolData(poolDetail1)
const pool2 = Pool.fromPoolData(poolDetail1)

// create swap object
const swapEntity = new Swap(
  inputAsset,
  outputAsset,
  [pool1, pool2],
  inputAssetAmount,
)

// get swap metrics

console.log(swapEntity.swapType) // SINGLE_SWAP or DOUBLE_SWAP
console.log(swapEntity.swapPools) // pools participated in swap
console.log(swapEntity.outputAmount) // calculated output amount
console.log(swapEntity.outputAmountAfterFee) // calculated output amount after slip fee
console.log(swapEntity.minOutputAmount) // minimum output amount based on the slip tolerence

console.log(swapEntity.slip) // slip percent
console.log(swapEntity.fee) // fee amount
console.log(swapEntity.feePercent) // fee percent based output amount
console.log(swapEntity.hasInSufficientFee) // true if input has insufficient fee
console.log(swapEntity.estimatedNetworkFee) // estimated network fee

// swap function
async function swap() {
  try {
    const txHash = await client.swap(swapEntity)

    // get tx explorer url
    const txExplorer = client.getExplorerAddressUrl(inputAsset.chain, txHash)

    console.log(txExplorer)
  } catch (error) {
    console.log(error)
  }
}

// make swap transfer
swap()
