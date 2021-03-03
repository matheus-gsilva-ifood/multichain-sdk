"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runeToAsset = exports.chainToFeeAsset = void 0;
var xchain_util_1 = require("@xchainjs/xchain-util");
var entities_1 = require("../entities");
/**
 * return a ticker of asset that represents the network fee
 * @param chain
 */
var chainToFeeAsset = function (chain) {
    if (chain === xchain_util_1.THORChain)
        return 'RUNE';
    return chain;
};
exports.chainToFeeAsset = chainToFeeAsset;
/**
 *
 * @param runeAmount rune amount
 * @param quoteAsset quote asset - selected base currency
 * @param pools pools
 */
var runeToAsset = function (_a) {
    var runeAmount = _a.runeAmount, quoteAsset = _a.quoteAsset, pools = _a.pools;
    var price = new entities_1.Price({
        baseAsset: entities_1.Asset.RUNE(),
        quoteAsset: quoteAsset || entities_1.Asset.RUNE(),
        pools: pools,
        priceAmount: runeAmount,
    });
    return price;
};
exports.runeToAsset = runeToAsset;
//# sourceMappingURL=asset.js.map