import { ThorchainSDk } from '../src'

const thorchain = new ThorchainSDk({ network: 'testnet', phrase: 'xxxx' })

const useThorchain = async () => {
  try {
    // quote swap
    const {
      outputAmount,
      slip,
      hasInSufficientFee,
      estimatedNetworkFee,
    } = await thorchain.quote('BTC.BTC', 'BNB.BNB', 100)

    console.log(outputAmount)
    console.log(slip)
    console.log(hasInSufficientFee)
    console.log(estimatedNetworkFee)

    // execute swap

    const txExplorerUrl = await thorchain.swap('BTC.BTC', 'BNB.BNB', 100)

    console.log(txExplorerUrl)
  } catch (error) {
    console.log(error)
  }
}

useThorchain()
