import { Amount } from './amount';
import { Asset } from './asset';
import { Percent } from './percent';
export declare class Memo {
    /**
     * Cannot be constructed.
     */
    private constructor();
    static swapMemo(asset: Asset, address?: string, limit?: Amount): string;
    static depositMemo(asset: Asset, address?: string): string;
    static withdrawMemo(asset: Asset, percent: Percent): string;
}
