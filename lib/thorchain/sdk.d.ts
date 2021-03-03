import { Network } from '@xchainjs/xchain-client';
import { MultiChain, Wallet } from '../clients';
import { Swap, Pool } from '../entities';
export interface IThorchainSDK {
    multichain: MultiChain;
    pools: Pool[];
    quote(inputAsset: string, outputAsset: string, amount: number): Promise<Swap>;
    swap(swapEntity: Swap): Promise<string>;
    validatePhrase(phrase: string): boolean;
    setPhrase(phrase: string): void;
    loadWallet(): Promise<Wallet | null>;
}
export declare class ThorchainSDK implements IThorchainSDK {
    multichain: MultiChain;
    pools: Pool[];
    constructor({ network, phrase, }: {
        network?: Network;
        phrase?: string;
    });
    validatePhrase: (phrase: string) => boolean;
    setPhrase: (phrase: string) => void;
    loadWallet: () => Promise<Wallet | null>;
    private fetchPools;
    quote: (inputAsset: string, outputAsset: string, amount: number) => Promise<Swap>;
    swap: (swapEntity: Swap) => Promise<string>;
}
