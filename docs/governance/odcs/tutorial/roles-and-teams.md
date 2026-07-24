---
sidebar_position: 5
sidebar_custom_props:
  icon: users
---

# Roles & Teams

The `iam/` directory covers who may touch the data and who owns it. It maps to two schemas from the library's `iam` module: `Role`, for access levels and their approval chains, and `TeamMember`, for the people accountable for the contract.

## Roles

Each access role is one `Role` value with an `access` level and its first- and second-level approvers. Writing them as separate named values means a role can be referenced from more than one contract without being retyped. This is [`iam/role.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/iam/role.k):

```kcl
import enkinex_odcs.iam.role

StrategyReader = role.Role {
    role = "microstrategy_user_opr"
    access = "read"
    firstLevelApprovers = "Reporting Manager"
    secondLevelApprovers = "mandolorian"
}

QueryReader = role.Role {
    role = "bq_queryman_user_opr"
    access = "read"
    firstLevelApprovers = "Reporting Manager"
    secondLevelApprovers = "na"
}

RiskReader = role.Role {
    role = "risk_data_access_opr"
    access = "read"
    firstLevelApprovers = "Reporting Manager"
    secondLevelApprovers = "dathvador"
}

BQWriter = role.Role {
    role = "bq_unica_user_opr"
    access = "write"
    firstLevelApprovers = "Reporting Manager"
    secondLevelApprovers = "mickey"
}
```

## Team members

The people side lives in [`iam/member.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/iam/member.k). Each is a `TeamMember`, and the fields carried differ per person — the first member records a `dateOut` and a `replacedByUsername`, the owner adds a `description`, and so on. The schema allows those optional fields without forcing them on every entry:

```kcl
import enkinex_odcs.iam.team

CeastWoodMember = team.TeamMember {
    username = "ceastwood"
    role = "Data Scientist"
    dateIn = "2022-08-02"
    dateOut: "2022-10-01"
    replacedByUsername = "mhopper"
}

MHopperMember = team.TeamMember {
    username = "mhopper"
    role = "Data Scientist"
    dateIn = "2022-10-01"
}

DaustinMember = team.TeamMember {
    username = "daustin"
    role = "Owner"
    description = "Keeper of the grail"
    dateIn = "2022-10-01"
}
```

The individual members do not yet form a team. We assemble them into a `Team` back in `odcs.k`, which keeps the member definitions independent of how any one contract groups them.

## Composing the root `contract.k`

Now we extend the root file from the previous section. Two new local imports appear — the `iam` modules — plus one library import, `iam.team`, because the `Team` wrapper is assembled inline. The `team` and `roles` fields join the ones we already had:

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

The `Team` schema is the one place where we build a value inline in the root rather than in a leaf file, because the grouping — the team's own name and description — belongs to this contract, while the members it contains are reusable on their own. Everything else stays a reference to a named value.
