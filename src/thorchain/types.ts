export type QuoteResult = {
  outputAmount: number
  slip: number
  hasInSufficientFee: boolean
  estimatedNetworkFee: number
}
