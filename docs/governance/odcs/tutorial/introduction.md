---
sidebar_position: 1
sidebar_custom_props:
  icon: book-2
---

# Introduction

This tutorial is a hands-on porting of the main **ODCS full example** into a modular code project. It walks through
installing the [KCL](https://www.kcl-lang.io/) language CLI, creating the contract module, writing the contract-level
metadata, modeling access and ownership (roles and teams) and the server connection, defining the dataset structure, and
finally reading, checking, and exporting the finished contract to YAML.

By the end, you will have a `contract.yaml` created from typed KCL, split into small, reusable files that match the
structure of the [enkinex-odcs](https://github.com/enkinex/enkinex-odcs) library itself.

## What makes YAML challenging for Computational Governance?

Most data contracts start as a single YAML file, which works for one contract. But as organizations evolve into data
platforms with many domains and contracts, problems arise. The same SLA or quality rule is often copied into many files.
YAML does not have modules, types, or ways to check rules before using a contract. Typos, missing limits, or mismatched
contracts can go unnoticed until something breaks later, often in production.

## Why Governance as Code?

A better way is to manage contracts like engineers manage application code. Use modules to reuse parts, types to enforce
rules, and a build step that clearly fails if a problem occurs before anything reaches production.

[**Enkinex ODCS**](https://github.com/enkinex/enkinex-odcs) is a modular implementation of the [**Open Data Contract
Standard (ODCS)**](https://github.com/bitol-io/open-data-contract-standard). It keeps the standard as it is, but adds
features that a data format alone cannot provide: modularity, a static type system, strong immutability, and rule
checking. Invalid contracts fail during the build, not in production.

You can use the same source to check the existing ODCS YAML or to create new contracts in typed KCL. Here,
“Governance-as-Code” means that the contract is a small, typed codebase rather than a single large, untyped document.
