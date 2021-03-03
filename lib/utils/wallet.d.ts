import { Chain } from '@xchainjs/xchain-util';
import { BigNumber } from 'bignumber.js';
import { Wallet } from '../clients/types';
import { Asset, AssetAmount, Pool } from '../entities';
export declare const getWalletAssets: (wallet: Wallet | null) => Asset[];
export declare const getWalletAddressByChain: (wallet: Wallet, chain: Chain) => string | null;
export declare const getAssetUSDPrice: (asset: Asset, pools: Pool[]) => BigNumber;
export declare const getAssetBalance: (asset: Asset, wallet: Wallet) => AssetAmount;
export declare const getTotalUSDPriceInBalance: (balance: AssetAmount[], pools: Pool[]) => BigNumber;
