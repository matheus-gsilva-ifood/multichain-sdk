"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LtcChain = void 0;
var xchain_litecoin_1 = require("@xchainjs/xchain-litecoin");
var xchain_util_1 = require("@xchainjs/xchain-util");
var entities_1 = require("../entities");
var LtcChain = /** @class */ (function () {
    function LtcChain(_a) {
        var _this = this;
        var _b = _a.network, network = _b === void 0 ? 'testnet' : _b, phrase = _a.phrase;
        this.balances = [];
        this.loadBalance = function () { return __awaiter(_this, void 0, void 0, function () {
            var balances, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.getBalance()];
                    case 1:
                        balances = _a.sent();
                        this.balances = balances.map(function (data) {
                            var asset = data.asset, amount = data.amount;
                            var assetObj = new entities_1.Asset(asset.chain, asset.symbol);
                            var amountObj = new entities_1.Amount(amount.amount(), entities_1.AmountType.BASE_AMOUNT, assetObj.decimal);
                            return new entities_1.AssetAmount(assetObj, amountObj);
                        });
                        return [2 /*return*/, this.balances];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.hasAmountInBalance = function (assetAmount) { return __awaiter(_this, void 0, void 0, function () {
            var assetBalance, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadBalance()];
                    case 1:
                        _a.sent();
                        assetBalance = this.balances.find(function (data) {
                            return data.asset.eq(assetAmount.asset);
                        });
                        if (!assetBalance)
                            return [2 /*return*/, false];
                        return [2 /*return*/, assetBalance.amount.gte(assetAmount.amount)];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getAssetBalance = function (asset) { return __awaiter(_this, void 0, void 0, function () {
            var assetBalance, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadBalance()];
                    case 1:
                        _a.sent();
                        assetBalance = this.balances.find(function (data) {
                            return data.asset.eq(asset);
                        });
                        if (!assetBalance)
                            return [2 /*return*/, new entities_1.AssetAmount(asset, entities_1.Amount.fromAssetAmount(0, asset.decimal))];
                        return [2 /*return*/, assetBalance];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * transfer on binance chain
         * @param {TxParams} tx transfer parameter
         */
        this.transfer = function (tx) { return __awaiter(_this, void 0, void 0, function () {
            var assetAmount, recipient, memo, _a, feeOptionKey, asset, amount, feeRates, feeRate, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        assetAmount = tx.assetAmount, recipient = tx.recipient, memo = tx.memo, _a = tx.feeOptionKey, feeOptionKey = _a === void 0 ? 'fastest' : _a;
                        asset = assetAmount.asset;
                        amount = xchain_util_1.baseAmount(assetAmount.amount.baseAmount);
                        return [4 /*yield*/, this.client.getFeeRates()];
                    case 1:
                        feeRates = _b.sent();
                        feeRate = feeRates[feeOptionKey];
                        return [4 /*yield*/, this.client.transfer({
                                asset: {
                                    chain: asset.chain,
                                    symbol: asset.symbol,
                                    ticker: asset.ticker,
                                },
                                amount: amount,
                                recipient: recipient,
                                memo: memo,
                                feeRate: feeRate,
                            })];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        error_4 = _b.sent();
                        return [2 /*return*/, Promise.reject(error_4)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.chain = xchain_util_1.LTCChain;
        this.client = new xchain_litecoin_1.Client({
            network: network,
            phrase: phrase,
        });
    }
    /**
     * get xchain-binance client
     */
    LtcChain.prototype.getClient = function () {
        return this.client;
    };
    Object.defineProperty(LtcChain.prototype, "balance", {
        get: function () {
            return this.balances;
        },
        enumerable: false,
        configurable: true
    });
    return LtcChain;
}());
exports.LtcChain = LtcChain;
//# sourceMappingURL=litecoin.js.map