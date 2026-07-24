---
sidebar_position: 4
sidebar_custom_props:
  icon: license
---

# Contract Metadata

Everything under `contract/` describes the contract itself — who defines it, what it is for, what it costs, the service levels it promises, and how to get support. Each file imports a schema from the library and fills it in as a named value the root can reuse.

## The authoritative definition

The contract points back at its own canonical source. That lives in [`contract/authoritative.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract/authoritative.k):

```kcl
import enkinex_odcs.common.authoritative

SampleAuthoritativeDefinition = authoritative.AuthoritativeDefinition {
    $type = "canonical"
    url = "https://github.com/bitol-io/open-data-contract-standard/blob/main/docs/examples/all/full-example.odcs.yaml"
    description = "Canonical URL to the latest version of the contract."
}
```

`AuthoritativeDefinition` comes from the `common` module because it is reused in several places across the standard — you will see it again attached to schema properties in the [Catalog](catalog.md) section.

## The description

[`contract/description.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract/description.k) fills in the `Description` schema and nests an `AuthoritativeDefinition` inside it — a privacy statement in this case:

```kcl
import enkinex_odcs.contract.description
import enkinex_odcs.common.authoritative

SampleContractDescription = description.Description {
    purpose = "Views built on top of the seller tables."
    limitations = "Data based on seller perspective, no buyer information"
    usage = "Predict sales over time"
    authoritativeDefinitions = [
        authoritative.AuthoritativeDefinition {
            $type = "privacy-statement"
            url = "https://example.com/gdpr.pdf"
        }
    ]
}
```

## The price

[`contract/price.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract/price.k) is the smallest file in the project — the cost per unit of data:

```kcl
import enkinex_odcs.contract.pricing

MegabyteUSD = pricing.Pricing {
    priceAmount = 9.95
    priceCurrency = "USD"
    priceUnit = "megabyte"
}
```

## The custom properties

Contracts can carry arbitrary key/value extensions. Note that a `CustomProperty` value can be a scalar or a list — the type system accepts both, as the last entry shows. This is [`contract/properties.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract/properties.k):

```kcl
import enkinex_odcs.common.property

RulesetProperty = property.CustomProperty {
    property = "refRulesetName"
    value = "gcsc.ruleset.name"
}

SomeProperty = property.CustomProperty {
    property = "somePropertyName"
    value = "property.value"
}

DataprocClusterProperty = property.CustomProperty {
    property = "dataprocClusterName"
    value = ["cluster name"]
}
```

## The service-level agreements

The SLA block is where the modular approach starts to pay off. Each SLA is one `ServiceLevelAgreement` value, and different properties require different fields — a latency SLA carries a `unit` and an `element`, while an availability SLA is just a timestamp. Declaring each as its own named value keeps them readable and individually reusable. This is [`contract/sla.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract/sla.k):

```kcl
import enkinex_odcs.contract.sla

LatencySla = sla.ServiceLevelAgreement {
    property = "latency"
    value = 4
    unit = "d"
    element = "tab1.txn_ref_dt"
}

GeneralAvailabilitySla = sla.ServiceLevelAgreement {
    property = "generalAvailability"
    value = "2022-05-12T09:30:10-08:00"
}

EndOfSupportSla = sla.ServiceLevelAgreement {
    property = "endOfSupport"
    value = "2032-05-12T09:30:10-08:00"
}

EndOfLifeSla = sla.ServiceLevelAgreement {
    property = "endOfLife"
    value = "2042-05-12T09:30:10-08:00"
}

RetentionSla = sla.ServiceLevelAgreement {
    property = "retention"
    value = 3
    unit = "y"
    element = "tab1.txn_ref_dt"
}

FrequencySla = sla.ServiceLevelAgreement {
    property = "frequency"
    value = 1
    valueExt = 1
    unit = "d"
    element = "tab1.txn_ref_dt"
}

RegulatoryTimeOfAvailabilitySla = sla.ServiceLevelAgreement {
    property = "timeOfAvailability"
    value = "09:00-08:00"
    element = "tab1.txn_ref_dt"
    driver = "regulatory"
}

AnalyticsTimeOfAvailabilitySla = sla.ServiceLevelAgreement {
    property = "timeOfAvailability"
    value = "08:00-08:00"
    element = "tab1.txn_ref_dt"
    driver = "analytics"
}
```

## The support channels

Finally, [`contract/support.k`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract/support.k) lists where consumers can reach the owners. The Teams channel also shows a `CustomProperty` nested on a support entry, so the reuse of `common.property` carries down here too:

```kcl
import enkinex_odcs.common.property
import enkinex_odcs.contract.support

SlackSupport = support.Support {
    channel = "#product-help"
    tool = "slack"
}

EmailSupport = support.Support {
    channel = "datacontract-ann"
    tool = "email"
    url = "mailto:datacontract-ann@bitol.io"
}

FeedbackSupport = support.Support {
    channel = "Feedback"
    description = "General Product Feedback (Public)"
    url = "https://product-feedback.com"
}

TeamsSupport = support.Support {
    channel = "product-issues"
    tool = "teams"
    scope = "issues"
    customProperties = [
        property.CustomProperty {
            property = "servicehours"
            value = "9-5 CET"
        }
    ]
}
```

## Composing the root `contract.k`

With the `contract/` group written, the root file starts to take shape. It imports each contract module under a local alias and references the named values — nothing is redefined inline. At this stage `contract.k` wires in the fundamentals (domain, version, status, id, tenant, tags, and the creation timestamp) together with everything we authored above:

```kcl
import enkinex_odcs.odcs

import .contract.authoritative as contract_authoritative
import .contract.description as contract_description
import .contract.price as contract_price
import .contract.properties as contract_properties
import .contract.sla as contract_sla
import .contract.support as contract_support

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

The import lines use a leading dot (`import .contract.description`) because those are **local** modules within the project, whereas `import enkinex_odcs.odcs` reaches into the library dependency. Notice how the root reads like a table of contents — every field points at a named value declared elsewhere. There is no `apiVersion` or `kind` here; the schema supplies them on export.

The contract is not complete yet — it still lacks servers, ownership, and the dataset schema — but it already type-checks. That is the shape of the workflow: grow the contract one typed block at a time, and let the compiler keep you honest at each step.
