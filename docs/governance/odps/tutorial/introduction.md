---
sidebar_position: 1
sidebar_custom_props:
  icon: book-2
---

# Introduction

This tutorial is a hands-on porting of the main **ODPS customer data product example** into a modular code project. It
walks through installing the [KCL](https://www.kcl-lang.io/) language CLI, creating the data product module, writing
the product-level metadata, recording ownership, describing how the product is operated and supported, defining the
ports it consumes and produces, and finally reading, checking, and exporting the finished data product to YAML.

By the end, you will have a `product.yaml` created from typed KCL, split into small, reusable files that match the
structure of the [enkinex-odps](https://github.com/enkinex/enkinex-odps) library itself.

## What makes YAML challenging for Computational Governance?

Most data products start as a single YAML file, which works for one product owned by one team. But as organizations
grow into data platforms with dozens of products, each with its own input ports, output ports, management endpoints,
and ownership records, problems arise. The same support-channel block or custom property is copied, with minor
changes, into many files. YAML does not have modules, types, or ways to check rules before using a document. A typo in
a port's `contractId`, a malformed URL, or a missing date can go unnoticed until a consumer trips over it at runtime.

## Why Governance as Code?

A better way is to manage data products like engineers manage application code. Use modules to reuse parts, types to
enforce rules, and a build step that clearly fails if a problem occurs before anything reaches production.

[**Enkinex ODPS**](https://github.com/enkinex/enkinex-odps) is a modular implementation of the [**Open Data Product
Standard (ODPS)**](https://github.com/bitol-io/open-data-product-standard). It keeps the standard as it is, but adds
features that a data format alone cannot provide: modularity, a static type system, strong immutability, and rule
checking. Invalid data products fail during the build, not in production.

You can use the same source to check existing ODPS YAML or to create new data products in typed KCL. Here,
“Governance-as-Code” means that the data product is a small, typed codebase rather than a single large, untyped
document.
