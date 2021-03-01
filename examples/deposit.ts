import {
  MultiChain,
  Asset,
  Amount,
  AssetAmount,
  Pool,
  AddLiquidityTxns,
} from '../src'

const client = new MultiChain({ network: 'testnet', phrase: 'xxxx' })

// define rune amount and asset amount
const runeAmount = Amount.fromAssetAmount(100, Asset.RUNE().decimal)
const runeAssetAmount = new AssetAmount(Asset.RUNE(), runeAmount)

const btcAmount = Amount.fromAssetAmount(10, Asset.BTC().decimal)
const btcAssetAmount = new AssetAmount(Asset.BTC(), btcAmount)

// prepare pool info
const poolDetail: any = null // should be pool detail from midgard
const pool = Pool.fromPoolData(poolDetail)

// deposit function
async function deposit() {
  try {
    const txn: AddLiquidityTxns = await client.addLiquidity({
      runeAmount: runeAssetAmount,
      assetAmount: btcAssetAmount,
      pool,
    })

    // get tx explorer url
    const runeTxExplorer = client.getExplorerAddressUrl(
      Asset.RUNE().chain,
      txn.runeTx,
    )
    const assetTxExplorer = client.getExplorerAddressUrl(
      Asset.BTC().chain,
      txn.assetTx,
    )

    console.log(runeTxExplorer, assetTxExplorer)
  } catch (error) {
    console.log(error)
  }
}

deposit()
