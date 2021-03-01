import {
  MultiChain,
  Asset,
  Amount,
  Memo,
  AssetAmount,
  AmountType,
  TxParams,
} from '../src'

const client = new MultiChain({ network: 'testnet', phrase: 'xxxx' })

// define asset
const asset = Asset.fromAssetString('BTC.BTC') // equals: Asset.BTC()

// define amount
const amount1 = new Amount(10, AmountType.ASSET_AMOUNT, 8)

// alternative method for amount
const amount2 = Amount.fromAssetAmount(10, 8)

// define asset amount
const assetAmount = new AssetAmount(asset, amount1)

// transfer function
async function transfer(txParam: TxParams) {
  try {
    const txHash = await client.transfer(txParam)

    // get tx explorer url
    const txExplorer = client.getExplorerAddressUrl(asset.chain, txHash)

    console.log(txExplorer)
  } catch (error) {
    console.log(error)
  }
}

// make normal transfer
transfer({
  assetAmount,
  recipient: 'some address',
  memo: 'some memo',
})

// make swap transfer

async function swap() {
  try {
    const poolAddress = await client.getPoolAddressByChain(asset.chain)
    const swapMemo = Memo.swapMemo(asset, poolAddress)

    if (poolAddress) {
      transfer({
        assetAmount,
        recipient: poolAddress,
        memo: swapMemo,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

swap()
