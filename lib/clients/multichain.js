"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MultiChain = void 0;
var xchain_crypto_1 = require("@xchainjs/xchain-crypto");
var xchain_util_1 = require("@xchainjs/xchain-util");
var midgard_sdk_1 = require("midgard-sdk");
var entities_1 = require("../entities");
var binance_1 = require("./binance");
var bitcoin_1 = require("./bitcoin");
// import { BchChain } from './bitcoinCash'
var ethereum_1 = require("./ethereum");
var litecoin_1 = require("./litecoin");
var thorchain_1 = require("./thorchain");
var types_1 = require("./types");
// thorchain pool address is empty string
var THORCHAIN_POOL_ADDRESS = '';
var MultiChain = /** @class */ (function () {
    function MultiChain(_a) {
        var _this = this;
        var _b = _a.network, network = _b === void 0 ? 'testnet' : _b, _c = _a.phrase, phrase = _c === void 0 ? '' : _c;
        this.wallet = null;
        this.chains = types_1.supportedChains;
        this.setPhrase = function (phrase) {
            _this.phrase = phrase;
            _this.thor.getClient().setPhrase(phrase);
            _this.bnb.getClient().setPhrase(phrase);
            _this.btc.getClient().setPhrase(phrase);
            _this.eth.getClient().setPhrase(phrase);
            _this.ltc.getClient().setPhrase(phrase);
            // this.bch.getClient().setPhrase(phrase)
            _this.initWallet();
        };
        this.getPhrase = function () {
            return _this.phrase;
        };
        // used to validate keystore and password with phrase
        this.validateKeystore = function (keystore, password) { return __awaiter(_this, void 0, void 0, function () {
            var phrase;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, xchain_crypto_1.decryptFromKeystore(keystore, password)];
                    case 1:
                        phrase = _a.sent();
                        return [2 /*return*/, phrase === this.phrase];
                }
            });
        }); };
        this.initWallet = function () {
            _this.wallet = {
                THOR: {
                    address: _this.thor.getClient().getAddress(),
                    balance: [],
                },
                BNB: {
                    address: _this.bnb.getClient().getAddress(),
                    balance: [],
                },
                BTC: {
                    address: _this.btc.getClient().getAddress(),
                    balance: [],
                },
                ETH: {
                    address: _this.eth.getClient().getAddress(),
                    balance: [],
                },
                LTC: {
                    address: _this.ltc.getClient().getAddress(),
                    balance: [],
                },
            };
        };
        this.getPoolAddressByChain = function (chain) { return __awaiter(_this, void 0, void 0, function () {
            var poolAddress, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // for thorchain, return empty string
                        if (chain === xchain_util_1.THORChain)
                            return [2 /*return*/, THORCHAIN_POOL_ADDRESS];
                        return [4 /*yield*/, this.midgard.getInboundAddressByChain(chain)];
                    case 1:
                        poolAddress = _a.sent();
                        return [2 /*return*/, poolAddress];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getChainClient = function (chain) {
            if (chain === xchain_util_1.THORChain)
                return _this.thor;
            if (chain === xchain_util_1.BNBChain)
                return _this.bnb;
            if (chain === xchain_util_1.BTCChain)
                return _this.btc;
            if (chain === xchain_util_1.ETHChain)
                return _this.eth;
            if (chain === xchain_util_1.LTCChain)
                return _this.ltc;
            // if (chain === BCHChain) return this.bch
            return null;
        };
        this.getWalletByChain = function (chain) { return __awaiter(_this, void 0, void 0, function () {
            var chainClient, balance, address, error_2;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        chainClient = this.getChainClient(chain);
                        if (!chainClient)
                            throw new Error('invalid chain');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (chainClient === null || chainClient === void 0 ? void 0 : chainClient.loadBalance())];
                    case 2:
                        balance = (_b = (_c.sent())) !== null && _b !== void 0 ? _b : [];
                        address = chainClient.getClient().getAddress();
                        if (this.wallet && chain in this.wallet) {
                            this.wallet = __assign(__assign({}, this.wallet), (_a = {}, _a[chain] = {
                                address: address,
                                balance: balance,
                            }, _a));
                        }
                        return [2 /*return*/, {
                                address: address,
                                balance: balance,
                            }];
                    case 3:
                        error_2 = _c.sent();
                        return [2 /*return*/, Promise.reject(error_2)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.loadAllWallets = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all(this.chains.map(function (chain) {
                                return new Promise(function (resolve) {
                                    _this.getWalletByChain(chain)
                                        .then(function (data) { return resolve(data); })
                                        .catch(function (err) {
                                        console.log(err);
                                        resolve([]);
                                    });
                                });
                            }))];
                    case 1:
                        _a.sent();
                        console.log('wallet', this.wallet);
                        return [2 /*return*/, this.wallet];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getWalletAddressByChain = function (chain) {
            var _a, _b, _c;
            if (_this.wallet && chain in _this.wallet) {
                return (_c = (_b = (_a = _this.wallet) === null || _a === void 0 ? void 0 : _a[chain]) === null || _b === void 0 ? void 0 : _b.address) !== null && _c !== void 0 ? _c : null;
            }
            return null;
        };
        this.getExplorerUrl = function (chain) {
            var chainClient = _this.getChainClient(chain);
            if (!chainClient)
                return '#';
            return chainClient.getClient().getExplorerUrl();
        };
        this.getExplorerAddressUrl = function (chain, address) {
            var chainClient = _this.getChainClient(chain);
            if (!chainClient)
                return '#';
            return chainClient.getClient().getExplorerAddressUrl(address);
        };
        this.getExplorerTxUrl = function (chain, txHash) {
            var chainClient = _this.getChainClient(chain);
            if (!chainClient)
                return '#';
            return chainClient.getClient().getExplorerTxUrl(txHash);
        };
        this.getTransactions = function (chain, params) {
            var chainClient = _this.getChainClient(chain);
            if (!chainClient)
                throw new Error('invalid chain');
            return chainClient.getClient().getTransactions(params);
        };
        this.getTransactionData = function (chain, txHash) {
            var chainClient = _this.getChainClient(chain);
            if (!chainClient)
                throw new Error('invalid chain');
            return chainClient.getClient().getTransactionData(txHash);
        };
        this.getFees = function (chain, tx) {
            var chainClient = _this.getChainClient(chain);
            if (!chainClient)
                throw new Error('invalid chain');
            if (chain === 'ETH' && tx) {
                var assetAmount = tx.assetAmount, recipient = tx.recipient;
                var asset = assetAmount.asset;
                var amount = xchain_util_1.baseAmount(assetAmount.amount.baseAmount);
                var assetObj = {
                    chain: asset.chain,
                    symbol: asset.symbol,
                    ticker: asset.ticker,
                };
                return chainClient.getClient().getFees({
                    asset: assetObj,
                    amount: amount,
                    recipient: recipient,
                });
            }
            return chainClient.getClient().getFees();
        };
        /**
         * transfer on binance chain
         * @param {TxParams} tx transfer parameter
         */
        this.transfer = function (tx, native) {
            if (native === void 0) { native = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var chain, chainClient, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            chain = tx.assetAmount.asset.chain;
                            // for swap, add, withdraw tx in thorchain, send deposit tx
                            if (chain === xchain_util_1.THORChain &&
                                tx.recipient === THORCHAIN_POOL_ADDRESS &&
                                native) {
                                return [2 /*return*/, this.thor.deposit(tx)];
                            }
                            chainClient = this.getChainClient(chain);
                            if (!chainClient) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, chainClient.transfer(tx)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_4 = _a.sent();
                            return [2 /*return*/, Promise.reject(error_4)];
                        case 4: return [3 /*break*/, 6];
                        case 5: throw new Error('Chain does not exist');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * swap assets
         * @param {Swap} swap Swap Object
         */
        this.swap = function (swap, recipient) { return __awaiter(_this, void 0, void 0, function () {
            var walletAddress, recipientAddress, poolAddress, memo, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        if (!!this.wallet) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.reject(new Error('Wallet not detected'))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        walletAddress = this.getWalletAddressByChain(swap.outputAsset.chain);
                        if (!!walletAddress) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.reject(new Error('Wallet Address not detected'))];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (!swap.hasInSufficientFee) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.reject(new Error('Insufficient Fee'))];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        recipientAddress = recipient || walletAddress;
                        return [4 /*yield*/, this.getPoolAddressByChain(swap.inputAsset.chain)];
                    case 7:
                        poolAddress = _a.sent();
                        memo = entities_1.Memo.swapMemo(swap.outputAsset, recipientAddress, swap.minOutputAmount);
                        return [4 /*yield*/, this.transfer({
                                assetAmount: swap.inputAmount,
                                recipient: poolAddress,
                                memo: memo,
                            })];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9:
                        error_5 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_5)];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        /**
         * add liquidity to pool
         * @param {AddLiquidityParams} params
         */
        this.addLiquidity = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var pool, runeAmount, assetAmount, chain, poolAddress, runeTx, assetTx_1, assetTx, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        pool = params.pool, runeAmount = params.runeAmount, assetAmount = params.assetAmount;
                        chain = pool.asset.chain;
                        return [4 /*yield*/, this.getPoolAddressByChain(chain)
                            // sym stake
                        ];
                    case 1:
                        poolAddress = _a.sent();
                        if (!(runeAmount && runeAmount.gt(runeAmount._0_AMOUNT))) return [3 /*break*/, 6];
                        if (!assetAmount.lte(assetAmount._0_AMOUNT)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.reject(new Error('Invalid Asset Amount'))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.transfer({
                            assetAmount: runeAmount,
                            recipient: THORCHAIN_POOL_ADDRESS,
                            memo: entities_1.Memo.depositMemo(entities_1.Asset.RUNE()),
                        })
                        // 2. send asset
                    ];
                    case 4:
                        runeTx = _a.sent();
                        return [4 /*yield*/, this.transfer({
                                assetAmount: assetAmount,
                                recipient: poolAddress,
                                memo: entities_1.Memo.depositMemo(pool.asset),
                            })];
                    case 5:
                        assetTx_1 = _a.sent();
                        return [2 /*return*/, {
                                runeTx: runeTx,
                                assetTx: assetTx_1,
                            }];
                    case 6:
                        if (!assetAmount.lte(assetAmount._0_AMOUNT)) return [3 /*break*/, 8];
                        return [4 /*yield*/, Promise.reject(new Error('Invalid Asset Amount'))];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8: return [4 /*yield*/, this.transfer({
                            assetAmount: assetAmount,
                            recipient: poolAddress,
                            memo: entities_1.Memo.depositMemo(pool.asset),
                        })];
                    case 9:
                        assetTx = _a.sent();
                        return [2 /*return*/, {
                                assetTx: assetTx,
                            }];
                    case 10:
                        error_6 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_6)];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        /**
         * withdraw asset from pool
         * @param {WithdrawParams} params
         */
        this.withdraw = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var pool, percent, memo, chain, poolAddress, txHash, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        pool = params.pool, percent = params.percent;
                        memo = entities_1.Memo.withdrawMemo(pool.asset, percent);
                        chain = pool.asset.chain;
                        return [4 /*yield*/, this.getPoolAddressByChain(chain)];
                    case 1:
                        poolAddress = _a.sent();
                        return [4 /*yield*/, this.transfer({
                                assetAmount: entities_1.AssetAmount.getMinAmountByChain(chain),
                                recipient: poolAddress,
                                memo: memo,
                            })];
                    case 2:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                    case 3:
                        error_7 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_7)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.network = network;
        this.phrase = phrase;
        // create midgard client
        this.midgard = new midgard_sdk_1.MidgardV2(MultiChain.getMidgardNetwork(network));
        // create chain clients
        this.thor = new thorchain_1.ThorChain({ network: network, phrase: phrase });
        this.bnb = new binance_1.BnbChain({ network: network, phrase: phrase });
        this.btc = new bitcoin_1.BtcChain({ network: network, phrase: phrase });
        this.eth = new ethereum_1.EthChain({ network: network, phrase: phrase });
        this.ltc = new litecoin_1.LtcChain({ network: network, phrase: phrase });
        // this.bch = new BchChain({ network, phrase })
    }
    /**
     * return midgard network type
     *
     * @param network mainnet or testnet
     */
    MultiChain.getMidgardNetwork = function (network) {
        if (network === 'testnet')
            return 'testnet';
        return 'chaosnet';
    };
    Object.defineProperty(MultiChain.prototype, "wallets", {
        get: function () {
            return this.wallet;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * get midgard client
     */
    MultiChain.prototype.getMidgard = function () {
        return this.midgard;
    };
    return MultiChain;
}());
exports.MultiChain = MultiChain;
//# sourceMappingURL=multichain.js.map