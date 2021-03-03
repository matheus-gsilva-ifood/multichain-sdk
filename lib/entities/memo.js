"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memo = void 0;
var Memo = /** @class */ (function () {
    /**
     * Cannot be constructed.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function Memo() {
    }
    Memo.swapMemo = function (asset, address, limit) {
        var _a;
        if (address === void 0) { address = ''; }
        var chain = asset.chain;
        var symbol = asset.symbol;
        var limitString = (_a = limit === null || limit === void 0 ? void 0 : limit.baseAmount.toString()) !== null && _a !== void 0 ? _a : '';
        return "SWAP:" + chain + "." + symbol + ":" + address + ":" + limitString;
    };
    Memo.depositMemo = function (asset, address) {
        if (address === void 0) { address = ''; }
        var chain = asset.chain;
        var symbol = asset.symbol;
        return "STAKE:" + chain + "." + symbol + ":" + address;
    };
    Memo.withdrawMemo = function (asset, percent) {
        var chain = asset.chain;
        var symbol = asset.symbol;
        // multiply percent by 100
        return "WITHDRAW:" + chain + "." + symbol + ":" + percent.mul(100).toFixed(0);
    };
    return Memo;
}());
exports.Memo = Memo;
//# sourceMappingURL=memo.js.map