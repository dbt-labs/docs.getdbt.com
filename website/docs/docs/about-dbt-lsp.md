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

The dbt language server uses on-demand compilation, also called lazy compilation. It compiles only the nodes it needs to answer questions about the file you are working in, instead of blocking on a full project compile first. That improves performance because you get editor features for your active file much sooner.

### What compiles first

When you open or focus on a model, the server determines a minimal set of nodes to compile so it can produce up-to-date LSP results for that model. That set includes the current model and its upstream dependencies (ancestors in the DAG), because rendered SQL and analysis depend on `ref`, sources, and inherited context from parents.

Nodes you are not actively working on can stay `not compiled` for a short time. Until a node is compiled, LSP results for that node are not available.

When you switch to another file, the server reuses work it has already done. Nodes that are already compiled stay compiled, and it schedules only what is still missing for the newly focused model.

### Background compilation

After the minimal compile for your active file, the server continues with a background compile of the rest of the project. That pass fills in project-wide state without preventing you from using tooling on models that already finished compiling.

Background compilation enables full project analysis once it completes. Until then, some features that need the full graph may be limited.

