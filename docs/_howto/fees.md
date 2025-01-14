---
sidebar_position: 15
title: Fees and margins 
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Fees and margin estimation

## Introduction

This guide shows how to use the APIs to estimate fees for trading, as well as how to estimate the margin requirements for a potential order.

On Vega, fees are incurred on every trade and it is the price taker who pays the fee. Vega does not charge 'traditional' gas fees, and importantly the fee structure **rewards the participants that make Vega possible**.

Additionally, Vega’s automated cross margining system means gains on one market can be released and used as margin on another. Estimating the margin requirements for a potential order is useful to minimise rejected orders because of insufficient margin or collateral.

## Where do I find the fees charged for a trade?

Any fees charged on Vega are shown on [individual trades](list-orders-trades.md#listing-trades-for-an-order) returned by the API. For example, on each trade there are the following fields:

| Field          |  Description  |
| :----------------- | :------------- |
| `buyerFee` | Any fees for the party on **buy** side of the trade, also known as the `buyer`. |
| `sellerFee` | Any fees for the party on **sell** side of the trade, also known as the `seller`. |

```
  "buyerFee": {                                  "sellerFee": {
     "infrastructureFee": "37963",                  "infrastructureFee": "0",
     "liquidityFee": "75926",                       "liquidityFee": "0",
     "makerFee": "18982"                            "makerFee": "0"
  }                                              }
```

:::info
**Fee values** are in the settlement currency with decimal precision (DP) for the market the trade occurred on.
:::

Contained inside each of the buyer and seller fee structures are the fees charged:

| Field          |  Description  |
| :----------------- | :------------- |
| `infrastructureFee` | Fees paid to validators as a reward for running the infrastructure of the network. |
| `liquidityFee` | Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market. |
| `makerFee` | Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker). |

Fees are incurred on every trade on Vega, but it is the price taker who pays the fee. The price taker is the party that traded using a market order, or placed a limit order that traded immediately.

The network has a set of default fee factors configured by the [network parameters](create-market.md#where-do-i-find-the-current-network-parameters); `market.fee.factors.infrastructureFee`, `market.fee.factors.liquidityFee` and `market.fee.factors.makerFee`. 

These can also be overridden on a per market basis. It is recommended to check the [market configuration](markets.md#listing-markets-on-a-vega-network) or [network parameters](create-market.md#where-do-i-find-the-current-network-parameters) when performing any fee calculation.

## How do I estimate the fees for an order?

Connect to a Vega API server and *estimate fees for an order on a Vega market*:  

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/get-fees-margins-estimate.sh#L75-L93
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/get-fees-margins-estimate.py#L95-L113
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `fee` | The estimated fees for the requested order details. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/response-examples.txt#L2-L18
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/).
:::

## How do I estimate the margin required for an order?

Connect to a Vega API server and *estimate the margin* for an order on a Vega market:  

<GitPod />

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/get-fees-margins-estimate.sh#L102-L120
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/get-fees-margins-estimate.py#L121-L139
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `marginLevels` | The estimated margin for the proposed order. This includes **initial**, **search**, **release** and **maintenance** levels. The margin levels should be adjusted for the number of decimal places on the target market, for example, 5 decimal places. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/response-examples.txt#L24-L36
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/fees-margins-estimation/).
:::



In a similar way to fees calculation, the network has a set of default margin scaling factors configured by the [network parameters](create-market.md#where-do-i-find-the-current-network-parameters) in `market.margin.scalingFactors`, for example:

```
# market.margin.scalingFactors
{
  "searchLevel": 1.025,
  "initialMargin": 1.05,
  "collateralRelease": 1.1
}
```

Again, these can also be overridden on a per market basis. It is recommended to check the [market configuration](markets.md#listing-markets-on-a-vega-network) or [network parameters](create-market.md#where-do-i-find-the-current-network-parameters) when performing any margin calculation.


## What's next?

 * Find out about [Liquidity provision](liquidity-provision.md)
 * What's the [Vega Time](time.md)?
 
