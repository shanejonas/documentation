```javascript
{
 // Instrument name
 name: "Apples Yearly (2022)",
 // Instrument code
 code: "APPLES.22",
 // Future
 future: {
  // Product settlement asset identifier (string)
  settlementAsset: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
  // Product quote name (string)
  quoteName: "tEuro",
  // the number of decimal places implied by the settlement price emitted by the settlement oracle (int64 as integer)
  settlementPriceDecimals: 18,
  // The oracle spec describing the oracle data of settlement price (object)
  oracleSpecForSettlementPrice: {},
  // The oracle spec describing the oracle data of trading termination (object)
  oracleSpecForTradingTermination: {},
  // The binding between the oracle spec and the settlement price (object)
  oracleSpecBinding: {
   // settlement_price_property holds the name of the property in the oracle data
   // that should be used as settlement price.
   // If it is set to "prices.BTC.value", then the Future will use the value of
   // this property as settlement price. (string) 
   settlementPriceProperty: "prices.BTC.value",
   // the name of the property in the oracle data that signals termination of trading (string) 
   tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
  }
 }
```