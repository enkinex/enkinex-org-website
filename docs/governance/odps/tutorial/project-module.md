---
sidebar_position: 3
sidebar_custom_props:
  icon: package
---

# Project Module

## The source we are porting

The data product we create is a direct port of the [
**customer-data-product.odps.yaml**](https://github.com/bitol-io/open-data-product-standard/blob/main/docs/examples/customer-data-product.odps.yaml)
from the ODPS project. It is helpful to read that file first: it describes a `Customer Data Product` owned by a
`Data Team` at `RetailCorp`, with input ports for payments and online transactions, output ports for raw and
consolidated transactions, a management port for dictionary updates, two support channels, and a two-person team.
It is short enough to read in one sitting, yet it already exercises every top-level section of the standard. Our goal
is to represent the same document as typed KCL, but in a shorter, simpler way at every level.

Two deliberate differences are worth calling out before we start:

* **Default values are omitted.** The main schema defines `apiVersion = "v1.0.0"` and `kind = "DataProduct"` as
  default values, so we never write them manually. KCL adds them when exporting. Note that the upstream document pins
  `apiVersion: v0.9.0`; `Enkinex ODPS v1.0.0` models the ODPS `v1.0.0` shape and does not aim to provide earlier
  versions, so the default applies instead.
* **Custom property names are normalized to camelCase.** The upstream example writes `transactions_version`,
  `kafka_topic`, and `data_team`; `CustomProperty.property` calls for camelCase names, "the same as if they were
  permanent properties in the contract", so this port writes `transactionsVersion`, `kafkaTopic`, and `dataTeam`.

Everything else — every ID, URL, port, value, and team member — is ported as-is.

## Creating the data product project module

A data product project is a **KCL module**: a directory with a `kcl.mod` manifest that declares the module's identity
and its dependencies.

### Initialize the module

Use [`kcl mod init`](https://www.kcl-lang.io/docs/tools/cli/package-management/command-reference/init) to scaffold it.
This creates the `kcl.mod` manifest, a `kcl.mod.lock` lockfile, and an initial `main.k`:

```bash
kcl mod init enkinex-odps-tutorial --version 1.0.0
```

Running it without a name initializes the **current** directory as a module; passing a name creates a subdirectory for
it.

### Add the `enkinex-odps` dependency

Use [`kcl mod add`](https://www.kcl-lang.io/docs/tools/cli/package-management/command-reference/add) to pull the
library straight from its GitHub repository. Pin it to a branch, tag, or commit so builds stay reproducible:

```bash
kcl mod add --git https://github.com/enkinex/enkinex-odps --tag 'v1.0.0'
```

That records the dependency under `[dependencies]` in your `kcl.mod`. Whenever you later change `kcl.mod` resync the
lockfile with [`kcl mod update`](https://www.kcl-lang.io/docs/tools/cli/package-management/command-reference/update):

```bash
kcl mod update
```

The finished manifest — the one in [
`enkinex-odps-tutorial/kcl.mod`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/kcl.mod) — is exactly what
those commands produce:

```toml
[package]
name = "enkinex-odps-tutorial"
edition = "0.12.7"
version = "1.0.0"
description = "Enkinex ODPS Tutorial"

[dependencies]
enkinex_odps = { git = "https://github.com/enkinex/enkinex-odps", tag = "v1.0.0" }
```

Note the underscore in `enkinex_odps`: KCL module names replace hyphens with underscores, and that is the name you
import from in your `.k` files.

### The project structure we are building

The point of authoring in KCL is modularity, so we do not pack everything into one file. The project follows the same
layout as the `enkinex-odps` library — one directory per logical group of the standard — and a root file composes the
pieces into the final `DataProduct`:

```text
enkinex-odps-tutorial/
├── kcl.mod                 # module manifest + enkinex-odps dependency
├── kcl.mod.lock            # resolved dependency lockfile
├── product.k               # root: composes every part into a DataProduct
├── product.yaml            # exported ODPS YAML (generated)
├── metadata/               # product-level description
│   └── description.k
├── input/                  # what the product consumes
│   └── port.k
├── output/                 # what the product produces
│   └── port.k
├── management/             # access points for operating the product
│   └── port.k
├── support/                # where consumers get help
│   └── channels.k
└── team/                   # ownership
    ├── member.k
    └── team.k
```

We build it bottom-up: the leaf files in `metadata/`, `team/`, `management/`, `support/`, `input/`, and `output/` each
declare a named, typed value, and the root `product.k` references those values by name. The sections that follow cover
one group at a time, starting with the product metadata and the first version of `product.k`.

:::note

The finished project lives under [enkinex-odps-tutorial](https://github.com/enkinex/enkinex-odps-tutorial/)
repository.

:::
