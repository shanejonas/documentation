
  ```javascript
{
 rationale: {
  title: "Add tDAI TEST (tDAI)",
  description: "Proposal to add tDAI TEST (tDAI) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "tDAI TEST",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "tDAI",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "18",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b",

     // The maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay.
     // There’s no limit on the size of a withdrawal (string)
     withdrawThreshold: "10",

     // The lifetime limits deposit per address
     // note: this is a temporary measure that can be changed by governance (string)
     lifetimeLimit: "10",
    }
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1676224323000,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1676310723000,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1676310723000
 }
}
```