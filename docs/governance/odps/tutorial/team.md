---
sidebar_position: 5
sidebar_custom_props:
  icon: users
---

# Team

The `team/` directory covers who owns the data product. It maps to two schemas from the library's `team` module:
`TeamMember`, for the people accountable for the product, and `Team`, for the group they form.

## Team members

The people side lives in [`team/member.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/team/member.k).
Each is a `TeamMember`, and the schema validates `dateIn` and `dateOut` against an ISO-8601 date pattern
(`YYYY-MM-DD`) in its own `check` block, so a malformed date is rejected at compile time rather than silently accepted
as an arbitrary string:

```kcl
import enkinex_odps.team

JohnDoe = team.TeamMember {
    username = "john.doe@retailcorp.com"
    name = "John Doe"
    description = "Data Product Owner"
    role = "owner"
    dateIn = "2023-01-15"
}

JaneSmith = team.TeamMember {
    username = "jane.smith@retailcorp.com"
    name = "Jane Smith"
    description = "Data Steward"
    role = "data steward"
    dateIn = "2023-02-01"
}
```

Both members set only `dateIn`. The optional `dateOut` and `replacedByUsername` stay unset, since neither person has
left the team in the source document — the schema allows those fields without forcing them on every entry.

## The team

[`team/team.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/team/team.k) assembles the two members into
a `Team`. Because `Team` extends the library's discoverable base, it carries `tags` and `customProperties` of its own —
this is the only place in the document where a composite, rather than a port, is tagged:

```kcl
import enkinex_odps.team

import .member as team_member

DataTeam = team.Team {
    name = "Data Team"
    description = "The Data Team is responsible for the data product."
    tags = ["data", "team"]
    customProperties = [
        {property = "dataTeam", value = "true"}
    ]
    members = [
        team_member.JohnDoe
        team_member.JaneSmith
    ]
}
```

The second import is the interesting one. `team/team.k` and `team/member.k` sit in the same directory, but that is not
enough to put `JohnDoe` in scope: a KCL import resolves a single **file**, so a file that wants values from a sibling
file must import it — `import .member as team_member` — and reach them through the alias. The same leading-dot rule as
the root file applies, one directory level down.

Keeping the members in their own file means a person is declared once and can be referenced from more than one team,
while the grouping — the team's name, description, and tags — stays with the product that defines it.

## Composing the root `product.k`

Now we extend the root file from the previous section. One new local import appears, and the `team` field joins the
ones we already had:

```kcl
import enkinex_odps.odps

import .metadata.description as product_description
import .team.team as product_team

odps.DataProduct {
    name = "Customer Data Product"
    id = "fbe8d147-28db-4f1d-bedf-a3fe9f458427"
    domain = "seller"
    status = "draft"
    tenant = "RetailCorp"
    tags = ["customer"]
    description = product_description.ProductDescription
    team = product_team.DataTeam
    productCreatedTs = "2023-01-15T10:30:00Z"
}
```

The root never mentions `JohnDoe` or `JaneSmith`. It names one value, `DataTeam`, and that value knows how it was
built — which is exactly the property that makes a team reusable across products.
