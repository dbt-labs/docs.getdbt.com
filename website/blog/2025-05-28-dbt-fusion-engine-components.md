---
title: "The Components of the dbt Fusion engine and how they fit together"
description: "The new engine makes it possible to decouple source code from functionality, introducing new ways to distribute functionality to the Community."
slug: dbt-fusion-engine-components
image: /img/blog/2025-05-28-dbt-fusion-engine/next-gen-star.png
authors: [jason_ganz, joel_labes]
tags: [analytics craft, data ecosystem]
hide_table_of_contents: false
date: 2025-05-28
is_featured: true
---

Today, we announced the [dbt Fusion engine](/blog/dbt-fusion-engine).

Fusion isn't just one thing — it's a set of interconnected components working together to power the next generation of analytics engineering.

This post maps out each piece of the Fusion architecture, explains how they fit together, and clarifies what's available to you whether you're compiling from source, using our pre-built binaries, or developing within a dbt Fusion powered product experience.

From the Rust engine to the VS Code extension, through to new Arrow-based adapters and Apache-licensed foundational technologies, we'll break down exactly what each component does, how each component is licensed (for why, see [Tristan's accompanying post](https://www.getdbt.com/blog/new-code-new-license-understanding-the-new-license-for-the-dbt-fusion-engine)), and how you can start using it and get involved today.

<!--truncate-->

*This post describes the state of the world as it will be when Fusion reaches General Availability. For a look at the path to GA, read [this post](/blog/dbt-fusion-engine-path-to-ga).*

## There are a number of different ways to access the dbt Fusion engine {#ways-to-access}

A big change between the dbt Fusion engine and the dbt Core engine is their language. Core is Python; Fusion is Rust. This is meaningful not just because of the performance benefits, but because it creates a new way for us to distribute functionality to the community.

To distribute a Python program, you also have to distribute its underlying source code. But Rust is a compiled language, meaning we can share either the source code or just the compiled binaries derived from that source code.

This means that features which would have otherwise had to stay completely proprietary for IP reasons can instead be broadly distributed in binary form. There's also a completely source-available version of dbt Fusion which will exceed dbt Core's capabilities by the time we reach GA.

## What variants of the dbt Fusion engine exist?

### Source-available dbt Fusion engine

Artifact type: Code

Available at: [https://github.com/dbt-labs/dbt-fusion](https://github.com/dbt-labs/dbt-fusion) (Note: this repo currently only contains the code necessary for a `dbt parse` and `dbt deps` - more will follow!)

License: ELv2

This will be the foundation of the Fusion engine - the code that lets you:

- Execute your `dbt seed/run/test/build`
- Render your Jinja and create your DAG
- Connect to the adapters that render your dbt project into the DDL and DML that hits your warehouse
- Produce the artifacts in your dbt project

To be clear, the self-compiled binary that's available today doesn't do much yet. By the time the new engine enters general availability, its source-available components will [exceed the net capabilities of dbt Core](/blog/dbt-fusion-engine-path-to-ga). **If you are a data team running dbt Core, simply running the self-compiled version of dbt Fusion will be a pure upgrade.**

This repository will also include the code necessary for [Level 1 SQL Comprehension](/blog/the-levels-of-sql-comprehension#level-1-parsing) (the ability to parse SQL into a syntax tree).

As long as you comply with the [three restrictions in ELv2](http://www.getdbt.com/licenses-faq):

- ✅ You can adopt the binary into your data workflows without dbt Labs' involvement
- ✅ You can see and modify the code

### Precompiled dbt Fusion engine binary

Artifact type: Precompiled binary

How to access: download following the instructions [here](/docs/fusion/install-fusion-cli)

License: ELv2

When you download the precompiled binary created by dbt Labs, it contains:

- **All of the functionality in the Source Available Fusion**

- Additional capabilities which are derived from proprietary code (such as the [Level 2 SQL Comprehension](/blog/the-levels-of-sql-comprehension#level-2-compiling) required to compile and type-check your SQL).

As long as you comply with the three restrictions in ELv2,

- ✅ You can adopt the binary into your data workflows without dbt Labs' involvement
- ❌ But you cannot see or modify the code itself

**The vast majority of existing dbt Core users that adopt the freely distributed components of Fusion should use the binary to do so, rather than compiling it from source code.** The binary has the same permissions but more capabilities (and it saves you from having to compile it yourself). You can use it internally at your company for free, even if you are not a dbt Labs customer.

### Using the dbt Fusion engine with a commercial agreement

Artifact type: Precompiled binary and managed service

Available at: [Download binary](/docs/fusion/install-fusion-cli) and [sign up for the service](http://getdbt.com/signup)

License: ELv2 (binary) and Proprietary (service)

Organizations who *do* have a commercial agreement will unlock even more capabilities, but they'll use the exact same publicly-released binary discussed above. If you want to start using platform features, [such as dbt Mesh](https://docs.getdbt.com/docs/mesh/govern/project-dependencies), all you need to do is [download a configuration file](https://docs.getdbt.com/docs/cloud/configure-cloud-cli#configure-the-dbt-cloud-cli). *(Joel commentary - As someone who has been juggling the dbt Cloud CLI alongside dbt Core for the last couple of years, I cannot overstate how thrilled I am by this.)*

Obviously there's additional cloud-backed services necessary to deliver platform-specific features, such as State-Aware Orchestration. That code is proprietary and governed by your agreement with dbt Labs.

## Other pieces of the puzzle

The dbt Fusion engine is the headline act, but its underlying technologies can be mixed and matched in a variety of ways.

### The dbt VS Code Extension and Language Server

Artifact type: Precompiled binaries

How to access: [Install on the VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)

License: Proprietary

The dbt VS Code extension is one of the first product experiences built on top of Fusion. It is not *part* of Fusion, it is *powered* by Fusion and is part of the wider dbt platform's offerings (with a generous free tier). Specifically, the VS Code extension interacts with another brand-new binary, the dbt [Language Server](https://microsoft.github.io/language-server-protocol/).

The Language Server is built on top of a subset of the technology powering the extended Fusion engine: as an example, it can quickly compile SQL and interact with databases, but it defers to the dbt binary when it's time to actually run a model.

<Lightbox src="/img/blog/2025-05-28-dbt-fusion-engine-components/vscode-ext-binary-roles.png" title="The VS Code extension interacts with the Language Server to understand your SQL, and the Fusion binary to execute your SQL." />

### The dbt Authoring Layer

Artifact type: JSON Schema definitions

Available at: Git repos for [input files](https://github.com/dbt-labs/dbt-jsonschema) and [output artifacts](https://github.com/dbt-labs/schemas.getdbt.com)

License: Apache 2.0

When you think of dbt, you're probably thinking of a combination of the Engine (described above) and the Authoring Layer.

The Authoring Layer is made up of everything necessary to define the *what* of a dbt project: things like the **YAML specs, Artifact specs, CLI commands and flags**, and **macro signatures**. As the user interface to dbt, the authoring layer is standard between Core and Fusion, although the Fusion engine does not include support for various behaviours and functions deprecated in earlier releases of dbt Core.

For the first time, we're releasing a series of definitive JSON schemas, _backed by the code in dbt Core and Fusion_, that encapsulate the acceptable content of dbt's various YAML files. These are Apache 2.0-licensed and will be particularly helpful for other tools integrating with dbt projects.

This joins the existing JSON schemas defining the shape of dbt's output artifacts (e.g. `manifest.json`). As we stabilize Fusion's metadata output (logging and artifacts) on the path to GA, we will update the published schemas.

### dbt Fusion engine adapters

Artifact type: Source code

Available at: Initial code in [`dbt-fusion` repo](https://github.com/dbt-labs/dbt-fusion), with more to come

License: Apache 2.0 (later this year)

Adapters are responsible for two key tasks:

- Knowing how to create the appropriate SQL commands (via macros and materializations) for a data platform
- Connecting to that target data platform and sending it SQL commands

Much like Fusion is the next generation engine for dbt, we also needed next-generation *adapters* for dbt. These adapters are written in Rust and built on the Apache Arrow standard.

The templating of SQL commands largely carries over from macros in the dbt Core adapters. Database connectivity is another story, the dbt Fusion engine cannot use the Python classes present in each adapter, for reasons both practical and performance-related.

Enter the Apache Arrow ecosystem at large, and the new [ADBC API](https://arrow.apache.org/adbc/current/index.html) in particular. ADBC is a future-looking platform for database connectivity, and we are leaning into it heavily with these Fusion adapters.

Because the ADBC standard is extremely new, not all databases are compatible with ADBC yet, and using ADBC in a Rust client isn't easy. To solve both problems, we have created a Rust client library, `XDBC` that:

- Supports ODBC connections to databases where Arrow is not yet provided as an output
- Provides generic methods for creating and managing connections to databases
- Is useful for anyone who wants to build data tooling in Rust, inside or outside of the dbt ecosystem

All of this will be open-sourced under the Apache 2.0 license later this year, namely:

- Fusion adapters we have created
- The XDBC library
- We'll also continue upstreaming improvements to Apache Arrow's ADBC project

### ANTLR Grammars

Artifact type: g4 files

Available at: (repo to come, in the meantime you can discuss this in #dbt-fusion-engine in the dbt Slack)

License: Apache 2.0 (later this year)

[ANTLR](https://www.antlr.org/) grammars are the formal language specifications that let Fusion [parse](/blog/sql-comprehension-technologies) every SQL statement across multiple dialects. Specifically, ANTLR takes in these declarative, high level grammars and uses them to generate a parser. The grammars have wide utility anywhere it's necessary to parse SQL – not just in Fusion – and we're releasing them as Apache 2 to enable the Community and others in the data ecosystem to build on top of them.

Most ANTLR grammars are only applicable to a single dialect, but the SDF team created a system which makes it possible to define a shared base grammar and generate each warehouse's g4 file from there. This halves the amount of work required to support a new dialect at the level of precision and robustness required.

### dbt-jinja

Artifact type: Source code

Available at: [A subdirectory of the dbt-fusion repo](https://github.com/dbt-labs/dbt-fusion/tree/main/dbt-jinja) (but there's still work to do before it's easy to use outside of the Fusion repository)

License: Apache 2.0

Since Fusion is completely Rust-based, while Jinja is a Python project, we needed a completely new way to render all the Jinja spread through users' projects. We started by switching to [minijinja](https://github.com/mitsuhiko/minijinja): a Rust port of a subset of the original Jinja project, written by Jinja's original maintainer.

This subset of coverage wasn't enough to support existing dbt projects, so we created Rust-native implementations of the majority of these missing features. This achieved the best of both worlds: significant performance improvements while maintaining compatibility with users' existing codebases.

dbt-jinja is the most feature-complete implementation of Jinja in Rust, and is available with an Apache 2.0 license today, with a more formal release (documentation etc) later this year. It's useful whether you're building tooling to operate on top of dbt projects, or working on something completely different which just needs to render Jinja quickly.

## How do I engage with these components?

Our [Contributors' Principles](/community/resources/contributor-expectations) remain: Building dbt is a team sport!

- If you want to open a PR against publicly-viewable code, you can.
- If you want to open issues describing bugs during the Fusion engine's beta period, you can. (This is probably one of the highest-leverage things you can do!)
- If you want to open a discussion and pitch a new way to use dbt more effectively in our new SQL-aware world, you can.
- If you want to move upstream, and contribute to the standards underlying the dbt Fusion engine like Arrow, ADBC, Iceberg, or DataFusion, you can. You might see some familiar faces while you're there!
- If you just want to let dbt get better and better in the background, you can do that too.
- Want to get involved in the team building this? If the components here are uniquely interesting to you, email careers.fusion@dbtlabs.com.

If you need a hand wrapping your head around any of these new components, drop by #dbt-fusion-engine in the Community Slack - we'd love to chat.
