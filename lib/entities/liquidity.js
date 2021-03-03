"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Liquidity = void 0;
var constants_1 = require("../constants");
var amount_1 = require("./amount");
var asset_1 = require("./asset");
var assetAmount_1 = require("./assetAmount");
var Liquidity = /** @class */ (function () {
    function Liquidity(pool, liquidityUnits) {
        this.pool = pool;
        this.poolUnits = amount_1.Amount.fromBaseAmount(pool.detail.units, constants_1.MULTICHAIN_DECIMAL);
        this.liquidityUnits = liquidityUnits;
    }
    Object.defineProperty(Liquidity.prototype, "assetShare", {
        get: function () {
            // formula: Total Balance * liquidity Units / total Units
            return new assetAmount_1.AssetAmount(this.pool.asset, this.pool.assetDepth.mul(this.liquidityUnits).div(this.poolUnits));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Liquidity.prototype, "runeShare", {
        get: function () {
            // formula: Total Balance * liquidity Units / total Units
            return new assetAmount_1.AssetAmount(asset_1.Asset.RUNE(), this.pool.runeDepth.mul(this.liquidityUnits).div(this.poolUnits));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * get liquidity units after liquidity is added to the pool
     *
     * @param runeAddAmount rune amount to add
     * @param assetAddAmount asset amount to add
     */
    Liquidity.prototype.getLiquidityUnits = function (runeAddAmount, assetAddAmount) {
        // formula: ((R + T) (r T + R t))/(4 R T)
        var R = this.pool.runeDepth.add(runeAddAmount); // Must add r first
        var T = this.pool.assetDepth.add(assetAddAmount); // Must add t first
        var part1 = R.add(T);
        var part2 = runeAddAmount.mul(T).amount;
        var part3 = R.mul(assetAddAmount);
        var numerator = part1.mul(part2.add(part3));
        var denominator = R.mul(T).mul(4);
        return numerator.div(denominator);
    };
    /**
     * get slip for add liquidity
     *
     * @param runeAddAmount rune amount to add
     * @param assetAddAmount asset amount to add
     */
    Liquidity.prototype.getLiquiditySlip = function (runeAddAmount, assetAddAmount) {
        // formula: (t * R - T * r)/ (T*r + R*T)
        var R = this.pool.runeDepth;
        var T = this.pool.assetDepth;
        var numerator = assetAddAmount.amount
            .mul(R)
            .sub(T.mul(runeAddAmount.amount));
        var denominator = T.mul(runeAddAmount).add(R.mul(T));
        return numerator.div(denominator);
    };
    Liquidity.prototype.getWithdrawAmount = function (percent) {
        var runeAmount = this.runeShare.mul(percent);
        var assetAmount = this.assetShare.mul(percent);
        return {
            runeAmount: runeAmount,
            assetAmount: assetAmount,
        };
    };
    return Liquidity;
}());
exports.Liquidity = Liquidity;
//# sourceMappingURL=liquidity.js.map