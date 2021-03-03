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
exports.AssetAmount = void 0;
var xchain_util_1 = require("@xchainjs/xchain-util");
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var amount_1 = require("./amount");
var asset_1 = require("./asset");
var price_1 = require("./price");
var AssetAmount = /** @class */ (function (_super) {
    __extends(AssetAmount, _super);
    function AssetAmount(asset, amount) {
        var _this = _super.call(this, amount.assetAmount, amount_1.AmountType.ASSET_AMOUNT, asset.decimal) || this;
        _this.asset = asset;
        // make sure amount has same decimal as asset
        _this.amount = new amount_1.Amount(amount.assetAmount, amount_1.AmountType.ASSET_AMOUNT, asset.decimal);
        return _this;
    }
    AssetAmount.getMinAmountByChain = function (chain) {
        if (chain === xchain_util_1.BNBChain) {
            return new AssetAmount(asset_1.Asset.BNB(), amount_1.Amount.fromBaseAmount(1, asset_1.Asset.BNB().decimal));
        }
        // 1000 satoshi
        if (chain === xchain_util_1.BTCChain) {
            return new AssetAmount(asset_1.Asset.BTC(), amount_1.Amount.fromBaseAmount(1000, asset_1.Asset.BTC().decimal));
        }
        // 1 Thor
        if (chain === xchain_util_1.THORChain) {
            return new AssetAmount(asset_1.Asset.RUNE(), amount_1.Amount.fromBaseAmount(1, asset_1.Asset.RUNE().decimal));
        }
        // 0 ETH
        if (chain === xchain_util_1.ETHChain) {
            return new AssetAmount(asset_1.Asset.ETH(), amount_1.Amount.fromBaseAmount(0, asset_1.Asset.ETH().decimal));
        }
        if (chain === xchain_util_1.LTCChain) {
            return new AssetAmount(asset_1.Asset.LTC(), amount_1.Amount.fromBaseAmount(1, asset_1.Asset.LTC().decimal));
        }
        return new AssetAmount(asset_1.Asset.RUNE(), amount_1.Amount.fromBaseAmount(1, asset_1.Asset.RUNE().decimal));
    };
    AssetAmount.prototype.add = function (amount) {
        tiny_invariant_1.default(this.asset.eq(amount.asset), 'asset must be same');
        return new AssetAmount(this.asset, this.amount.add(amount.amount));
    };
    AssetAmount.prototype.sub = function (amount) {
        tiny_invariant_1.default(this.asset.eq(amount.asset), 'asset must be same');
        return new AssetAmount(this.asset, this.amount.sub(amount.amount));
    };
    AssetAmount.prototype.mul = function (value) {
        var amount;
        if (value instanceof amount_1.Amount) {
            amount = new amount_1.Amount(this.assetAmount.multipliedBy(value.assetAmount), amount_1.AmountType.ASSET_AMOUNT, this.decimal);
        }
        else {
            amount = new amount_1.Amount(this.assetAmount.multipliedBy(value), amount_1.AmountType.ASSET_AMOUNT, this.decimal);
        }
        return new AssetAmount(this.asset, amount);
    };
    AssetAmount.prototype.div = function (value) {
        var amount;
        if (value instanceof amount_1.Amount) {
            amount = new amount_1.Amount(this.assetAmount.dividedBy(value.assetAmount), amount_1.AmountType.ASSET_AMOUNT, this.decimal);
        }
        else {
            amount = new amount_1.Amount(this.assetAmount.dividedBy(value), amount_1.AmountType.ASSET_AMOUNT, this.decimal);
        }
        return new AssetAmount(this.asset, amount);
    };
    AssetAmount.prototype.toCurrencyFormat = function (_a, isPrefix) {
        var significantDigits = _a.significantDigits, format = _a.format, rounding = _a.rounding;
        if (isPrefix === void 0) { isPrefix = true; }
        var significantValue = _super.prototype.toSignificant.call(this, significantDigits, format, rounding);
        if (isPrefix) {
            return this.asset.currencySymbol + " " + significantValue;
        }
        return significantValue + " " + this.asset.currencySymbol;
    };
    AssetAmount.prototype.unitPriceIn = function (quoteAsset, pools) {
        return new price_1.Price({
            baseAsset: this.asset,
            quoteAsset: quoteAsset,
            pools: pools,
        });
    };
    AssetAmount.prototype.totalPriceIn = function (quoteAsset, pools) {
        return new price_1.Price({
            baseAsset: this.asset,
            quoteAsset: quoteAsset,
            pools: pools,
            priceAmount: amount_1.Amount.fromAssetAmount(this.assetAmount, this.decimal),
        });
    };
    return AssetAmount;
}(amount_1.Amount));
exports.AssetAmount = AssetAmount;
//# sourceMappingURL=assetAmount.js.map