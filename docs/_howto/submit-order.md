---
sidebar_position: 4
title: Submit an order
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Submitting an order

## Introduction

Creating and submitting orders on a Vega network is one of the most common activities when developing against the APIs. This guide will walk you through the steps required to compose, sign and submit order messages to a node.

First up, let's look at the anatomy of an order message, there are several fields that comprise an order submission message:

* **MARKET ID**  
An order needs to be routed to the correct market, this must be a valid Vega market identifier (ID). This is a required field.

* **PARTY ID (public key)**  
This is the unique identifier of the party that is submitting the order, this will be the public key chosen for signing. This is a required field. 

* **PRICE**  
The price for the order. Currently price is an integer, for example 123456 is a correctly formatted price of 1.23456, assuming market configured to 5 decimal places. This is a required field for Limit orders, it is not required for market orders. Note: the number of decimal places configured for a market is returned by the [Market information](markets.md) API calls.

* **SIDE**  
Vega needs to know whether the order is a `BUY` order or a `SELL` order. To go long, please specify `SIDE_BUY` or to go short specify `SIDE_SELL`. This is a required field.

* **SIZE**  
This is the size for the order, for example, in a futures market the size equals the number of contracts. This is a required field and cannot be negative.

* **TYPE**  
This is the type of order, there are two choices here, a `TYPE_LIMIT` for limit orders or `TYPE_MARKET` for market orders. There is also a `TYPE_NETWORK` for network related orders that cannot be set on a submit order message. This is a required field. 

* **TIME IN FORCE (TIF)**  
Vega supports several order types / time in force values for an order. These include `TIME_IN_FORCE_GTC`, `TIME_IN_FORCE_GTT`, `TIME_IN_FORCE_FOK`, `TIME_IN_FORCE_IOC`, `TIME_IN_FORCE_GFN` and `TIME_IN_FORCE_GFA`. A `TIME_IN_FORCE_GTT` order must have an `expiresAt` value but a `TIME_IN_FORCE_GTC` must not have one. This is a required field. 

* **EXPIRY**  
`expiresAt` is the timestamp for when you would like the order to expire (if it has not fully traded), in **nanoseconds** since epoch. Please use the current Vega blockchain time as the reference for expiry. Required field only for `TIME_IN_FORCE_GTT` and should not be specified for `TIME_IN_FORCE_GTC`. Specifying this field, even with an empty string on the REST API will [cause a parsing error](#i-get-an-input-error-when-submitting-an-order-with-an-empty-string-as-the-expiry-timestamp), please only include it for `TIME_IN_FORCE_GTT`. Please see [Step 2](#2-get-current-time-on-the-blockchain-optional) below for more detail on how to retrieve the current time from the blockchain.

* **REFERENCE**  
A reference string for the order, this is typically used to retrieve an order submitted through consensus. It is **user definable**, and it's recommended to set it to be a unique [reference identifier](order-references.md) string e.g. `my-party-id-50f790bc-c1c6-47fd-a52b-f0849e965c22`. This can be used as a foreign key or reference identifier.

* **ID**  
This is the unique identifier for the order, it is **set by the Vega system after consensus**. This field **should not be set** when creating an order submission. The reference field is used to locate an order after it has been submitted to the blockchain, at which point the `ID` field will typically be available.

* **PEGGED ORDER**  
A pegged order can be specified for persistent (`TIME_IN_FORCE_GTC`, `TIME_IN_FORCE_GTT`) and non-persistent time in force (`TIME_IN_FORCE_IOC`, `TIME_IN_FORCE_FOK`). If details for a pegged order are included in the order submission message, the system will attempt to activate this feature. A pegged order is a limit order which is set as a defined distance (`offset`) from a `reference` price (such as the best bid, mid, or best offer/ask). This is the price against which the final order price is calculated. The reference price is based on the live market. There are three options for the `reference` field in a pegged order; `PEGGED_REFERENCE_MID`, `PEGGED_REFERENCE_BEST_BID` and `PEGGED_REFERENCE_BEST_ASK`. Sample scripts for submitting and amending a pegged order are available on [GitHub](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-amend-pegged-order). 

## How do I submit an order to a Vega node?

The flow to submit a signed `SubmitOrder` message to a Vega node is as
follows:

1. Wallet API: Create a new wallet, or connect to an existing one.
2. Wallet API: Create a key pair, if one has not already been created.
3. Node API: Get a list of markets, to get the market ID of a market.
4. Wallet API: Call `SignTx`. Send the `OrderSubmission` data and a public
   key associated with the connected wallet. Receive a `SignedBundle` object.
6. Node API: Call `SubmitTransaction`. Send the `SignedBundle` object (only required if propagate set to false on `SignTx`).

Hints:
* Using the open source Go-Wallet code, clients can either run a local
  wallet API server, or incorporate the wallet code server into their own (Golang)
  application, and avoid a network round trip to a Vega Wallet API server.
* When calling `SignTx` on the Wallet API server, it is possible to set `propagate`
  to `true`. This instructs the Wallet API server to submit the signed transaction
  directly to the Vega node specified in its config file.

### 1. Connect to wallet and get public key

See the section on the [Wallet service](wallet.md) to learn how to connect to an existing wallet, list keys and select a public key.  

:::info
For a working **wallet example** used by this how-to guide, please visit the [API Samples GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/) repo.
:::


### 2. Get current time on the blockchain (Optional)

For orders that require an expiry time, such as Good Til Time (`TIME_IN_FORCE_GTT`) orders, the current time on the blockchain is required to calculate the offset. In the example below we get the time and add two minutes to create an expiry time in the future.

:::info
 Timestamps on Vega are returned as a numeric value of the number of nanoseconds since the UNIX epoch (January 1, 1970 00:00 UTC), therefore please convert expiry times into nanoseconds. A more in depth explanation on why we need blockchain based time references can be found in the guide on [Vega Time](time.md).  
:::

<GitPod />

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#L77-L81
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#L104-L108
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `timestamp` | The timestamp for the current Vega Time, formatted as a numeric value of the number of nanoseconds since the UNIX epoch (January 1, 1970 00:00 UTC). In other words, it’s a 64-bit UNIX timestamp with nanosecond precision. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/vega-time/response-examples.txt#L2-L5
```

</details>

### 3. Find a market

All markets on Vega have a unique identifier and when submitting an order we must find and use a `marketId` so that the order is routed to the correct market. Market identifiers are generated by the network. This is in contrast to the market name which is typically human readable. In the example below, for simplicity, we query all markets and select the first market returned, however it's common to filter the returned results on market name, or code to find a market. Further detail on how to retrieve [Market Information](markets.md) is available.

<GitPod />

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#L64-L67
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
	https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#L88-L92
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `markets` | A list of zero or more markets available on a Vega network. Filter the returned list to locate the market you wish to place an order on. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/response-examples.txt#L2-L84
```

</details>

### 4. Compose a submit order message

This is where we compose a submit order command containing the specifics of the order. This will be signed and sent into the Vega blockchain in step 5. 

:::info
The **order reference** field is used to look up an order later on. See our guide on [Order references](order-references.md). Note: Previously this was auto generated by the Vega API, however this reference now needs to be set by the user. It is common to set this to a globally unique reference.
:::

<GitPod />

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#L91-L110
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#L119-L136
```

</TabItem>
</Tabs>

### 5. Sign and send the transaction

<GitPod />

<Tabs groupId="codesample4">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#L116-L126
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#L142-L146
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `signature` | A **signed** transaction message containing the amendment data. Because `propagate` is set to true, the signed data will be automatically forwarded by the wallet server to a node. If you wish to manually submit the transaction you can do so with the data in `signature` (`tx`) and set `propagate` to false. A full example showing how to sign and submit the order transaction as **two separate** operations is available on [GitHub](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-order). |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/response-examples.txt#L2-L13
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/).
:::

The order should have now been submitted to the market chosen on the Vega network. You can query the status of the order by its [Order reference](order-references.md).

## Troubleshooting

### I get an input error when submitting an order with an empty string as the expiry timestamp

When working with the Vega REST API, submitting an order with `timeInForce` set to `TIME_IN_FORCE_GTC` and `expiresAt` as an empty string e.g. `""` will cause the following error:

```
{
  "code": 3,
  "message": "unexpected end of JSON input",
  "details": []
}
```

This is because the Vega REST API does not expect the `expiresAt` field to be included for Good Til Close (`TIME_IN_FORCE_GTC`) order types. Therefore, please ensure the JSON submitted **does not include** this field for Good Til Close orders (both the key and value), conversely it **must be included** for Good Til Time (`TIME_IN_FORCE_GTT`) orders. 

Similar "unexpected end of JSON input" errors can be because of malformed or missing JSON, please check and ensure valid JSON.

## What's next?

 * Learn how to find the submitted order by an [Order reference](order-references.md) 
 * Made a mistake? [Cancel an order](cancel-order.md)
