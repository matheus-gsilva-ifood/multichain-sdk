import { ThorchainSDK } from '../src'

const thorchain = new ThorchainSDK({ network: 'testnet', phrase: 'xxxx' })

const useThorchain = async () => {
  try {
    // quote swap
    const swapEntity = thorchain.quote('BTC.BTC', 'BNB.BNB', 100)

    console.log(swapEntity.outputAmount.assetAmount.toNumber())
    console.log(swapEntity.slip.assetAmount.toNumber())
    console.log(swapEntity.hasInSufficientFee)
    console.log(swapEntity.estimatedNetworkFee.assetAmount.toNumber())

    // refresh
    thorchain.refresh()

    // execute swap
    const txExplorerUrl = await thorchain.swap(swapEntity)

    console.log(txExplorerUrl)
  } catch (error) {
    console.log(error)
  }
}

useThorchain()
