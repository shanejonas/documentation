module.exports = {
  protodocs: [
    {
      type: "category",
      label: "Files",
      items: [
        {
          type: "category",
          label: "/vega",
          items: [
            {
              type: "category",
              label: "/oracles/v1",
              items: [
                { type: "doc", id: "vega/oracles/v1/data.proto" },
                { type: "doc", id: "vega/oracles/v1/spec.proto" },
              ],
            },
            {
              type: "category",
              label: "/commands/v1",
              items: [
                { type: "doc", id: "vega/commands/v1/commands.proto" },
                { type: "doc", id: "vega/commands/v1/oracles.proto" },
                { type: "doc", id: "vega/commands/v1/signature.proto" },
                { type: "doc", id: "vega/commands/v1/transaction.proto" },
                {
                  type: "doc",
                  id: "vega/commands/v1/validator_commands.proto",
                },
              ],
            },
            {
              type: "category",
              label: "/events/v1",
              items: [
                { type: "doc", id: "vega/events/v1/events.proto" },
                { type: "doc", id: "vega/events/v1/events.proto" },
              ],
            },
            {
              type: "category",
              label: "/api/v1",
              items: [
                { type: "doc", id: "vega/api/v1/core.proto" },
                { type: "doc", id: "vega/api/v1/corestate.proto" },
              ],
            },
            {
              type: "category",
              label: "/checkpoint/v1",
              items: [
                { type: "doc", id: "vega/checkpoint/v1/checkpoint.proto" },
              ],
            },
            {
              type: "category",
              label: "/snapshot/v1",
              items: [{ type: "doc", id: "vega/snapshot/v1/snapshot.proto" }],
            },
            {
              type: "category",
              label: "/tm",
              items: [{ type: "doc", id: "vega/tm/replay.proto" }],
            },
            {
              type: "category",
              label: "/wallet/v1",
              items: [{ type: "doc", id: "vega/wallet/v1/wallet.proto" }],
            },
            { type: "doc", id: "vega/assets.proto" },
            { type: "doc", id: "vega/chain_events.proto" },
            { type: "doc", id: "vega/governance.proto" },
            { type: "doc", id: "vega/markets.proto" },
            { type: "doc", id: "vega/vega.proto" },
          ],
        },
      ],
    },
  ],
};
