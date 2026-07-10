---
sidebar_position: 1
sidebar_custom_props:
  icon: book-2
---

# Introduction

Most data contracts start as a single YAML file, which is fine for one contract. But as organizations grow into a data mesh with many domains and contracts, issues appear. The same SLA block or custom property is often copied with minor changes into many files. YAML lacks modules, types, or ways to enforce rules before using a contract. Typos, missing constraints, or mismatched contracts can go unnoticed until something breaks later, often in production.

A better way is to manage contracts like engineers manage application code. Use modules to reuse parts, types to enforce rules, and a build step that clearly fails if a problem occurs before anything reaches production.

[**Enkinex ODCS**](https://github.com/enkinex/enkinex-odcs) is a modular [KCL](https://www.kcl-lang.io/) implementation of the [Open Data Contract Standard (ODCS) v3.1.0](https://github.com/bitol-io/open-data-contract-standard/tree/v3.1.0). It keeps the standard as it is, but adds features that a serialization format alone cannot provide: modularity, a static type system, strong immutability, and constraint checking. Invalid contracts fail during the build, not in production. You can use the same source to validate existing ODCS YAML or create new contracts as typed KCL. Here, "Governance-as-Code" means that the contract is a small, typed codebase rather than a single large, untyped document.

This tutorial is a hands-on port of the canonical ODCS **full example** into an equivalent, modular KCL project. It walks through installing KCL, creating the contract module, authoring the contract-level metadata, modeling access and ownership (roles and teams) and the server connection, declaring the dataset schema, and finally parsing, validating, and exporting the finished contract to YAML.

By the end, you will have a `contract.yaml` generated from typed KCL, split across small reusable files that mirror the structure of the `enkinex-odcs` library itself.
