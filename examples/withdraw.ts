import { MultiChain, Asset, Percent, Pool } from '../src'

const client = new MultiChain({ network: 'testnet', phrase: 'xxxx' })

// prepare pool info
const poolDetail: any = null // should be pool detail from midgard
const pool = Pool.fromPoolData(poolDetail)

// define percent
const percent = new Percent(25)

// withdraw function
async function withdraw() {
  try {
    const txHash = await client.withdraw({
      pool,
      percent,
    })

    // get tx explorer url
    const txExplorer = client.getExplorerAddressUrl(Asset.RUNE().chain, txHash)

    console.log(txExplorer)
  } catch (error) {
    console.log(error)
  }
}

withdraw()
