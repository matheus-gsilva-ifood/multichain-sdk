"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var amount_1 = require("./amount");
var asset_1 = require("./asset");
var pool_1 = require("./pool");
var Price = /** @class */ (function (_super) {
    __extends(Price, _super);
    function Price(_a) {
        var baseAsset = _a.baseAsset, quoteAsset = _a.quoteAsset, pools = _a.pools, priceAmount = _a.priceAmount;
        var _this = this;
        var amount = priceAmount
            ? amount_1.Amount.fromAssetAmount(priceAmount.assetAmount, baseAsset.decimal)
            : amount_1.Amount.fromAssetAmount(1, baseAsset.decimal);
        _this = _super.call(this, amount.assetAmount, amount_1.AmountType.ASSET_AMOUNT, baseAsset.decimal) || this;
        _this.amount = amount;
        _this.baseAsset = baseAsset;
        _this.quoteAsset = quoteAsset;
        // initialize with 0
        var unitPrice = new bignumber_js_1.default(0);
        var price = new bignumber_js_1.default(0);
        // if quoteAsset is not specified OR is USD, calc the price for USD
        if (!quoteAsset || quoteAsset.eq(asset_1.Asset.USD())) {
            // set USD price for non-RUNE asset
            if (!baseAsset.isRUNE()) {
                var pool = pool_1.Pool.byAsset(baseAsset, pools);
                tiny_invariant_1.default(pool, baseAsset.toString() + " Pool does not exist");
                if (pool) {
                    unitPrice = pool.assetUSDPrice.assetAmount;
                }
            }
            else {
                // set USD Price of RUNE
                var pool = pools === null || pools === void 0 ? void 0 : pools[0];
                if (pool) {
                    unitPrice = pool.runePriceInAsset.mul(pool.assetUSDPrice).assetAmount;
                }
            }
        }
        else if (baseAsset.isRUNE() && !quoteAsset.isRUNE()) {
            var pool = pool_1.Pool.byAsset(quoteAsset, pools);
            tiny_invariant_1.default(pool, quoteAsset.toString() + " Pool does not exist");
            if (pool) {
                unitPrice = pool.runePriceInAsset.assetAmount;
            }
        }
        else if (!baseAsset.isRUNE() && quoteAsset.isRUNE()) {
            var pool = pool_1.Pool.byAsset(baseAsset, pools);
            tiny_invariant_1.default(pool, baseAsset.toString() + " Pool does not exist");
            if (pool) {
                unitPrice = pool.assetPriceInRune.assetAmount;
            }
        }
        else if (!baseAsset.isRUNE() && !quoteAsset.isRUNE()) {
            var baseAssetPool = pool_1.Pool.byAsset(baseAsset, pools);
            var quoteAssetPool = pool_1.Pool.byAsset(quoteAsset, pools);
            tiny_invariant_1.default(baseAssetPool && quoteAssetPool, 'Pool does not exist');
            if (baseAssetPool && quoteAssetPool) {
                unitPrice = baseAssetPool.assetPriceInRune.div(quoteAssetPool.assetPriceInRune).assetAmount;
            }
        }
        else {
            // both are RUNE
            unitPrice = new bignumber_js_1.default(1);
        }
        price = unitPrice.multipliedBy(amount.assetAmount);
        _this.price = price;
        _this.unitPrice = unitPrice;
        return _this;
    }
    Price.prototype.raw = function () {
        return this.price;
    };
    Price.prototype.invert = function () {
        return new bignumber_js_1.default(1).dividedBy(this.raw());
    };
    Price.prototype.toCurrencyFormat = function (decimalPlaces, format, rounding) {
        var _a;
        if (decimalPlaces === void 0) { decimalPlaces = 8; }
        if (format === void 0) { format = amount_1.NUMBER_FORMAT; }
        if (rounding === void 0) { rounding = amount_1.Rounding.ROUND_DOWN; }
        var fixedLabel = this.toFixedRaw(decimalPlaces, format, rounding);
        var isUSDBased = !this.quoteAsset || this.quoteAsset.ticker === 'USD';
        return isUSDBased
            ? "$" + fixedLabel
            : fixedLabel + " " + ((_a = this.quoteAsset) === null || _a === void 0 ? void 0 : _a.ticker);
    };
    Price.prototype.toFixedRaw = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 8; }
        if (format === void 0) { format = amount_1.NUMBER_FORMAT; }
        if (rounding === void 0) { rounding = amount_1.Rounding.ROUND_DOWN; }
        return amount_1.Amount.fromAssetAmount(this.price, 8).toFixed(decimalPlaces, format, rounding);
    };
    Price.prototype.toFixedInverted = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 8; }
        if (format === void 0) { format = amount_1.NUMBER_FORMAT; }
        if (rounding === void 0) { rounding = amount_1.Rounding.ROUND_DOWN; }
        return amount_1.Amount.fromAssetAmount(this.invert(), 8).toFixed(decimalPlaces, format, rounding);
    };
    return Price;
}(amount_1.Amount));
exports.Price = Price;
//# sourceMappingURL=price.js.map