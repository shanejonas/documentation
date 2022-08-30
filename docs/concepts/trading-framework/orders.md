---
sidebar_position: 5
title: Orders
hide_title: false
---

# Orders
An order is an instruction to execute a trade that is long or short on a market's price. Placing an order does not guarantee it is filled. Orders stay on the order book until they are filled, expired or cancelled.

When an order is placed, it is uniquely identified to the Vega network by its order ID, the market ID - which is unique to each market, and party ID - which is owned by the signer of the transaction. 

:::tip Query for data
Want to see your order ID?
Use the [GraphQL order query](../../graphql/objects/party#orders-order) to find orders you created with your party ID (public key)
:::

## Order sizes
Order sizes can be fractional, as long as the order is within the maximum number of decimal places allowable for the market. Any order containing more precision than this will be rejected. A market's decimal places are specified at the time of the market's proposal.

If a market requires that orders are specified using integers, fractional order sizes do not apply and 1 is the smallest increment.

## Submit an order
Orders can be submitted into any market that is active - i.e., not in a protective auction, or matured, expired, or settled. Orders will only be accepted if sufficient margin can be allocated from a trader's available collateral. 

:::note Read more
* [**Margin**](#margin): Find out how margin works in the Vega system. 
:::

If, during continuous trading, an order is going to be matched with another order on the book for the same party (also known as a wash trade), then execution of that order will be stopped and the order will be cancelled and removed, if it on the book. 

## Amend an order
Orders that have not been filled can be amended using the APIs. Amendments that change price or increase size will be executed as a cancel and replace, meaning the time priority will be lost -- as if the original order was cancelled and removed from the book and a new order was submitted with the modified values.

Orders cannot be amended using Vega Console. Instead, an individual order should be cancelled and a new order placed. 

### Amending pegged orders

:::note Read more
* [Amend pegged order](#amend-pegged-orders)
* Amending liquidity commitment orders
:::

## Cancel an order
Orders that have not been filled can be cancelled. 

When trading using the APIs, there are three options for cancelling a standard limit or market order. A trader can cancel individual orders, all orders for their public key across all markets, or all orders for their public key on a single market. Each of those ways will remove the orders from the order book, and push out order update messages. 

* Cancel with orderID, marketID and partyID - This removes the defined order from the order book of the given market
* Cancel with partyID and marketID - This removes all the orders for a given party in the given market
* Cancel with partyID - This removes every order for that given party across all markets

When trading on Vega Console, a trader will only be able cancel individual orders on individual markets, one at a time. 

Cancelling the orders that are created from a liquiity commitment cannot be cancelled in the same way.

:::note Read more
* [Limit orders](#limit-order)
* [Market orders](#market-order)
* [Cancelling liquidity commitment orders](../liquidity#cancel-liquidity-commitment-orders)
:::

## Order types
There are three order types available to traders: limit orders, market orders, and pegged orders. One order type is automatically triggered to close out positions for distressed traders - that's called a network order.

Orders can be persistent (stay on the order book) or non-persistent (never hit the order book). Some order types in Vega depend on the market state. 

### Limit order
A limit order is an instruction that allows you to specify the minimum price at which you will sell, or the maximum at which you will buy. 

#### Times in force available for limit orders
* **GTC**: A Good 'til Cancelled order trades at a specific price until it is filled or cancelled. 
* **GTT**: A Good 'til Time order is a GTC order with an additional predefined cancellation time. 
* **GFN**: A Good for Normal order is an order that will only trade in a continuous market. The order can act like either a GTC or GTT order depending on whether the expiry field is set.
* **GFA**: A Good for Auction order will only be accepted during an auction period, otherwise it will be rejected. The order can act like either a GTC or GTT order depending on whether an expiry is set.
* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. 
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.

### Market order
A market order is an instruction to buy or sell at the best available price in the market. 

#### Times in force available for limit orders

* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. 
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.

### Pegged order
Pegged orders are orders that are a defined distance from a reference price (i.e. best bid, mid and best offer/ask), rather than at a specific price, and generate limit orders based on the set parameters. Currently, pegged orders can only use Good 'Til Cancelled and Good Til Time, but Immediate Or Cancel and Fill Or Kill will be available in a future release.

A pegged order is not placed on the order book itself, but instead generates a limit order with the price generated based on the reference and offset value. As the price levels in the order book move around, the order's price on the order book also moves.

The reference can only be positive and Vega applies it differently depending on if the order is a buy or sell. If the order is a `buy`, then the offset is taken away from the reference price. If the order is a `sell` they the offset is added to the reference price.

#### Values available for pegged orders

Pegged orders are restricted in what values can be used when they are created. Note: IOC and FOK are not currently available for pegged orders, but will be in a future release. 

| Type (Time in Force)      | Side  |   Bid Peg   | Mid Peg |  Offer Peg  |
|---------------------------|-------|-------------|---------|-------------|
| Persistent (GTC, GTT)	    | Buy	  | <= 0        | < 0     | Not allowed |
| Persistent (GTC, GTT)	    | Sell  | Not allowed | > 0     | >= 0        |

### Reference prices for pegged orders
Rather than being set for a specific limit price, a pegged order is a defined distance from a reference price (such as the best bid, mid, or best offer/ask). That is the price against which the final order price is calculated. The reference price is based on the live market, and the final price is calculated and used to insert the new order. The distance is also known as the offset value, which is an absolute value that must be cleanly divisible by the tick size, and can be [negative or] positive. 

### Amend pegged orders
Pegged orders can be amended like standard limit orders - their reference, offset and time in force values can all be amended. If amending an order cannot be performed in-place, the order will lose time priority in the order book (but will keep its priority in the list of pegged orders). Amends must be done to the pegged order itself, not any limit orders derived from pegged orders. 

### Parked pegged orders 
There are some situations in which pegged orders are parked, or moved off the order book, until the market returns to a state that allows pegs, or the orders are cancelled or expire. When orders return to the book, they are re-priced based on current market prices, sorted by their original entry time. If the primary trading mode of a market doesn't allow pegged orders (such as an auctions-only market), then the pegged orders are rejected.  Those situations include:
* Auctions - pegged orders are only valid during continuous trading
* When the reference price does not exist (e.g. no best bid)
* The price moves to a value that means it would create an invalid order if the offset was applied

### Network order
A network order is triggered by the Vega network to close out a distressed trader, as part of position resolution. Network orders cannot be submitted by a party.

:::note Read more
[Position resolution](#position-resolution)
:::

#### Times in force used in network orders

* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.
* 
## Order status
* Rejected: If you don't have enough collateral to fill the margin requirements on an order, it will show up as 'Rejected'
* Cancelled:  If you cancel an order, the status will be listed as 'Cancelled'
* Stopped: If the the network cannot fill an order, based on the parameters you set, for example, then the order will show up as 'Stopped'

## Times in force
The following charts explain the times in force for orders and the statuses that they'll show, based on what happens in the network. 

### Fill Or Kill
Fill Or Kill (FOK): A non-persistent order that either trades all of its volume immediately on entry or is stopped/cancelled immediately without trading anything. In other words, unless the order can be completely filled immediately, it does not trade at all. It is never placed on the book, even if it does not trade.


| Time In Force | Filled | Resulting status |
|---------------|--------|------------------|
|      FOK      |   No   |      Stopped     |
|      FOK      |   Yes  |      Filled      |


### Immediate Or Cancel
Immediate Or Cancel (IOC): A non-persistent order that trades as much of its volume as possible with passive orders already on the order book (assuming it is crossed with them) and then stops execution. It is never placed on the book even if it is not completely filled immediately, instead it is stopped/cancelled.

| Time In Force | Filled  | Resulting status       |
|---------------|---------|------------------------|
|      IOC      |    No   |  Stopped               |
|      IOC      | Partial |  Partially Filled      |
|      IOC      |   Yes   |  Filled                |


### Good 'Til Cancelled
Good 'Til Cancelled (GTC): A persistent order that is valid indefinitely, until it's completely filled or the trader cancels it.

| Time In Force | Filled  | Cancelled by user | Stopped by network | Resulting status |
|---------------|---------|-------------------|--------------------|------------------|
|      GTC      |    No   |         No        |         No         |      Active      |
|      GTC      |    No   |         No        |        Yes         |      Stopped     |
|      GTC      |    No   |        Yes        |         No         |     Cancelled    |
|      GTC      | Partial |         No        |         No         |      Active      |
|      GTC      | Partial |        Yes        |         No         |     Cancelled    |
|      GTC      | Partial |         No        |        Yes         |      Stopped     |
|      GTC      |   Yes   |         No        |         No         |      Filled      |

### Good 'Til Time
Good 'Til Time (GTT): A persistent order that is valid until the trader's supplied expiry time. This can be an absolute date/time or a relative offset from the timestamp on the order.

| Time In Force | Filled  | Expired | Cancelled by user | Stopped by network | Resulting status |
|---------------|---------|---------|-------------------|--------------------|------------------|
|      GTT      |    No   |    No   |         No        |         No         |      Active      |
|      GTT      |    No   |   Yes   |         No        |         No         |      Expired     |
|      GTT      |    No   |    No   |        Yes        |         No         |     Cancelled    |
|      GTT      |    No   |    No   |         No        |        Yes         |      Stopped     |
|      GTT      | Partial |    No   |         No        |         No         |      Active      |
|      GTT      | Partial |   Yes   |         No        |         No         |      Expired     |
|      GTT      | Partial |    No   |        Yes        |         No         |     Cancelled    |
|      GTT      | Partial |    No   |         No        |        Yes         |      Stopped     |
|      GTT      |   Yes   |    No   |         No        |         No         |      Filled      |

### Good For Auction
Good For Auction (GFA): This order is dependent on the market's state, and will only be accepted by the system if it arrives during an auction period, otherwise it will be rejected. The order can act like either a Good 'Til Cancelled or Good Til Time order depending on whether an expiry is set.

### Good For Normal
Good For Normal (GFN): This order is dependent on the market's state and will only be accepted by the system if it arrived during the market's standard trading mode, otherwise it will be rejected. The order can act like either a Good 'Til Cancelled or Good Til Time order depending on whether an expiry is set.

<!-- ### Batch operations on orders [WIP] -->