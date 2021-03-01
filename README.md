# Multichain SDK

[![License](https://img.shields.io/npm/l/make-coverage-badge.svg)](https://opensource.org/licenses/MIT)
![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Installation

```sh
yarn add @thorchain/multichain-sdk
```

OR

```sh
yarn add git+https://github.com/skyorion427/multichain-sdk.git
```

## Env variable


set env variable for etherscan api key to get the explorer urls
```
ETHERSCAN_API_KEY=xxx
```

## Usage

Please refer examples for the detailed usage

### [Trade Examples](./examples)
### [Entities Examples](./examples/entities)

```
import { MultiChain } from '@thorchain/multichain-sdk'

const client = new MultiChain({ network: 'mainnet', phrase: 'xxx xxx...' })

// OR

const client = new MultiChain({ network: 'mainnet' })
client.setPhrase('somephrase')

// transfer assets
transfer(tx: TxParams): Promise<TxHash>;

// multisend assets
multiSend(params: MultiSendParams): Promise<TxHash>;

// swap assets
swap(swap: Swap): Promise<TxHash>;

// add liquidity
addLiquidity(params: AddLiquidityParams): Promise<TxHash>;

// withdraw from liquidity
withdraw(params: WithdrawParams): Promise<TxHash>;
```

### Entities

```
Amount: represent asset/base amount, support calculations, compare, format

Asset: represent any asset in the chain, support sort, format, price, currency

AssetAmount: represent amount of asset, support calculations, unitPrice, totalPrice

Percent: represent percentage of asset

Pool: represent a Pool Information

Price: represent a price of asset, support unit price, amount price, inverted price

Swap: represent all data needed for swap, provide everything for calculations, validation

Liquidity: represent pool liquidity and provide liquidity calculations

Memo: represent a memo and provide get memo utils
```

### TODO

Write unit test
