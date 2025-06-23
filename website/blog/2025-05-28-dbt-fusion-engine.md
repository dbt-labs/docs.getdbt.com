---
title: "Meet the dbt Fusion Engine: the new Rust-based, industrial-grade engine for dbt"
description: "The dbt Fusion engine delivers a next-gen developer experience by combining high-speed execution with deep understanding of your code."
slug: dbt-fusion-engine
image: /img/blog/2025-05-28-dbt-fusion-engine/next-gen-star.png
authors: [jason_ganz]

tags: [analytics craft, data ecosystem]
hide_table_of_contents: false

date: 2025-05-28
is_featured: true
---

## TL;DR: What You Need to Know

- dbt’s familiar authoring layer remains unchanged, but the execution engine beneath it is completely new.
- The new engine is called the dbt Fusion engine — rewritten from the ground up in Rust based on technology [from SDF](https://www.getdbt.com/blog/dbt-labs-acquires-sdf-labs).  The dbt Fusion engine is substantially faster than dbt Core and has built in [SQL comprehension technology](/blog/the-levels-of-sql-comprehension) to power the next generation of analytics engineering workflows.
- The dbt Fusion engine is currently in beta. You can try it today if you use Snowflake — with additional adapters coming starting in early June. Review our [path to general availability](/blog/dbt-fusion-engine-path-to-ga) (GA) and [try the quickstart](/guides/fusion).
- **You do not need to be a dbt Labs customer to use Fusion - dbt Core users can adopt the dbt Fusion engine today for free in your local environment.**
- You can use Fusion with the [new dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt), [directly via the CLI](/docs/fusion/install-fusion), or [via dbt Studio](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine).
- This is the beginning of a new era for analytics engineering. For a glimpse into what the Fusion engine is going to enable over the next 1 to 2 years, [read this post](https://getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine).

<!--truncate-->

Since its introduction in 2016, dbt has paved the way for the analytics engineering revolution. Teams worldwide have moved from ad hoc processes running customized SQL scripts into a mature analytics workflow based on the [dbt viewpoint](https://docs.getdbt.com/community/resources/viewpoint). dbt enables data practitioners to *work like software engineers*, building their analytics code as an asset to ship trusted data products faster.

dbt came to represent many things:

- A **viewpoint** on how analytics should be done
- A **workflow** where data practitioners could put that viewpoint into action
- A **framework** — dbt Core — that powered this workflow comprised of:
  - An authoring layer: The schema, spec, and definitions for a dbt project written in SQL, YML, and Jinja
  - An engine: The tooling via which the authoring layer was built and executed against a data platform, resolving templated code into executable SQL, building your dependency graph, and more.

<Lightbox src="/img/blog/2025-05-28-dbt-fusion-engine/engine-and-authoring-layer.png" title="dbt is made up of two different things: authoring layer and engine." />

While the authoring layer has continued to evolve nicely, giving dbt developers ever-more functionality to work with, the engine itself, dbt Core, is still built on the same technology and uses the same primary design principles that it started with in 2016. This causes two primary problems that cannot be iteratively solved:

1. dbt Core can be *slow*.  It’s built in Python and for larger dbt projects it can become unworkable. Even for smaller projects, to power a great developer experience, users would need a step change in performance.
2. The dbt engine renders SQL, but it doesn’t *comprehend SQL.* That means that any functionality relying on specifics of SQL code was impossible to build into dbt.

And so it became clear that for us to power the analytics workloads of tomorrow, we weren't going to get there with incremental improvements — we needed to **rebuild the dbt engine from scratch**. We needed:

- An engine built for speed.
- An engine that *knows about your code.*
- An engine that powers the next generation of developer experience.

And that engine is Fusion.

## What exactly is Fusion?

Fusion is the new engine for dbt.

If the authoring layer is "what" your dbt project is supposed to do, then the engine is the "how." That includes:

- Rendering Jinja
- Building dependency graphs
- Creating artifact files
- Communicating with databases

At first glance, Fusion looks a lot like dbt Core. Your projects are built using the familiar dbt authoring layer. You still write SQL and Jinja. You still type `dbt run`. (To make it easier to try Fusion, we're also shipping with an optional `dbtf` alias, as many users have the `dbt` namespace already specified).

But underneath that is a layer of technical depth and rigor that is entirely new to dbt, happening at the engine layer.

Fusion:

- Is fully rewritten in Rust, enabling a [dramatically faster dbt experience](/blog/faster-project-parsing-with-rust). Fusion does not depend on Python at all. In fact, besides the adapter macros, not a single line of code is shared between dbt Core and the dbt Fusion engine. (For long-time dbt spelunkers, we've described the new structure in a [separate post](/blog/dbt-fusion-engine-components).)
- [Understands your SQL code.](/blog/the-levels-of-sql-comprehension) It’s a true SQL *compiler* and gives dbt a full view on what the code in your dbt project means and how it will propagate across your entire data lineage.

Based on the technology from [SDF](https://www.getdbt.com/blog/dbt-labs-acquires-sdf-labs), Fusion represents a step change increase in the technical capabilities of dbt.

<Lightbox src="/img/blog/2025-05-28-dbt-fusion-engine/familiar-authoring-powerful-new-engine.png" title="Familiar Authoring Layer, Powerful New Engine." />

As a result of these capabilities, Fusion can deliver new experiences. Some of these we’re releasing today, like real-time error detection in VS Code and significant cost savings in project execution.  dbt now knows about your code!

**You probably now know enough now to head on over to the quickstart and get going**, but if you want to know little more about what Fusion delivers today, keep reading.

---

## Near-term benefits of adopting Fusion

You can think of Fusion as the same dbt you know and love, but better and faster, and you're going to see it show up in a lot of places!

<Lightbox src="/img/blog/2025-05-28-dbt-fusion-engine/next-gen-star.png" title="Functionality powered by the dbt Fusion Engine and its components" />

So how and why should you adopt Fusion for your dbt project?

### Just the new Fusion-powered dbt CLI

- **Significant performance improvements:** Up to 30x faster parsing and 2x quicker full-project compilation, with near-instant recompilation of single files in the VS Code Extension. We expect continued performance gains as part of the path to GA.

### The new Fusion-powered dbt Fusion CLI + VS Code extension

But the real benefit of Fusion is not just going to be in the CLI itself — it’s in the ability to build net new product experiences that leverage Fusion’s capabilities. The first of these, unveiled today, is the VS Code extension, powered by [dbt Fusion’s SQL Comprehension](/blog/the-levels-of-sql-comprehension). This extension could *only* be built on Fusion:

- It’s fast — the VS Code extension recompiles your entire dbt project in the background every time you save *any* file, as well as identifying errors instantly for the active file. For that to be workable, it needs to happen fast.
- It understand SQL and functions as a compiler — it knows what columns exist in your project, what functions you are using and the type signature and output of those functions.

There’s a whole host of features in the VS Code extension. Some early favorites:

- **Write code with confidence — live error detection and function autocomplete.**
  - How many time have you hit `dbt run` only to realize that you typed `select * frmo`, misspelled a column name or tried to sum the unsummable? No more! With the LSP-powered VS Code extension, you can immediately see when pesky errors sneak into your code.

    <Lightbox src="/img/blog/2025-05-28-dbt-fusion-engine/you-wouldnt-sum-a-datetime.png" title="You wouldn't sum a datetime." />

  - Similarly — is it `dateadd` or `date_add`? And which way around do the arguments go again? Just start typing and you'll see contextual prompts and autocomplete.
- **See how the code you’ve written iteratively progresses to your transformed data:** *Preview CTEs and viewing compiled code*
  - Because the VS Code extension compiles your code every time you save, you can view the compiled code from your project in real time as you’re making edits. This is a real lifesaver when working on complex macros.
  - Writing your code with CTEs allows you to modularly split up the logic in your model. The days when you swap out the `final` CTE at the end for the name of the CTE you're debugging are no more, now you can just click.

- **Traverse your project:** Go-to-reference and built in lineage
  - Need to find out how an upstream model was defined? Or where all the inputs from the model you’re working on came from? With both the ability to jump to the model and column references *and* view model and column level lineage, it’s honestly a night and day difference.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/go-to-definition.webm" type="video/webm" />
</video>


I could go on and on and on — there’s so much here.

Taken separately, these range from quality of life improvements to significant changes.

But taken together, it actually fundamentally changes the experience of writing your dbt code. There were just *so many things* that you had to constantly be juggling in the back of your head that are now offloaded to the extension. The sum change to the experience of writing dbt code... is exceptional. I already can’t imagine working without this.

Of course — there’s another technology changing the experience of writing dbt (and all) code — AI. The functionality that Fusion enables dovetails perfectly with AI-assisted coding by allowing you to vet, validate, and comprehend AI-generated code more easily. Moving forward, expect even tighter coupling between Fusion and AI-based coding assistants as the speed and rigor of Fusion will help produce higher quality AI-generated code.

The VS Code extension is one of our first product experiences exclusively powered by the dbt Fusion engine. The extension depends on the Language Server, and the Language Server depends on Fusion's SQL comprehension capabilities. We made the decision not to support dbt Core for the VS Code Extension because existing community-built extensions have already built as much as is possible on top of dbt Core's foundation.  To get to this next level of experience, we needed Fusion.

---

### How to get started with Fusion

The dbt Fusion engine is currently in beta. We've written [a separate post](/blog/dbt-fusion-engine-path-to-ga) describing the path to Fusion's final release, and how you can see if your project is compatible today.

Whether or not you can move your existing project to Fusion today, you can jump into the VS Code extension [using our quickstart](/guides/fusion) to try get a feeling for what's ahead.

- **dbt customers:** Over the coming weeks, in projects eligible to start using Fusion, you’ll see a toggle in your account or receive a message from your account team. From there, [you can activate Fusion for your environments](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine).
- **To use the VS Code extension:** [Install the "dbt" extension](/docs/install-dbt-extension) directly from the marketplace for automated setup and head to the quickstart. This will also automatically install the Fusion-powered CLI for you.
- **To use the dbt CLI powered by Fusion:** Simply [install Fusion](/docs/fusion/install-fusion#install-fusion)

*If you are looking to migrate an existing project to Fusion, see the [migration guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) — as well as the [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) helper, which automatically addresses many of the changes needed to migrate to Fusion.*

---

## What's Next?

Today’s launch is the start. There is much left to do over the short term and long term.

Moving forward we’re building many net new products and evolutions of our current products that simply wouldn’t have been possible in a pre-Fusion world. This will be particularly impactful for powering AI workflows, both to assist in the creation of high quality dbt projects and serving as the trusted interface to structured data for AI agents.

We’re excited to work with the Community on the evolution of Fusion. If you’ve heard talk about the early days of the dbt Community and wished you could have been around for it, you now have the opportunity to make the deep, foundational impact that is often only possible at the start of a new technical innovation cycle.

So get involved!

- Try out [the Fusion quickstart](/guides/fusion)
- [Open up a GitHub issue in `dbt-fusion`](https://github.com/dbt-labs/dbt-fusion/issues) to report a bug or participate in the path to GA
- Join us [on Slack](https://www.getdbt.com/community/join-the-community) in #dbt-fusion-engine and share your thoughts or questions
- Head to an [in-person dbt Meetup](https://www.meetup.com/pro/dbt/) — we’re hosting the dbt World Circuit 🏎️ around the world where you can and come talk to one of us about Fusion!
