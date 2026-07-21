---
sidebar_position: 2
sidebar_custom_props:
  icon: terminal-2
---

# Installing KCL

Enkinex ODCS is a KCL library, so the only prerequisite is the **KCL command-line tool**. It can be installed several ways depending on your platform: installation scripts for macOS, Linux, and Windows; package managers such as Homebrew, Scoop, Nix, or `go install`; a container image via Docker; or a binary release added to your `PATH`.

Because those steps are platform-specific and change over time, follow the official guide:

* [**Install KCL CLI**](https://www.kcl-lang.io/docs/user_docs/getting-started/install)
* [**Install KCL IDE Extension**](https://www.kcl-lang.io/docs/user_docs/getting-started/install#2-install-kcl-ide-extension) (optional)

Once it is on your `PATH`, confirm the CLI runs:

```bash
kcl --help
```
