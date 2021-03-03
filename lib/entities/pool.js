"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var constants_1 = require("../constants");
var amount_1 = require("./amount");
var asset_1 = require("./asset");
var Pool = /** @class */ (function () {
    function Pool(asset, runeDepth, assetDepth, detail) {
        this.asset = asset;
        this.runeDepth = runeDepth;
        this.assetDepth = assetDepth;
        this.detail = detail;
        this.assetUSDPrice = amount_1.Amount.fromAssetAmount(detail.assetPriceUSD, constants_1.MULTICHAIN_DECIMAL);
    }
    // get Pool by non-rune asset
    Pool.byAsset = function (asset, pools) {
        if (!asset.isRUNE()) {
            return pools.find(function (pool) { return asset.eq(pool.asset); });
        }
    };
    Pool.fromPoolData = function (poolDetail) {
        var asset = poolDetail.asset, runeDepth = poolDetail.runeDepth, assetDepth = poolDetail.assetDepth;
        var assetObj = asset_1.Asset.fromAssetString(asset);
        if (assetObj && runeDepth && assetDepth) {
            var runeAmount = amount_1.Amount.fromBaseAmount(runeDepth, constants_1.MULTICHAIN_DECIMAL);
            var assetAmount = amount_1.Amount.fromBaseAmount(assetDepth, constants_1.MULTICHAIN_DECIMAL);
            return new Pool(assetObj, runeAmount, assetAmount, poolDetail);
        }
        return null;
    };
    Object.defineProperty(Pool.prototype, "assetPriceInRune", {
        get: function () {
            return this.runeDepth.div(this.assetDepth);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pool.prototype, "runePriceInAsset", {
        get: function () {
            return this.assetDepth.div(this.runeDepth);
        },
        enumerable: false,
        configurable: true
    });
    Pool.prototype.involvesAsset = function (asset) {
        return asset.isRUNE() || this.asset.eq(asset);
    };
    Pool.prototype.priceOf = function (asset) {
        tiny_invariant_1.default(this.involvesAsset(asset), 'Invalid asset');
        if (asset.isRUNE())
            return this.runePriceInAsset;
        return this.assetPriceInRune;
    };
    Pool.prototype.depthOf = function (asset) {
        tiny_invariant_1.default(this.involvesAsset(asset), 'Invalid asset');
        if (asset.isRUNE())
            return this.runeDepth;
        return this.assetDepth;
    };
    return Pool;
}());
exports.Pool = Pool;
//# sourceMappingURL=pool.js.map