---
title: About dbt LSP
id: about-dbt-lsp
description: "Learn about the dbt language server protocol (LSP) features, including on-demand (lazy) compilation for faster editor startup."
sidebar_label: "About dbt LSP"
pagination_next: null
pagination_prev: null
---

The <Constant name="fusion_engine" /> offers benefits beyond the speed and power of the framework. The dbt VS Code extension, <Constant name="studio_ide" />, and <Constant name="insights" /> all contain a powerful set of features backed by our Language Server Protocol (LSP) that enable fast, efficient development workflows. The following features are supported across these tools:

import LSPFeatures from '/snippets/_lsp-features.md';

<LSPFeatures />

## Lazy compilation

The dbt language server uses on-demand compilation, also called lazy compilation. Lazy compilation starts automatically when you open a model file, you don't need to run `dbt compile` to trigger it. It compiles only the nodes it needs to answer questions about the file you are working in, instead of blocking on a full project compile first. That improves performance because you get editor features for your active file much sooner.

### What compiles first

When you open or focus on a model, the server determines a minimal set of nodes to compile so it can produce up-to-date LSP results for that model. That set includes the current model and its upstream dependencies (ancestors in the DAG), because rendered SQL and analysis depend on `ref`, sources, and inherited context from parents.

Nodes you are not actively working on remain `not compiled` until the background compilation pass reaches them. How long that takes depends on the size of your project. Until a node is compiled, LSP results for that node are not available.

When you switch to another file, the server reuses results from any compilations that already finished. If a compilation was still in progress when you switched files, it is cancelled and that partial work is discarded; the server then schedules a fresh compile for the newly focused model and its dependencies.

### Background compilation

After the minimal compile for your active file, the server continues with a background compile of the rest of the project. That pass fills in project-wide state without preventing you from using tooling on models that already finished compiling.

Background compilation enables full project analysis once it completes. Until then, some features that need the full graph may be limited. You can monitor compilation progress in your editor's status bar. When the progress notifications clear, the background compile is complete.

The <Constant name="fusion" /> CLI and the language server run independently. Running a command like `dbt run` or `dbt compile` from the terminal does not interrupt or affect LSP compilation.

