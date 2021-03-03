import { Network } from '@xchainjs/xchain-client'

import { MultiChain } from '../clients'
import { Asset, Amount, AssetAmount, Swap, Pool } from '../entities'

export interface IThorchainSDK {
  getFetchInterval(): number
  setFetchInterval(sec: number): void
  quote(inputAsset: string, outputAsset: string, amount: number): Swap
  swap(swapEntity: Swap): Promise<string>
}

export class ThorchainSDK implements IThorchainSDK {
  private multichain: MultiChain

  private pools: Pool[] = []

  private fetchInterval = 60 * 1000 // default 1 Min

  private timer: NodeJS.Timeout | null = null

  constructor({
    network = 'testnet',
    phrase = '',
  }: {
    network?: Network
    phrase?: string
  }) {
    this.multichain = new MultiChain({ network, phrase })
    this.startFetchInterval()
  }

  getFetchInterval = () => {
    return this.fetchInterval
  }

  setFetchInterval = (sec: number) => {
    this.fetchInterval = sec * 1000

    if (this.timer) {
      clearInterval(this.timer)
    }

    this.startFetchInterval()
  }

  private startFetchInterval = () => {
    this.timer = setInterval(this.fetchPools, this.fetchInterval)
  }

  private fetchPools = async () => {
    try {
      // get pool details
      const poolDetails = await this.multichain.midgard.getPools()

      // transform raw pool details to Pool Entities
      this.pools = poolDetails.reduce((res: Pool[], poolDetail) => {
        const poolObj = Pool.fromPoolData(poolDetail)
        if (poolObj) {
          res.push(poolObj)
        }
        return res
      }, [])
    } catch (error) {
      console.log(error)
    }
  }

  quote = (inputAsset: string, outputAsset: string, amount: number): Swap => {
    const input = Asset.fromAssetString(inputAsset)
    const output = Asset.fromAssetString(outputAsset)

    if (!input || !output) {
      throw Error('invalid asset')
    }

    const amountEntity = Amount.fromAssetAmount(amount, input.decimal)
    const inputAssetAmount = new AssetAmount(input, amountEntity)

    try {
      const swapEntity = new Swap(input, output, this.pools, inputAssetAmount)

      return swapEntity
    } catch (error) {
      throw error
    }
  }

  swap = async (swapEntity: Swap): Promise<string> => {
    try {
      const txHash = await this.multichain.swap(swapEntity)

      // get tx explorer url
      const txExplorer = this.multichain.getExplorerAddressUrl(
        swapEntity.inputAsset.chain,
        txHash,
      )

      return txExplorer
    } catch (error) {
      throw error
    }
  }
}
