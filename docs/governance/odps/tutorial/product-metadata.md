---
sidebar_position: 4
sidebar_custom_props:
  icon: license
---

# Product Metadata

Every ODPS document carries a set of root-level fields that identify the data product itself, plus a `description`
block covering its purpose, limitations, and usage. The scalars live directly on the root; the description block is the
first named value we author in its own file.

## The root-level fields

These come straight from the upstream example and land directly on the root `DataProduct` schema. No separate file is
needed, since they are plain scalars and a tag list:

| Field              | Value                                  | Notes                                                                              |
|--------------------|----------------------------------------|------------------------------------------------------------------------------------|
| `id`               | `fbe8d147-28db-4f1d-bedf-a3fe9f458427` | Required. A UUID reduces the risk of name collisions.                              |
| `name`             | `Customer Data Product`                |                                                                                     |
| `domain`           | `seller`                               | Business domain.                                                                    |
| `status`           | `draft`                                | Required. Closed to `proposed \| draft \| active \| deprecated \| retired`.         |
| `tenant`           | `RetailCorp`                           | Organization identifier.                                                            |
| `productCreatedTs` | `2023-01-15T10:30:00Z`                 | Checked against an ISO-8601 date-time pattern.                                      |
| `tags`             | `["customer"]`                         |                                                                                     |

`apiVersion` and `kind` are **not** listed: as covered on the previous page, both are left to their schema defaults.

## The description

[`metadata/description.k`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/metadata/description.k) fills in
the `Description` schema:

```kcl
import enkinex_odps.common

ProductDescription = common.Description {
    purpose = "Enterprise view of a customer."
    limitations = "No known limitations."
    usage = "Check the various artefacts for their own description."
}
```

`Description` comes from the `common` module because its building blocks are reused across the standard — you will see
`common` again behind the `tags`, `customProperties`, and `authoritativeDefinitions` that ports and teams carry.

Note the shape of the import: `import enkinex_odps.common` brings in the **whole `common` package**, so every schema it
declares — `Description`, `AuthoritativeDefinition`, `CustomProperty` — is reachable through the `common.` prefix. Each
of the library's packages is imported the same way, which keeps one import line per module no matter how many schemas
you use from it.

## Composing the root `product.k`

With the description written, the root file starts to take shape. It imports the leaf module under a local alias and
references the named value — nothing is redefined inline. At this stage `product.k` wires in the fundamentals (name,
id, domain, status, tenant, tags, and the creation timestamp) together with the description we just authored:

```kcl
import enkinex_odps.odps

import .metadata.description as product_description

odps.DataProduct {
    name = "Customer Data Product"
    id = "fbe8d147-28db-4f1d-bedf-a3fe9f458427"
    domain = "seller"
    status = "draft"
    tenant = "RetailCorp"
    tags = ["customer"]
    description = product_description.ProductDescription
    productCreatedTs = "2023-01-15T10:30:00Z"
}
```

The import line uses a leading dot (`import .metadata.description`) because that is a **local** module within the
project, whereas `import enkinex_odps.odps` reaches into the library dependency. Notice how the root reads like a table
of contents — every composed field points at a named value declared elsewhere. There is no `apiVersion` or `kind` here;
the schema supplies them on export.

The data product is not complete yet — it still lacks its team, ports, and support channels — but it already
type-checks. That is the shape of the workflow: grow the document one typed block at a time, and let the compiler keep
you honest at each step.
