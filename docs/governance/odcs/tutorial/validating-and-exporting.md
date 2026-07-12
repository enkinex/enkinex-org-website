---
sidebar_position: 8
sidebar_custom_props:
  icon: file-export
---

# Validating & Exporting

## Parse, validate, and export

KCL is both a validator and a renderer, so the same source drives type-checking and serialization.

**Validate** an existing ODCS YAML file against the schema. This is the path you use to bring an already-written contract under type checking without rewriting it — the YAML is coerced into the typed schemas, so the per-type server rules, the data-quality operator constraints, and the stable-`id` pattern all fire:

```bash
kcl vet contract.yaml odcs.k --format yaml --schema DataContract
```

**Parse and print** the composed contract to standard output. This is where type errors and failed constraints surface — if a required field is missing or a value violates a constraint, the build fails here rather than in production:

```bash
kcl run odcs.k
```

**Export** to YAML (or JSON) by choosing the output format:

```bash
kcl run odcs.k --format yaml > contract.yaml   # YAML
kcl run odcs.k --format json > contract.json   # JSON
```

The exported [`contract.yaml`](https://github.com/enkinex/enkinex-odcs/blob/main/examples/full/contract.yaml) is the finished ODCS document, generated from your typed KCL — and this is where `apiVersion: v3.1.0` and `kind: DataContract` reappear, supplied by the schema defaults you never had to write.

### The `just example` shortcut

In the repository, the export step is wrapped in the [`Justfile`](https://github.com/enkinex/enkinex-odcs/blob/main/Justfile). Running:

```bash
just example
```

parses the project's root contract and writes the result to [`examples/full/contract.yaml`](https://github.com/enkinex/enkinex-odcs/blob/main/examples/full/contract.yaml) — the same final document, produced in one step.

## Wrapping up

Starting from an untyped YAML document, we rebuilt the ODCS full example as a typed, modular KCL project: contract metadata, access and ownership, the server, and the dataset schema, each in its own small file, composed by a root that reads like a table of contents. The result is validated at build time, and its parts are reusable across contracts — governance kept as code in the repository, rather than copied between YAML files.

From here you can point `kcl vet` at your own existing contracts to bring them under type checking, or start factoring your organization's shared rules, server catalogs, and naming conventions into KCL modules that many contracts import.

The complete project is on GitHub under [`examples/full`](https://github.com/enkinex/enkinex-odcs/tree/main/examples/full).
