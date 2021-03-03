"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBigNumber = exports.Amount = exports.NUMBER_FORMAT = exports.EMPTY_FORMAT = exports.AmountType = exports.Rounding = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var constants_1 = require("../constants");
var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding = exports.Rounding || (exports.Rounding = {}));
var AmountType;
(function (AmountType) {
    AmountType[AmountType["BASE_AMOUNT"] = 0] = "BASE_AMOUNT";
    AmountType[AmountType["ASSET_AMOUNT"] = 1] = "ASSET_AMOUNT";
})(AmountType = exports.AmountType || (exports.AmountType = {}));
var roundingMode = (_a = {},
    _a[Rounding.ROUND_DOWN] = bignumber_js_1.default.ROUND_DOWN,
    _a[Rounding.ROUND_HALF_UP] = bignumber_js_1.default.ROUND_HALF_UP,
    _a[Rounding.ROUND_UP] = bignumber_js_1.default.ROUND_UP,
    _a);
exports.EMPTY_FORMAT = { groupSeparator: '' };
exports.NUMBER_FORMAT = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
};
var Amount = /** @class */ (function () {
    function Amount(amount, type, decimal) {
        if (type === void 0) { type = AmountType.BASE_AMOUNT; }
        this.decimal = decimal;
        var decimalAmount = Math.pow(10, decimal);
        if (type === AmountType.BASE_AMOUNT) {
            this.baseAmount = new bignumber_js_1.default(amount);
            this.assetAmount = this.baseAmount.dividedBy(decimalAmount);
        }
        else {
            this.assetAmount = new bignumber_js_1.default(amount);
            this.baseAmount = this.assetAmount.multipliedBy(decimalAmount);
        }
    }
    Amount.fromMidgard = function (amount) {
        return new Amount(amount || 0, AmountType.BASE_AMOUNT, constants_1.MULTICHAIN_DECIMAL);
    };
    Amount.fromBaseAmount = function (amount, decimal) {
        return new Amount(amount, AmountType.BASE_AMOUNT, decimal);
    };
    Amount.fromAssetAmount = function (amount, decimal) {
        return new Amount(amount, AmountType.ASSET_AMOUNT, decimal);
    };
    Amount.fromNormalAmount = function (amount) {
        return new Amount(amount || 0, AmountType.ASSET_AMOUNT, 1);
    };
    Amount.sorter = function (a, b) {
        tiny_invariant_1.default(a.decimal === b.decimal, 'Decimal must be same');
        return a.assetAmount.minus(b.assetAmount).toNumber();
    };
    Object.defineProperty(Amount.prototype, "_0_AMOUNT", {
        get: function () {
            return new Amount(0, AmountType.ASSET_AMOUNT, this.decimal);
        },
        enumerable: false,
        configurable: true
    });
    Amount.prototype.add = function (amount) {
        return new Amount(this.assetAmount.plus(amount.assetAmount), AmountType.ASSET_AMOUNT, this.decimal);
    };
    Amount.prototype.sub = function (amount) {
        return new Amount(this.assetAmount.minus(amount.assetAmount), AmountType.ASSET_AMOUNT, this.decimal);
    };
    Amount.prototype.times = function (value) {
        return new Amount(this.baseAmount.multipliedBy(value.baseAmount), AmountType.BASE_AMOUNT, this.decimal);
    };
    Amount.prototype.mul = function (value) {
        if (value instanceof Amount) {
            return new Amount(this.assetAmount.multipliedBy(value.assetAmount), AmountType.ASSET_AMOUNT, this.decimal);
        }
        return new Amount(this.assetAmount.multipliedBy(value), AmountType.ASSET_AMOUNT, this.decimal);
    };
    Amount.prototype.div = function (value) {
        if (value instanceof Amount) {
            return new Amount(this.assetAmount.dividedBy(value.assetAmount), AmountType.ASSET_AMOUNT, this.decimal);
        }
        return new Amount(this.assetAmount.dividedBy(value), AmountType.ASSET_AMOUNT, this.decimal);
    };
    Amount.prototype.gte = function (amount) {
        return this.assetAmount.isGreaterThanOrEqualTo(amount.assetAmount);
    };
    Amount.prototype.gt = function (amount) {
        return this.assetAmount.isGreaterThan(amount.assetAmount);
    };
    Amount.prototype.lte = function (amount) {
        return this.assetAmount.isLessThanOrEqualTo(amount.assetAmount);
    };
    Amount.prototype.lt = function (amount) {
        return this.assetAmount.isLessThan(amount.assetAmount);
    };
    Amount.prototype.eq = function (amount) {
        return this.assetAmount.isEqualTo(amount.assetAmount);
    };
    Amount.prototype.toSignificant = function (significantDigits, format, rounding) {
        if (significantDigits === void 0) { significantDigits = 8; }
        if (format === void 0) { format = exports.NUMBER_FORMAT; }
        if (rounding === void 0) { rounding = Rounding.ROUND_DOWN; }
        tiny_invariant_1.default(Number.isInteger(significantDigits), significantDigits + " is not an integer.");
        tiny_invariant_1.default(significantDigits > 0, significantDigits + " is not positive.");
        bignumber_js_1.default.config({ FORMAT: format });
        var significant = new bignumber_js_1.default(this.assetAmount.toPrecision(significantDigits, roundingMode[rounding]));
        return significant.toFormat();
    };
    Amount.prototype.toFixedDecimal = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 8; }
        if (format === void 0) { format = exports.EMPTY_FORMAT; }
        if (rounding === void 0) { rounding = Rounding.ROUND_DOWN; }
        tiny_invariant_1.default(Number.isInteger(decimalPlaces), decimalPlaces + " is not an integer.");
        tiny_invariant_1.default(decimalPlaces >= 0, decimalPlaces + " is not positive.");
        bignumber_js_1.default.config({ FORMAT: format });
        var fixed = new bignumber_js_1.default(this.assetAmount.toFixed(decimalPlaces, roundingMode[rounding]));
        return fixed.toFormat();
    };
    Amount.prototype.toFixed = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 8; }
        if (format === void 0) { format = exports.NUMBER_FORMAT; }
        if (rounding === void 0) { rounding = Rounding.ROUND_DOWN; }
        return this.toFixedDecimal(decimalPlaces, format, rounding);
    };
    return Amount;
}());
exports.Amount = Amount;
var formatBigNumber = function (bn, decimalPlaces, rounding) {
    if (decimalPlaces === void 0) { decimalPlaces = 8; }
    if (rounding === void 0) { rounding = Rounding.ROUND_DOWN; }
    bignumber_js_1.default.config({ FORMAT: exports.NUMBER_FORMAT });
    var fixed = new bignumber_js_1.default(bn.toFixed(decimalPlaces, roundingMode[rounding]));
    return fixed.toFormat();
};
exports.formatBigNumber = formatBigNumber;
//# sourceMappingURL=amount.js.map