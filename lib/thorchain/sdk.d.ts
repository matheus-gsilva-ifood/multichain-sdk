import { Network } from '@xchainjs/xchain-client';
import { MultiChain } from '../clients';
import { Swap, Pool } from '../entities';
export interface IThorchainSDK {
    multichain: MultiChain;
    pools: Pool[];
    getFetchInterval(): number;
    setFetchInterval(sec: number): void;
    quote(inputAsset: string, outputAsset: string, amount: number): Swap;
    swap(swapEntity: Swap): Promise<string>;
    validatePhrase(phrase: string): boolean;
    setPhrase(phrase: string): void;
}
export declare class ThorchainSDK implements IThorchainSDK {
    multichain: MultiChain;
    pools: Pool[];
    private fetchInterval;
    private timer;
    constructor({ network, phrase, }: {
        network?: Network;
        phrase?: string;
    });
    validatePhrase: (phrase: string) => boolean;
    setPhrase: (phrase: string) => void;
    getFetchInterval: () => number;
    setFetchInterval: (sec: number) => void;
    private startFetchInterval;
    private fetchPools;
    quote: (inputAsset: string, outputAsset: string, amount: number) => Swap;
    swap: (swapEntity: Swap) => Promise<string>;
}
