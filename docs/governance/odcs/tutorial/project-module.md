---
sidebar_position: 3
sidebar_custom_props:
  icon: package
---

# Project Module

## The source we are porting

The contract we create is a direct port of the upstream [**full-example.odcs.yaml**](https://github.com/bitol-io/open-data-contract-standard/blob/main/docs/examples/all/full-example.odcs.yaml) from the ODCS project. It is worth reading that file first — it is a few hundred lines of deeply nested YAML without types or reuse. Our goal is to represent the same contract as typed KCL, but in a more compact way at every level.

Two deliberate differences are worth calling out before we start:

*   **Deprecated declarations are dropped.** This is the `v3.1.0-draft` implementation, tracking ODCS v3.1.0. It does not carry deprecated constructs from the standard (for example `dataProduct` or `slaDefaultElement`), so those are simply absent from the port.

*   **Defaults are omitted.** The root schema pins `apiVersion = "v3.1.0"` and `kind = "DataContract"` as schema defaults, so we never write them by hand. KCL emits them on export. The same holds for any other field whose default already matches the example.

## Creating the contract project module

A contract project is a **KCL module**: a directory with a `kcl.mod` manifest that declares the module's identity and its dependencies.

### Initialize the module

Use [`kcl mod init`](https://www.kcl-lang.io/docs/tools/cli/package-management/command-reference/init) to scaffold it. This creates the `kcl.mod` manifest, a `kcl.mod.lock` lockfile, and an initial `main.k`:

```bash
kcl mod init full-example --version 3.1.0-draft
```

Running it without a name initializes the **current** directory as a module; passing a name creates a subdirectory for it.

### Add the `enkinex-odcs` dependency

Use [`kcl mod add`](https://www.kcl-lang.io/docs/tools/cli/package-management/command-reference/add) to pull the library straight from its GitHub repository. Pin it to a branch, tag, or commit so builds stay reproducible:

```bash
kcl mod add --git https://github.com/enkinex/enkinex-odcs --commit 'fe8b0b1'
```

That records the dependency under `[dependencies]` in your `kcl.mod`. Whenever you later change `kcl.mod` — bumping the pinned commit, for instance — resync the lockfile with [`kcl mod update`](https://www.kcl-lang.io/docs/tools/cli/package-management/command-reference/update):

```bash
kcl mod update
```

The finished manifest — the one in [`examples/full/kcl.mod`](https://github.com/enkinex/enkinex-odcs/blob/main/examples/full/kcl.mod) — is exactly what those commands produce:

```toml
[package]
name = "enkinex-odcs-full-example"
edition = "0.12.4"
version = "3.1.0-draft"
description = "Enkinex KCL implementation for ODCS full example"

[dependencies]
enkinex_odcs = { git = "https://github.com/enkinex/enkinex-odcs", commit = "fe8b0b1" }
```

### The project structure we are building

The point of authoring in KCL is modularity, so we do not pack everything into one file. The project follows the same layout as the `enkinex-odcs` library — one directory per logical group of the standard — and a root file composes the pieces into the final `DataContract`:

```text
full-example/
├── kcl.mod                 # module manifest + enkinex-odcs dependency
├── kcl.mod.lock            # resolved dependency lockfile
├── odcs.k                  # root: composes every part into a DataContract
├── contract.yaml           # exported ODCS YAML (generated)
├── catalog/                # dataset shape: schema objects & properties
│   ├── payment.k
│   └── receiver.k
├── contract/               # contract-level metadata
│   ├── authoritative.k
│   ├── description.k
│   ├── price.k
│   ├── properties.k
│   ├── sla.k
│   └── support.k
├── iam/                    # access & ownership
│   ├── member.k
│   └── role.k
└── server/                 # connection details
    └── postgres.k
```

We build it bottom-up: the leaf files in `contract/`, `iam/`, `server/`, and `catalog/` each declare a named, typed value, and the root `odcs.k` references those values by name. The sections that follow cover one group at a time, starting with the `contract/` group and the first version of `odcs.k`.

:::note

The finished project lives under [`examples/full`](https://github.com/enkinex/enkinex-odcs/tree/main/examples/full) in the repository. In that repo the root file is named `contract.k`; the tutorial calls it `odcs.k` for clarity, but the contents are identical.

:::
