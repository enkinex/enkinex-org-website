---
sidebar_position: 6
sidebar_custom_props:
  icon: database
---

# Management & Support

Two sections of the standard are about operating and reaching the data product rather than about its data:
`managementPorts` are access points for managing the product itself — a REST admin endpoint, a Kafka control topic —
and `support` lists the channels consumers use to get help.

## Management ports

A `ManagementPort` requires `name` and `content`. Its `$type` defaults to `"rest"`, but the upstream example's single
management port is a Kafka topic, so we set it explicitly. This is
[`management/port.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/management/port.k):

```kcl
import enkinex_odps.management

DictionaryUpdatesPort = management.ManagementPort {
    content = "dictionary"
    $type = "topic"
    name = "tpc-dict-update"
    description = "Kafka topic for dictionary updates"
    tags = ["kafka"]
    customProperties = [
        {property = "kafkaTopic", value = "true"}
    ]
    authoritativeDefinitions = [
        {$type = "kafka_topic", url = "https://mykafka/topic"}
    ]
}
```

The `type` field is written `$type` in KCL: the `$`-prefix lets a schema use `type` as an attribute name without
colliding with the language keyword. It maps back to a plain `type:` key when rendered — you will see it in the
exported document on the last page.

The `customProperties` and `authoritativeDefinitions` entries are written as bare `{ ... }` dict literals inside a
typed list. KCL infers the element schema from `ManagementPort`'s own attribute types, so neither an import nor a
schema name is needed at each call site.

## Support channels

A `Support` entry requires `channel` and `url`. Unlike `ManagementPort.url`, which is optional, `Support.url` is always
validated against the library's URL pattern, which accepts `mailto:` links alongside `https:` — both appear here. This
is [`support/channels.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/support/channels.k):

```kcl
import enkinex_odps.support

DataTeamSlack = support.Support {
    channel = "Data Team Slack"
    url = "https://retailcorp.slack.com/archives/C1234567890"
    description = "Primary support channel for data product questions"
    tool = "slack"
    scope = "interactive"
}

EmailSupport = support.Support {
    channel = "Email Support"
    url = "mailto:data-support@retailcorp.com"
    description = "Email support for urgent issues"
    tool = "email"
    scope = "issues"
}
```

Writing each channel as its own named value is what makes it reusable: a shared incident channel or announcement feed
is declared once and referenced from every data product that uses it, instead of being copied between YAML files.

## Composing the root `product.k`

Two more local imports join the root file, and the `managementPorts` and `support` fields join the ones we already had:

```kcl
import enkinex_odps.odps

import .metadata.description as product_description
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

The data product now describes itself, its owners, how it is operated, and where to get help. What remains is the
largest piece: the ports — what the product actually consumes and produces — which we cover next.
