import { FeeOptionKey, TxHash } from '@xchainjs/xchain-client';
import { AssetAmount, Pool, Percent } from '../entities';
export declare type Network = 'testnet' | 'mainnet';
export declare type TxParams = {
    assetAmount: AssetAmount;
    recipient: string;
    memo?: string;
    feeOptionKey?: FeeOptionKey;
};
export declare type MultiSendParams = {
    assetAmount1: AssetAmount;
    assetAmount2: AssetAmount;
    recipient: string;
    memo?: string;
};
export declare type AddLiquidityParams = {
    pool: Pool;
    runeAmount?: AssetAmount;
    assetAmount: AssetAmount;
};
export declare type AddLiquidityTxns = {
    runeTx?: TxHash;
    assetTx?: TxHash;
};
export declare type WithdrawParams = {
    pool: Pool;
    percent: Percent;
};
export declare const supportedChains: readonly ["BTC", "BNB", "THOR", "ETH", "LTC"];
export declare type SupportedChain = typeof supportedChains[number];
export declare type ChainWallet = {
    address: string;
    balance: AssetAmount[];
};
export declare type Wallet = Record<SupportedChain, ChainWallet>;
