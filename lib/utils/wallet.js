"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalUSDPriceInBalance = exports.getAssetBalance = exports.getAssetUSDPrice = exports.getWalletAddressByChain = exports.getWalletAssets = void 0;
var bignumber_js_1 = require("bignumber.js");
var entities_1 = require("../entities");
var getWalletAssets = function (wallet) {
    var assets = [];
    if (!wallet)
        return assets;
    Object.keys(wallet).map(function (chain) {
        var chainWallet = wallet[chain];
        chainWallet.balance.forEach(function (data) {
            assets.push(data.asset);
        });
    });
    return assets;
};
exports.getWalletAssets = getWalletAssets;
var getWalletAddressByChain = function (wallet, chain) {
    var _a, _b;
    if (chain in wallet) {
        return (_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet[chain]) === null || _a === void 0 ? void 0 : _a.address) !== null && _b !== void 0 ? _b : null;
    }
    return null;
};
exports.getWalletAddressByChain = getWalletAddressByChain;
var getAssetUSDPrice = function (asset, pools) {
    var assetPool = pools.find(function (pool) { return pool.asset.eq(asset); });
    if (!assetPool)
        return new bignumber_js_1.BigNumber(0);
    return new bignumber_js_1.BigNumber(assetPool.detail.assetPriceUSD);
};
exports.getAssetUSDPrice = getAssetUSDPrice;
var getAssetBalance = function (asset, wallet) {
    var emptyAmount = new entities_1.AssetAmount(asset, entities_1.Amount.fromBaseAmount(0, asset.decimal));
    if (asset.chain in wallet) {
        var balance = (wallet === null || wallet === void 0 ? void 0 : wallet[asset.chain]).balance;
        return (balance.find(function (assetData) { return assetData.asset.eq(asset); }) ||
            emptyAmount);
    }
    return emptyAmount;
};
exports.getAssetBalance = getAssetBalance;
var getTotalUSDPriceInBalance = function (balance, pools) {
    var total = new bignumber_js_1.BigNumber(0);
    if (!balance.length)
        return total;
    balance.forEach(function (assetBalance) {
        var usdPrice = exports.getAssetUSDPrice(assetBalance.asset, pools);
        total = total.plus(assetBalance.amount.assetAmount.multipliedBy(usdPrice));
    });
    return total;
};
exports.getTotalUSDPriceInBalance = getTotalUSDPriceInBalance;
//# sourceMappingURL=wallet.js.map