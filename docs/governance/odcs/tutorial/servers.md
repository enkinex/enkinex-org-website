---
sidebar_position: 6
sidebar_custom_props:
  icon: database
---

# Servers

The `server/` group records where the data physically lives. The library ships a general `Server` schema plus more than thirty typed subschemas of it (postgres, bigquery, snowflake, kafka, s3, and the rest), one per documented `type` value. For this contract we need a single Postgres server, declared in [`server/postgres.k`](https://github.com/enkinex/enkinex-odcs/blob/main/examples/full/server/postgres.k) using the `PostgresServer` subschema:

```kcl
import enkinex_odcs.server.postgres

LocalPostgresServer = postgres.PostgresServer {
    server = "my-postgres"
    host = "localhost"
    port = 5432
    database = "pypl-edw"
    $schema = "pp_access_views"
}
```

`PostgresServer` already freezes `$type = "postgres"`, so we no longer set it by hand, and it declares exactly the fields Postgres requires — `host`, `port`, `database`, `$schema` — so forgetting one is a compile-time error rather than a runtime surprise. Because every typed subschema extends the general `Server`, the instance drops straight into `DataContract.servers`, and the same per-type validation also fires when a contract arrives as plain YAML. Defining servers once and referencing them across contracts is one of the concrete wins of keeping governance in code rather than in copied YAML.

## Composing the root `contract.k`

One more local import — the `server` module — joins the root file, and the `servers` field joins the fields we already had:

```kcl
import enkinex_odcs.odcs
import enkinex_odcs.iam.team

import .contract.authoritative as contract_authoritative
import .contract.description as contract_description
import .contract.price as contract_price
import .contract.properties as contract_properties
import .contract.sla as contract_sla
import .contract.support as contract_support
import .iam.role as contract_role
import .iam.member as contract_member
import .server.postgres as server_postgres

odcs.DataContract {
    domain = "seller"
    version = "1.1.0"
    status = "active"
    id = "53581432-6c55-4ba2-a65f-72344a91553a"
    tenant = "ClimateQuantumInc"
    authoritativeDefinitions = [
        contract_authoritative.SampleAuthoritativeDefinition
    ]
    description = contract_description.SampleContractDescription
    servers = [
        server_postgres.LocalPostgresServer
    ]
    price = contract_price.MegabyteUSD
    team = team.Team {
        name = "my-team"
        description = "The team owning the data contract"
        members = [
            contract_member.CeastWoodMember
            contract_member.MHopperMember
            contract_member.DaustinMember
        ]
    }
    roles = [
        contract_role.StrategyReader
        contract_role.QueryReader
        contract_role.RiskReader
        contract_role.BQWriter
    ]
    slaProperties = [
        contract_sla.LatencySla
        contract_sla.GeneralAvailabilitySla
        contract_sla.EndOfSupportSla
        contract_sla.EndOfLifeSla
        contract_sla.RetentionSla
        contract_sla.FrequencySla
        contract_sla.RegulatoryTimeOfAvailabilitySla
        contract_sla.AnalyticsTimeOfAvailabilitySla
    ]
    support = [
        contract_support.SlackSupport
        contract_support.EmailSupport
        contract_support.FeedbackSupport
        contract_support.TeamsSupport
    ]
    tags = ["transactions"]
    customProperties = [
        contract_properties.RulesetProperty
        contract_properties.SomeProperty
        contract_properties.DataprocClusterProperty
    ]
    contractCreatedTs = "2022-11-15T02:59:43+00:00"
}
```

The contract now describes itself, its owners, its access model, and where it lives. What remains is the largest piece: the dataset schema — the tables and columns the contract actually governs — which we cover next.
