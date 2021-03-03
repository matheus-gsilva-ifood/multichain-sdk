import { Network } from '@xchainjs/xchain-client'

import { MultiChain } from '../clients'
import { Asset, Amount, AssetAmount, Swap, Pool } from '../entities'
import { QuoteResult } from './types'

export class ThorchainSDk {
  private multichain: MultiChain
  private pools: Pool[] = []

  constructor({
    network = 'testnet',
    phrase = '',
  }: {
    network?: Network
    phrase?: string
  }) {
    this.multichain = new MultiChain({ network, phrase })
  }

  fetchPools = async () => {
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

  quote = async (
    inputAsset: string,
    outputAsset: string,
    amount: number,
  ): Promise<QuoteResult> => {
    const input = Asset.fromAssetString(inputAsset)
    const output = Asset.fromAssetString(outputAsset)

    if (!input || !output) {
      throw Error('invalid asset')
    }

    const amountEntity = Amount.fromAssetAmount(amount, input.decimal)
    const inputAssetAmount = new AssetAmount(input, amountEntity)

    try {
      await this.fetchPools()

      const swapEntity = new Swap(input, output, this.pools, inputAssetAmount)

      return {
        outputAmount: swapEntity.outputAmount.assetAmount.toNumber(),
        slip: swapEntity.slip.assetAmount.toNumber(),
        hasInSufficientFee: swapEntity.hasInSufficientFee,
        estimatedNetworkFee: swapEntity.estimatedNetworkFee.assetAmount.toNumber(),
      }
    } catch (error) {
      throw error
    }
  }

  swap = async (
    inputAsset: string,
    outputAsset: string,
    amount: number,
  ): Promise<string> => {
    const input = Asset.fromAssetString(inputAsset)
    const output = Asset.fromAssetString(outputAsset)

    if (!input || !output) {
      throw Error('invalid asset')
    }

    const amountEntity = Amount.fromAssetAmount(amount, input.decimal)
    const inputAssetAmount = new AssetAmount(input, amountEntity)

    try {
      await this.fetchPools()

      const swapEntity = new Swap(input, output, this.pools, inputAssetAmount)

      const txHash = await this.multichain.swap(swapEntity)

      // get tx explorer url
      const txExplorer = this.multichain.getExplorerAddressUrl(
        input.chain,
        txHash,
      )

      return txExplorer
    } catch (error) {
      throw error
    }
  }
}
