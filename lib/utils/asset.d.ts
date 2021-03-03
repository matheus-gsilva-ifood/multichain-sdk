import { Chain } from '@xchainjs/xchain-util';
import { Amount, Asset, Pool, Price } from '../entities';
/**
 * return a ticker of asset that represents the network fee
 * @param chain
 */
export declare const chainToFeeAsset: (chain: Chain) => string;
/**
 *
 * @param runeAmount rune amount
 * @param quoteAsset quote asset - selected base currency
 * @param pools pools
 */
export declare const runeToAsset: ({ runeAmount, quoteAsset, pools, }: {
    runeAmount: Amount;
    quoteAsset?: Asset | null | undefined;
    pools: Pool[];
}) => Price;
