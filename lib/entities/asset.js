"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
var xchain_util_1 = require("@xchainjs/xchain-util");
var decimals_1 = require("../constants/decimals");
var Asset = /** @class */ (function () {
    function Asset(chain, symbol) {
        this.chain = chain;
        this.symbol = symbol;
        this.ticker = Asset.getTicker(symbol);
        this.decimal = Asset.getDecimalByChain(chain);
    }
    // created for USD pricing
    Asset.USD = function () {
        return new Asset(xchain_util_1.THORChain, 'USD-USD');
    };
    Asset.BNB = function () {
        return new Asset(xchain_util_1.AssetBNB.chain, xchain_util_1.AssetBNB.symbol);
    };
    Asset.RUNE = function () {
        return new Asset(xchain_util_1.AssetRuneNative.chain, xchain_util_1.AssetRuneNative.symbol);
    };
    Asset.BTC = function () {
        return new Asset(xchain_util_1.AssetBTC.chain, xchain_util_1.AssetBTC.symbol);
    };
    Asset.ETH = function () {
        return new Asset(xchain_util_1.AssetETH.chain, xchain_util_1.AssetETH.symbol);
    };
    Asset.LTC = function () {
        return new Asset(xchain_util_1.AssetLTC.chain, xchain_util_1.AssetLTC.symbol);
    };
    Asset.fromAssetString = function (asset) {
        var _a = xchain_util_1.assetFromString(asset) || {}, chain = _a.chain, symbol = _a.symbol;
        if (chain && symbol) {
            return new Asset(chain, symbol);
        }
        return null;
    };
    Asset.getDecimalByChain = function (chain) {
        if (chain === xchain_util_1.BNBChain)
            return decimals_1.BNB_DECIMAL;
        if (chain === xchain_util_1.BTCChain)
            return decimals_1.BTC_DECIMAL;
        if (chain === xchain_util_1.THORChain)
            return decimals_1.THORCHAIN_DECIMAL;
        if (chain === xchain_util_1.LTCChain)
            return decimals_1.LTC_DECIMAL;
        // TODO: decimals are vary in the ETH chain
        if (chain === xchain_util_1.ETHChain)
            return decimals_1.ETH_DECIMAL;
        return decimals_1.DEFAULT_CHAIN_DECIMAL;
    };
    Asset.getTicker = function (symbol) {
        return symbol.split('-')[0];
    };
    Asset.prototype.getAssetObj = function () {
        return { chain: this.chain, symbol: this.symbol, ticker: this.ticker };
    };
    Asset.prototype.toString = function () {
        return xchain_util_1.assetToString(this.getAssetObj());
    };
    Asset.prototype.currencySymbol = function () {
        return xchain_util_1.currencySymbolByAsset(this.getAssetObj());
    };
    Asset.prototype.eq = function (asset) {
        return (this.chain === asset.chain &&
            this.symbol === asset.symbol &&
            this.ticker === asset.ticker &&
            this.decimal === asset.decimal);
    };
    Asset.prototype.isRUNE = function () {
        return this.eq(Asset.RUNE());
    };
    Asset.prototype.isBNB = function () {
        return this.eq(Asset.BNB());
    };
    Asset.prototype.sortsBefore = function (asset) {
        if (this.eq(asset))
            return 0;
        if (this.chain !== asset.chain) {
            if (this.chain < asset.chain)
                return 1;
            if (this.chain < asset.chain)
                return -1;
        }
        if (this.symbol < asset.symbol)
            return 1;
        if (this.symbol > asset.symbol)
            return -1;
        return 1;
    };
    return Asset;
}());
exports.Asset = Asset;
//# sourceMappingURL=asset.js.map