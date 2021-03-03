import { ThorchainSDk } from '../src'

const thorchain = new ThorchainSDk({ network: 'testnet', phrase: 'xxxx' })

const useThorchain = async () => {
  try {
    // quote swap
    const swapEntity = thorchain.quote('BTC.BTC', 'BNB.BNB', 100)

    console.log(swapEntity.outputAmount.assetAmount.toNumber())
    console.log(swapEntity.slip.assetAmount.toNumber())
    console.log(swapEntity.hasInSufficientFee)
    console.log(swapEntity.estimatedNetworkFee.assetAmount.toNumber())

    // execute swap
    const txExplorerUrl = await thorchain.swap(swapEntity)

    console.log(txExplorerUrl)
  } catch (error) {
    console.log(error)
  }
}

useThorchain()
