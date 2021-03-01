import { Memo, Asset, Percent } from '../../src'

// get memos
Memo.swapMemo(Asset.BNB(), 'address')
Memo.depositMemo(Asset.BNB(), 'address')
Memo.withdrawMemo(Asset.BNB(), new Percent(10))
