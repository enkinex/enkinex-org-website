---
sidebar_position: 7
sidebar_custom_props:
  icon: table
---

# Catalog

This is the piece the contract exists to govern: the **dataset schema**. We declare the tables and their columns under `catalog/`, then fold them into `odcs.k` to complete the contract.

The `catalog/` directory describes the shape of the data. It uses two schemas from the library's `catalog` module: `SchemaObject`, which models a table (or topic, or file), and `SchemaProperty`, which models a column (or field). A `SchemaObject` holds a list of `SchemaProperty` values, and both can carry relationships, data-quality rules, tags, and authoritative definitions.

This is where the modular approach earns its keep. Each column is written once as a named, typed value; the table then lists those columns by name. A column written this way is easy to read, easy to reuse, and validated the moment you build it.

## The receivers table

[`catalog/receiver.k`](https://github.com/enkinex/enkinex-odcs/blob/main/examples/full/catalog/receiver.k) declares four columns as `SchemaProperty` values and then assembles them into the `ReceiversMasterDataTable`. The primary key spans two columns — note `primaryKeyPosition` on `id` and `country_code` — and the `receiver_type` column carries a property-level relationship (a foreign key to a lookup table):

```kcl
import enkinex_odcs.catalog.object as schema_object
import enkinex_odcs.catalog.property as schema_property
import enkinex_odcs.catalog.relationship
import enkinex_odcs.common.property

ReceiverId = schema_property.SchemaProperty {
    id = "receiver_id_prop"
    name = "id"
    primaryKey = True
    primaryKeyPosition = 1
    businessName = "receiver identifier"
    logicalType = "string"
    physicalType = "varchar(18)"
    required = True
    description = "Unique identifier for receiver"
    unique = True
    classification = "restricted"
}

ReceiverCountry = schema_property.SchemaProperty {
    id = "country_code_prop"
    name = "country_code"
    primaryKey = True
    primaryKeyPosition = 2
    businessName = "receiver country"
    logicalType = "string"
    physicalType = "varchar(2)"
    required = True
    description = "Country code of the receiver"
    classification = "public"
}

ReceiverName = schema_property.SchemaProperty {
    id = "receiver_name_prop"
    name = "receiver_name"
    businessName = "receiver name"
    logicalType = "string"
    physicalType = "varchar(255)"
    required = True
    description = "Name of the receiver"
    classification = "restricted"
}

ReceiverType = schema_property.SchemaProperty {
    id = "receiver_type_prop"
    name = "receiver_type"
    businessName = "receiver type"
    logicalType = "string"
    physicalType = "varchar(20)"
    required = False
    description = "Type of receiver (individual, business, etc.)"
    classification = "public"
    relationships = [
        relationship.RelationshipPropertyLevel {
            to = "receiver_types.type_code"
            customProperties = [
                property.CustomProperty {
                    property = "description"
                    value = "Links to receiver type definitions"
                }
            ]
        }
    ]
}

ReceiversMasterDataTable = schema_object.SchemaObject {
    id = "receivers_obj"
    name = "receivers"
    physicalName = "receivers_master"
    physicalType = "table"
    businessName = "Receivers Master Data"
    description = "Master data for all receivers"
    tags: ["master-data", "receivers"]
    properties = [
        ReceiverId
        ReceiverCountry
        ReceiverName
        ReceiverType
    ]
}
```

The payoff is in the `properties` list: `ReceiverId`, `ReceiverCountry`, `ReceiverName`, and `ReceiverType` are the values declared above, referenced by name. Compare that to the upstream YAML, where each column is an inline block of untyped keys repeated in full.

## The payments table

[`catalog/payment.k`](https://github.com/enkinex/enkinex-odcs/blob/main/examples/full/catalog/payment.k) is richer. It shows the rest of what the catalog module can express: schema-level and property-level relationships, transformation metadata on a column, authoritative definitions attached to a property, and data-quality rules at both the property and the table level. The `DataQuality` schema comes from the library's `quality` module.

First, a couple of shared values — a list of authoritative definitions and a schema-level foreign key — declared once so the table can reference them:

```kcl
import enkinex_odcs.catalog.relationship
import enkinex_odcs.catalog.object as schema_object
import enkinex_odcs.catalog.property as schema_property
import enkinex_odcs.common.authoritative
import enkinex_odcs.common.property
import enkinex_odcs.quality.rule

AuthoritativeDefinitions = [
    authoritative.AuthoritativeDefinition {
        url = "https://catalog.data.gov/dataset/air-quality"
        $type = "businessDefinition"
    }
    authoritative.AuthoritativeDefinition {
        url = "https://youtu.be/jbY1BKFj9ec"
        $type = "videoTutorial"
    }
]

ForeignKeyRelationship = relationship.RelationshipSchemaLevel {
    $type = "foreignKey"
    from = [
        "tbl.rcvr_id"
        "tbl.rcvr_cntry_code"
    ]
    to = [
        "receivers.id"
        "receivers.country_code"
    ]
    customProperties = [
        property.CustomProperty {
            property = "description"
            value = "Composite key linking to receivers table"
        }
        property.CustomProperty {
            property = "cardinality"
            value = "many-to-one"
        }
    ]
}
```

Then the columns. `transaction_reference_date` shows partitioning and transformation metadata; `rcvr_id` carries a property-level foreign key; and `rcvr_cntry_code` attaches both authoritative definitions and a data-quality rule with its own schedule:

```kcl
TransactionReferenceDate = schema_property.SchemaProperty {
    id = "txn_ref_dt_prop"
    name = "transaction_reference_date"
    physicalName = "txn_ref_dt"
    primaryKey = False
    primaryKeyPosition = -1
    businessName = "transaction reference date"
    logicalType = "date"
    physicalType = "date"
    required = False
    description = "Reference date for transaction"
    partitioned = True
    partitionKeyPosition = 1
    criticalDataElement = False
    tags = []
    classification = "public"
    transformSourceObjects = [
        "table_name_1"
        "table_name_2"
        "table_name_3"
    ]
    transformLogic = "sel t1.txn_dt as txn_ref_dt from table_name_1 as t1, table_name_2 as t2, table_name_3 as t3 where t1.txn_dt=date-3"
    transformDescription = "defines the logic in business terms; logic for dummies"
    examples = [
        "2022-10-03"
        "2020-01-28"
    ]
    customProperties = [
        property.CustomProperty {
            property = "anonymizationStrategy"
            value = "none"
        }
    ]
}

PaymentReceiverId = schema_property.SchemaProperty {
    id = "rcvr_id_prop"
    name = "rcvr_id"
    primaryKey = True
    primaryKeyPosition = 1
    businessName = "receiver id"
    logicalType = "string"
    physicalType = "varchar(18)"
    required = False
    description = "A description for column rcvr_id."
    partitioned = False
    partitionKeyPosition = -1
    criticalDataElement = False
    tags: ["uid"]
    classification = "restricted"
    relationships = [
        relationship.RelationshipPropertyLevel {
            to = "receivers.id"
            $type = "foreignKey"
            customProperties = [
                property.CustomProperty {
                    property = "description"
                    value = "Links to receiver master data"
                }
            ]
        }
    ]
}

ReceiverCountryCode = schema_property.SchemaProperty {
    id = "rcvr_cntry_code_prop"
    name = "rcvr_cntry_code"
    primaryKey = False
    primaryKeyPosition = -1
    businessName = "receiver country code"
    logicalType = "string"
    physicalType = "varchar(2)"
    required = False
    description = "Country code"
    partitioned = False
    partitionKeyPosition = -1
    criticalDataElement = False
    tags: []
    classification = "public"
    authoritativeDefinitions = [
        authoritative.AuthoritativeDefinition {
            url = "https://collibra.com/asset/742b358f-71a5-4ab1-bda4-dcdba9418c25"
            $type = "businessDefinition"
        }
        authoritative.AuthoritativeDefinition {
            url = "https://github.com/myorg/myrepo"
            $type = "transformationImplementation"
        }
        authoritative.AuthoritativeDefinition {
            url = "jdbc:postgresql://localhost:5432/adventureworks/tbl_1/rcvr_cntry_code"
            $type = "implementation"
        }
    ]
    encryptedName = "rcvr_cntry_code_encrypted"
    quality = [
        rule.DataQuality {
            metric = "nullValues"
            mustBe = 0
            description = "column should not contain null values"
            dimension = "completeness"
            $type = "library"
            severity = "error"
            businessImpact = "operational"
            schedule = "0 20 * * *"
            scheduler = "cron"
            customProperties = [
                property.CustomProperty {
                    property = "FIELD_NAME"
                    value = "rcvr_cntry_code"
                }
                property.CustomProperty {
                    property = "COMPARE_TO"
                    value = "Some"
                }
                property.CustomProperty {
                    property = "COMPARISON_TYPE"
                    value = "Greater than"
                }
            ]
        }
    ]
}
```

A table-level quality rule and the table itself close the file. The `PaymentMetricsTable` references the shared `AuthoritativeDefinitions` and `ForeignKeyRelationship` from the top of the file, lists its three columns, and attaches the row-count check:

```kcl
RowCountQualityCheck = rule.DataQuality {
    metric = "rowCount"
    mustBeGreaterThan = 1000000
    $type = "library"
    description = "Ensure row count is within expected volume range"
    dimension = "completeness"
    method = "reconciliation"
    severity = "error"
    businessImpact = "operational"
    schedule = "0 20 * * *"
    scheduler = "cron"
}

PaymentMetricsTable = schema_object.SchemaObject {
    id = "tbl_obj"
    name = "tbl"
    physicalName = "tbl_1"
    physicalType = "table"
    businessName = "Core Payment Metrics"
    description = "Provides core payment metrics"
    authoritativeDefinitions = AuthoritativeDefinitions
    tags = ["finance", "payments"]
    dataGranularityDescription = "Aggregation on columns txn_ref_dt, pmt_txn_id"
    relationships = [
        ForeignKeyRelationship
    ]
    properties = [
        TransactionReferenceDate
        PaymentReceiverId
        ReceiverCountryCode
    ]
    quality = [
        RowCountQualityCheck
    ]
    customProperties = [
        property.CustomProperty {
            property = "business-key"
            value = ["txn_ref_dt", "rcvr_id"]
        }
    ]
}
```

## The complete `contract.k`

Adding the catalog imports and the `$schema` field completes the root file. This is the whole contract — every field points at a named, typed value declared in its own module, and the two tables from `catalog/` populate `$schema`:

```kcl
import enkinex_odcs.odcs
import enkinex_odcs.iam.team

import .catalog.payment
import .catalog.receiver
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
    authoritativeDefinitions = [
        contract_authoritative.SampleAuthoritativeDefinition
    ]
    description = contract_description.SampleContractDescription
    tenant = "ClimateQuantumInc"
    servers = [
        server_postgres.LocalPostgresServer
    ]
    $schema = [
        payment.PaymentMetricsTable
        receiver.ReceiversMasterDataTable
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

Set against the equivalent [single-file YAML](https://github.com/bitol-io/open-data-contract-standard/blob/main/docs/examples/all/full-example.odcs.yaml) — hundreds of nested lines, no types, no reuse — the KCL version is smaller at each layer, its pieces are reusable across contracts, and the whole thing is validated the moment you build it.
