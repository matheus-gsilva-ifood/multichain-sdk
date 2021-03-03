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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percent = void 0;
var amount_1 = require("./amount");
var Percent = /** @class */ (function (_super) {
    __extends(Percent, _super);
    function Percent(amount, type) {
        if (type === void 0) { type = amount_1.AmountType.ASSET_AMOUNT; }
        // Decimal point for percent is 2
        return _super.call(this, amount, type, 2) || this;
    }
    Percent.prototype.toSignificant = function (significantDigits, format, rounding) {
        if (significantDigits === void 0) { significantDigits = 8; }
        if (format === void 0) { format = amount_1.EMPTY_FORMAT; }
        if (rounding === void 0) { rounding = amount_1.Rounding.ROUND_DOWN; }
        return _super.prototype.mul.call(this, 100)
            .toSignificant(significantDigits, format, rounding) + " %";
    };
    Percent.prototype.toFixed = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 8; }
        if (format === void 0) { format = amount_1.NUMBER_FORMAT; }
        if (rounding === void 0) { rounding = amount_1.Rounding.ROUND_DOWN; }
        return _super.prototype.mul.call(this, 100).toFixed(decimalPlaces, format, rounding) + " %";
    };
    return Percent;
}(amount_1.Amount));
exports.Percent = Percent;
//# sourceMappingURL=percent.js.map