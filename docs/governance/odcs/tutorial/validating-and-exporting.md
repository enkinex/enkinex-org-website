---
sidebar_position: 8
sidebar_custom_props:
  icon: file-export
---

# Validating & Exporting

## Parse and export

KCL is both a validator and a parser, so the same source drives type-checking and serialization.

**Parse and print** the composed contract to standard output. This is where type errors and failed constraints surface — if a required field is missing or a value violates a constraint, the build fails here rather than in production:

```bash
kcl run contract.k
```

**Export** to YAML (or JSON) by choosing the output format:

```bash
kcl run contract.k --format yaml > contract.yaml   # YAML
kcl run contract.k --format json > contract.json   # JSON
```

The exported [`contract.yaml`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract.yaml) is the finished ODCS document, generated from your typed KCL — and this is where `apiVersion: v3.1.0` and `kind: DataContract` reappear, supplied by the schema defaults you never had to write.

### The `just export` shortcut

In the repository, the export step is wrapped in the [`Justfile`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/Justfile). Running:

```bash
just export
```

parses the project's root contract and writes the result to [`enkinex-odcs-tutorial/contract.yaml`](https://github.com/enkinex/enkinex-odcs-tutorial/blob/main/contract.yaml) — the same final document, produced in one step.

## Wrapping up

Starting from an untyped YAML document, we rebuilt the ODCS full example as a typed, modular KCL project: contract metadata, access and ownership, the server, and the dataset schema, each in its own small file, composed by a root that reads like a table of contents. The result is validated at build time, and its parts are reusable across contracts — governance kept as code in the repository, rather than copied between YAML files.

The complete project is on GitHub under [**enkinex-odcs-tutorial**](https://github.com/enkinex/enkinex-odcs-tutorial)
