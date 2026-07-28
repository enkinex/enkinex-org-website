---
sidebar_position: 8
sidebar_custom_props:
  icon: file-export
---

# Validating & Exporting

## Parse and export

KCL is both a validator and a parser, so the same source drives type-checking and serialization.

**Parse and print** the composed data product to standard output. This is where type errors and failed constraints
surface — if a required field is missing or a value violates a constraint, the build fails here rather than in
production:

```bash
kcl run product.k
```

**Export** to YAML (or JSON) by choosing the output format:

```bash
kcl run product.k --format yaml > product.yaml   # YAML
kcl run product.k --format json > product.json   # JSON
```

The exported [`product.yaml`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/product.yaml) is the finished
ODPS document, generated from your typed KCL — and this is where `apiVersion: v1.0.0` and `kind: DataProduct` reappear,
supplied by the schema defaults you never had to write, along with every `$type` rendered back as a plain `type:` key.

### The `just export` shortcut

In the repository, the export step is wrapped in the
[`Justfile`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/Justfile). Running:

```bash
just export
```

parses the project's root file and writes the result to
[`enkinex-odps-tutorial/product.yaml`](https://github.com/enkinex/enkinex-odps-tutorial/blob/main/product.yaml) — the
same final document, produced in one step.

## Wrapping up

Starting from an untyped YAML document, we rebuilt the ODPS customer data product example as a typed, modular KCL
project: product metadata, ownership, management and support, and the input and output ports, each in its own small
file, composed by a root that reads like a table of contents. The result is validated at build time, and its parts are
reusable across products — governance kept as code in the repository, rather than copied between YAML files.

The complete project is on GitHub under [**enkinex-odps-tutorial**](https://github.com/enkinex/enkinex-odps-tutorial)
