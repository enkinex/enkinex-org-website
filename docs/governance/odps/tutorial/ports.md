---
sidebar_position: 7
sidebar_custom_props:
  icon: table
---

# Input & Output Ports

This is the piece the data product exists for: the **ports**. `inputPorts` describe what the product consumes,
`outputPorts` describe what it produces. Both come from the library's `product` package — `product.input` and
`product.output` — and both are discoverable, so every entry can carry `tags`, `customProperties`, and
`authoritativeDefinitions` of its own.

This is where the modular approach earns its keep. Each port is written once as a named, typed value; the root then
lists those ports by name. A port written this way is easy to read, easy to reuse, and validated the moment you build
it.

## Input ports

An `InputPort` requires `name`, `version`, and `contractId` — the last one referencing the
[ODCS data contract](https://enkinex.org/docs/governance/odcs/library) that governs the data being consumed. The
upstream example lists two ports, `payments` and `onlinetransactions`, each at two versions, so each `name`+`version`
pair becomes its own named value. This is
[`input/port.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/input/port.k):

```kcl
import enkinex_odps.product.input

Payments1_0 = input.InputPort {
    name = "payments"
    version = "1.0.0"
    contractId = "dbb7b1eb-7628-436e-8914-2a00638ba6db"
}

Payments2_0 = input.InputPort {
    name = "payments"
    version = "2.0.0"
    contractId = "dbb7b1eb-7628-436e-8914-2a00638ba6da"
}

OnlineTransactions1_0 = input.InputPort {
    name = "onlinetransactions"
    version = "1.0.0"
    contractId = "ec2a112d-5cfe-49f3-8760-f9cfb4597544"
}

OnlineTransactions1_1 = input.InputPort {
    name = "onlinetransactions"
    version = "1.1.0"
    contractId = "ec2a112d-5cfe-49f3-8760-f9cfb4597547"
    tags = ["transactions"]
    customProperties = [
        {property = "transactionsVersion", value = "1.1.0"}
    ]
    authoritativeDefinitions = [
        {$type = "data_dictionary", url = "https://mydata/dictionary"}
    ]
}
```

Only the last port carries discovery metadata. The first three are three lines each — the schema requires nothing more,
and the type checker tells you so immediately if a `contractId` goes missing.

## Output ports

`OutputPort` is the most composite entity in the library. Alongside `name`, `version`, and `contractId`, it can carry a
list of `Sbom` entries — the Software Bill of Materials for what the port ships — and a list of `InputContract`
dependencies recording which contracts, at which versions, this output was built from. The example's second
`rawtransactions` version uses both. This is
[`output/port.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/output/port.k):

```kcl
import enkinex_odps.product.output

RawTransactions1_0 = output.OutputPort {
    name = "rawtransactions"
    description = "Raw Transactions"
    $type = "tables"
    version = "1.0.0"
    contractId = "c2798941-1b7e-4b03-9e0d-955b1a872b32"
}

RawTransactions2_0 = output.OutputPort {
    name = "rawtransactions"
    description = "Raw Transactions"
    $type = "tables"
    version = "2.0.0"
    contractId = "c2798941-1b7e-4b03-9e0d-955b1a872b33"
    tags = ["transactions"]
    customProperties = [
        {property = "transactionsVersion", value = "2.0.0"}
    ]
    authoritativeDefinitions = [
        {$type = "data_dictionary", url = "https://mydata/dictionary"}
    ]
    sbom = [
        {$type = "external", url = "https://mysbomserver/mysbom"}
    ]
    inputContracts = [
        {id = "dbb7b1eb-7628-436e-8914-2a00638ba6db", version = "2.0.0"}
        {id = "ec2a112d-5cfe-49f3-8760-f9cfb4597544", version = "1.0.0"}
    ]
}

ConsolidatedTransactions1_0 = output.OutputPort {
    name = "consolidatedtransactions"
    description = "Consolidated transactions"
    $type = "tables"
    version = "1.0.0"
    contractId = "a44978be-1fe0-4226-b840-1b715bc25c63"
}

FullTransactionsWithReturns0_3 = output.OutputPort {
    name = "fulltransactionswithreturns"
    description = "Full transactions with returns"
    $type = "tables"
    version = "0.3.0"
    contractId = "ef769969-0cbe-4188-876f-bb00abadaee4"
}
```

The `sbom` and `inputContracts` entries use the same bare dict literals we saw on the management port, and the same
inference applies: `Sbom` and `InputContract` are resolved from `OutputPort`'s attribute types. It is worth knowing why
the library keeps `Sbom` in its own `product` package rather than beside the output port — both `product.input` and
`product.output` depend on it, and a shared package is what lets them do that without a circular import.

## The complete `product.k`

Two final local imports join the root, the `inputPorts` and `outputPorts` fields fall into place, and the data product
is complete. This is [`product.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/product.k) in full:

```kcl
import enkinex_odps.odps

import .metadata.description as product_description
import .input.port as input_port
import .output.port as output_port
import .management.port as management_port
import .support.channels as support_channels
import .team.team as product_team

odps.DataProduct {
    name = "Customer Data Product"
    id = "fbe8d147-28db-4f1d-bedf-a3fe9f458427"
    domain = "seller"
    status = "draft"
    tenant = "RetailCorp"
    tags = ["customer"]
    description = product_description.ProductDescription
    inputPorts = [
        input_port.Payments1_0
        input_port.Payments2_0
        input_port.OnlineTransactions1_0
        input_port.OnlineTransactions1_1
    ]
    outputPorts = [
        output_port.RawTransactions1_0
        output_port.RawTransactions2_0
        output_port.ConsolidatedTransactions1_0
        output_port.FullTransactionsWithReturns0_3
    ]
    managementPorts = [
        management_port.DictionaryUpdatesPort
    ]
    support = [
        support_channels.DataTeamSlack
        support_channels.EmailSupport
    ]
    team = product_team.DataTeam
    productCreatedTs = "2023-01-15T10:30:00Z"
}
```

Six local imports, thirteen named references, and not a single value defined twice. All that is left is to run it.
