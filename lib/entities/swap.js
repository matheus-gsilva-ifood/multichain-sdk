"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swap = exports.QuoteType = exports.SwapType = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var constants_1 = require("../constants");
var amount_1 = require("./amount");
var asset_1 = require("./asset");
var assetAmount_1 = require("./assetAmount");
var percent_1 = require("./percent");
var pool_1 = require("./pool");
var price_1 = require("./price");
var SwapType;
(function (SwapType) {
    SwapType[SwapType["SINGLE_SWAP"] = 0] = "SINGLE_SWAP";
    SwapType[SwapType["DOUBLE_SWAP"] = 1] = "DOUBLE_SWAP";
})(SwapType = exports.SwapType || (exports.SwapType = {}));
var QuoteType;
(function (QuoteType) {
    QuoteType[QuoteType["EXACT_IN"] = 0] = "EXACT_IN";
    QuoteType[QuoteType["EXACT_OUT"] = 1] = "EXACT_OUT";
})(QuoteType = exports.QuoteType || (exports.QuoteType = {}));
var Swap = /** @class */ (function () {
    function Swap(inputAsset, outputAsset, pools, amount) {
        this.slipLimitPercent = constants_1.DEFAULT_SLIP_LIMIT;
        // swapPools[0]: first swap pool, swapPools[1]: second swap pool(for Double Swap Only)
        this.swapPools = [];
        this.hasInSufficientFee = false;
        this.inputAsset = inputAsset;
        this.outputAsset = outputAsset;
        // input asset price based in output asset
        this.price = new price_1.Price({
            baseAsset: this.outputAsset,
            quoteAsset: this.inputAsset,
            pools: pools,
        });
        this._0_AMOUNT = amount_1.Amount.fromAssetAmount(0, inputAsset.decimal);
        tiny_invariant_1.default(!this.inputAsset.isRUNE() || !this.outputAsset.isRUNE(), 'Invalid pair');
        tiny_invariant_1.default(amount.gte(this._0_AMOUNT), 'Invalid Negative Amount');
        // set swap type and pools
        if (!this.inputAsset.isRUNE() && !this.outputAsset.isRUNE()) {
            this.swapType = SwapType.DOUBLE_SWAP;
            var firstSwapPool = pool_1.Pool.byAsset(this.inputAsset, pools);
            var secondSwapPool = pool_1.Pool.byAsset(this.outputAsset, pools);
            tiny_invariant_1.default(firstSwapPool && secondSwapPool, 'Invalid Pool');
            if (firstSwapPool && secondSwapPool) {
                this.swapPools = [firstSwapPool, secondSwapPool];
            }
        }
        else {
            this.swapType = SwapType.SINGLE_SWAP;
            if (!this.inputAsset.isRUNE()) {
                var firstSwapPool = pool_1.Pool.byAsset(this.inputAsset, pools);
                tiny_invariant_1.default(firstSwapPool, 'Invalid Pool');
                if (firstSwapPool) {
                    this.swapPools = [firstSwapPool];
                }
            }
            if (!this.outputAsset.isRUNE()) {
                var firstSwapPool = pool_1.Pool.byAsset(this.outputAsset, pools);
                tiny_invariant_1.default(firstSwapPool, 'Invalid Pool');
                if (firstSwapPool) {
                    this.swapPools = [firstSwapPool];
                }
            }
        }
        // get estimated network fee
        var lastPool = this.swapType === SwapType.SINGLE_SWAP
            ? this.swapPools[0]
            : this.swapPools[1];
        this.estimatedNetworkFee = this.getNetworkFee(lastPool, this.outputAsset.isRUNE());
        // set input, output, slip, fee, percent
        if (amount.asset === this.inputAsset) {
            this.quoteType = QuoteType.EXACT_IN;
            this.inputAmount = amount;
            this.outputAmount = this.getOutputAmount(amount);
            this.outputAmountAfterFee = this.getOutputAfterNetworkFee(amount);
            // validate
            if (this.outputAmountAfterFee.lt(this._0_AMOUNT)) {
                this.hasInSufficientFee = true;
                this.outputAmount = new assetAmount_1.AssetAmount(this.outputAsset, this._0_AMOUNT);
            }
        }
        else {
            this.quoteType = QuoteType.EXACT_OUT;
            this.outputAmountAfterFee = amount;
            this.outputAmount = amount.add(this.estimatedNetworkFee);
            this.inputAmount = this.getInputAmount(amount);
            // validate
            if (this.inputAmount.lt(this._0_AMOUNT)) {
                this.hasInSufficientFee = true;
                this.inputAmount = new assetAmount_1.AssetAmount(this.inputAsset, this._0_AMOUNT);
            }
        }
        this.fee = this.getFee(this.inputAmount);
        this.outputPercent = this.getOutputPercent(this.inputAmount);
        this.feePercent = this.getFeePercent(this.inputAmount);
        this.slip = this.getSlip(this.inputAmount);
    }
    Swap.prototype.setSlipLimitPercent = function (limit) {
        this.slipLimitPercent = limit;
    };
    Swap.prototype.getSlipLimitPercent = function () {
        return this.slipLimitPercent;
    };
    Object.defineProperty(Swap.prototype, "minOutputAmount", {
        get: function () {
            return this.outputAmount.mul(100 - this.slipLimitPercent).div(100).amount;
        },
        enumerable: false,
        configurable: true
    });
    Swap.getSingleSwapOutput = function (inputAmount, pool) {
        // formula: (x * X * Y) / (x + X) ^ 2
        var toRUNE = !inputAmount.asset.isRUNE();
        var outputAsset = toRUNE ? asset_1.Asset.RUNE() : pool.asset;
        var x = inputAmount.amount;
        var X = toRUNE ? pool.assetDepth : pool.runeDepth;
        var Y = toRUNE ? pool.runeDepth : pool.assetDepth;
        var numerator = x.mul(X).mul(Y);
        var denominator = new amount_1.Amount(x.add(X).assetAmount.pow(2), amount_1.AmountType.ASSET_AMOUNT, constants_1.MULTICHAIN_DECIMAL);
        return new assetAmount_1.AssetAmount(outputAsset, numerator.div(denominator));
    };
    Swap.prototype.getOutputAmount = function (inputAmount) {
        tiny_invariant_1.default(inputAmount.asset === this.inputAsset, 'Invalid Asset');
        if (this.swapType === SwapType.SINGLE_SWAP) {
            return Swap.getSingleSwapOutput(inputAmount, this.swapPools[0]);
        }
        tiny_invariant_1.default(!inputAmount.asset.isRUNE(), 'Invalid Asset');
        // double swap formula: getSwapOutput(getSwapOutput(x, X), Y)
        var firstSwapOutput = Swap.getSingleSwapOutput(inputAmount, this.swapPools[0]);
        return Swap.getSingleSwapOutput(firstSwapOutput, this.swapPools[1]);
    };
    Swap.prototype.getSingleSwapOutputAfterNetworkFee = function (inputAmount, pool) {
        // formula: getSwapOutput() - network fee (1 RUNE)
        var toRUNE = !inputAmount.asset.isRUNE();
        var swapOutputAmount = Swap.getSingleSwapOutput(inputAmount, pool);
        var runeDepthAfterSwap = toRUNE
            ? pool.runeDepth.sub(swapOutputAmount)
            : pool.runeDepth.add(inputAmount);
        var assetDepthAfterSwap = toRUNE
            ? pool.assetDepth.add(inputAmount)
            : pool.assetDepth.sub(swapOutputAmount);
        var poolAfterSwap = new pool_1.Pool(pool.asset, runeDepthAfterSwap, assetDepthAfterSwap, pool.detail);
        var networkFee = this.getNetworkFee(poolAfterSwap, toRUNE);
        var outputAsset = toRUNE ? asset_1.Asset.RUNE() : pool.asset;
        return new assetAmount_1.AssetAmount(this.outputAsset, swapOutputAmount.sub(new assetAmount_1.AssetAmount(outputAsset, networkFee)));
    };
    Swap.prototype.getNetworkFee = function (pool, toRUNE) {
        // network fee is 1 RUNE
        var networkFeeInRune = amount_1.Amount.fromAssetAmount(1, constants_1.MULTICHAIN_DECIMAL);
        var feeAmount = toRUNE
            ? networkFeeInRune
            : networkFeeInRune.mul(pool.priceOf(asset_1.Asset.RUNE()));
        return new assetAmount_1.AssetAmount(this.outputAsset, feeAmount);
    };
    Swap.prototype.getOutputAfterNetworkFee = function (inputAmount) {
        tiny_invariant_1.default(inputAmount.asset === this.inputAsset, 'Invalid Asset');
        if (this.swapType === SwapType.SINGLE_SWAP) {
            return this.getSingleSwapOutputAfterNetworkFee(inputAmount, this.swapPools[0]);
        }
        tiny_invariant_1.default(!inputAmount.asset.isRUNE(), 'Invalid Asset');
        // double swap formula: getDoubleSwapOutput - 1 RUNE
        var toRUNE = !inputAmount.asset.isRUNE();
        var doubleSwapOutput = this.getOutputAmount(inputAmount);
        var pool = this.swapPools[1];
        var runeDepthAfterSwap = toRUNE
            ? pool.runeDepth.sub(doubleSwapOutput)
            : pool.runeDepth.add(inputAmount);
        var assetDepthAfterSwap = toRUNE
            ? pool.assetDepth.add(inputAmount)
            : pool.assetDepth.sub(doubleSwapOutput);
        var poolAfterSwap = new pool_1.Pool(pool.asset, runeDepthAfterSwap, assetDepthAfterSwap, pool.detail);
        var networkFee = this.getNetworkFee(poolAfterSwap, this.outputAsset.isRUNE());
        return new assetAmount_1.AssetAmount(this.outputAsset, doubleSwapOutput.sub(new assetAmount_1.AssetAmount(this.outputAsset, networkFee)));
    };
    // output / input
    Swap.prototype.getOutputPercent = function (inputAmount) {
        var outputAmount = this.getOutputAfterNetworkFee(inputAmount);
        var inputAmountInOutputAsset = inputAmount.totalPriceIn(this.outputAsset, this.swapPools).amount;
        return new percent_1.Percent(outputAmount.div(inputAmountInOutputAsset).assetAmount);
    };
    // 1 - output / input
    Swap.prototype.getFeePercent = function (inputAmount) {
        var outputPercent = this.getOutputPercent(inputAmount);
        return new percent_1.Percent(amount_1.Amount.fromAssetAmount(1, outputPercent.decimal).sub(outputPercent).assetAmount);
    };
    Swap.getSingleSwapInput = function (outputAmount, pool) {
        // formula: (((X*Y)/y - 2*X) - sqrt(((X*Y)/y - 2*X)^2 - 4*X^2))/2
        // (part1 - sqrt(part1 - part2))/2
        var toRUNE = outputAmount.asset.isRUNE();
        var y = outputAmount.amount;
        var X = toRUNE ? pool.assetDepth : pool.runeDepth;
        var Y = toRUNE ? pool.runeDepth : pool.assetDepth;
        var part1 = X.mul(Y).div(y).sub(X.mul(2));
        var part2 = new amount_1.Amount(X.assetAmount.pow(2).multipliedBy(4), amount_1.AmountType.ASSET_AMOUNT, constants_1.MULTICHAIN_DECIMAL);
        var inputAmount = new amount_1.Amount(part1.assetAmount
            .minus(part1.assetAmount.pow(2).minus(part2.assetAmount).sqrt())
            .div(2), amount_1.AmountType.ASSET_AMOUNT, constants_1.MULTICHAIN_DECIMAL);
        var inputAsset = !toRUNE ? asset_1.Asset.RUNE() : pool.asset;
        return new assetAmount_1.AssetAmount(inputAsset, inputAmount);
    };
    Swap.prototype.getInputAmount = function (outputAmount) {
        tiny_invariant_1.default(outputAmount.asset === this.outputAsset, 'Invalid Asset');
        if (this.swapType === SwapType.SINGLE_SWAP) {
            return Swap.getSingleSwapInput(outputAmount, this.swapPools[0]);
        }
        tiny_invariant_1.default(!outputAmount.asset.isRUNE(), 'Invalid Asset');
        // double swap formula: getSwapInput(getSwapInput(y, Y), X)
        var secondSwapInput = Swap.getSingleSwapInput(outputAmount, this.swapPools[1]);
        return Swap.getSingleSwapInput(secondSwapInput, this.swapPools[0]);
    };
    Swap.getSingleSwapSlip = function (inputAmount, pool) {
        // formula: (x) / (x + X)
        var x = inputAmount.amount;
        var X = pool.depthOf(inputAmount.asset);
        return new percent_1.Percent(x.div(x.add(X)).assetAmount);
    };
    Swap.prototype.getSlip = function (inputAmount) {
        tiny_invariant_1.default(inputAmount.asset === this.inputAsset, 'Invalid Asset');
        if (this.swapType === SwapType.SINGLE_SWAP) {
            return Swap.getSingleSwapSlip(inputAmount, this.swapPools[0]);
        }
        tiny_invariant_1.default(!inputAmount.asset.isRUNE(), 'Invalid Asset');
        // double swap slip formula: getSingleSwapSlip(input1) + getSingleSwapSlip(getSwapOutput1 => input2)
        var firstSlip = Swap.getSingleSwapSlip(inputAmount, this.swapPools[0]);
        var firstSwapOutput = Swap.getSingleSwapOutput(inputAmount, this.swapPools[0]);
        var secondSlip = Swap.getSingleSwapSlip(firstSwapOutput, this.swapPools[1]);
        return new percent_1.Percent(firstSlip.add(secondSlip).assetAmount);
    };
    // fee amount is based in output asset
    Swap.getSingleSwapFee = function (inputAmount, pool) {
        // formula: (x * x * Y) / (x + X) ^ 2
        var toRUNE = !inputAmount.asset.isRUNE();
        var outputAsset = toRUNE ? asset_1.Asset.RUNE() : pool.asset;
        var x = inputAmount.amount;
        var X = toRUNE ? pool.assetDepth : pool.runeDepth;
        var Y = toRUNE ? pool.runeDepth : pool.assetDepth;
        var numerator = x.mul(X).mul(Y);
        var denominator = new amount_1.Amount(x.add(X).assetAmount.pow(2), amount_1.AmountType.ASSET_AMOUNT, constants_1.MULTICHAIN_DECIMAL);
        return new assetAmount_1.AssetAmount(outputAsset, numerator.div(denominator));
    };
    // fee amount is based in output asset
    Swap.prototype.getFee = function (inputAmount) {
        tiny_invariant_1.default(inputAmount.asset === this.inputAsset, 'Invalid Asset');
        if (this.swapType === SwapType.SINGLE_SWAP) {
            return Swap.getSingleSwapFee(inputAmount, this.swapPools[0]);
        }
        tiny_invariant_1.default(!inputAmount.asset.isRUNE(), 'Invalid Asset');
        // double swap fee: getSwapFee1 + getSwapFee2
        var firstSwapOutput = Swap.getSingleSwapOutput(inputAmount, this.swapPools[0]);
        // first swap fee is always based in rune
        var firstSwapFeeInRune = Swap.getSingleSwapFee(inputAmount, this.swapPools[0]);
        // second swap fee based in output asset
        var secondSwapFeeInAsset = Swap.getSingleSwapFee(firstSwapOutput, this.swapPools[1]);
        // first swap fee based in output asset
        var firstSwapFeeInAsset = new assetAmount_1.AssetAmount(asset_1.Asset.RUNE(), firstSwapFeeInRune).totalPriceIn(this.outputAsset, this.swapPools);
        return new assetAmount_1.AssetAmount(this.outputAsset, firstSwapFeeInAsset.add(secondSwapFeeInAsset));
    };
    return Swap;
}());
exports.Swap = Swap;
//# sourceMappingURL=swap.js.map