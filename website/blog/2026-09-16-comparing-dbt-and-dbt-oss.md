---
title: "What's the difference between dbt and dbt OSS?"
description: "The free distribution of dbt v2 is our default recommendation over dbt OSS: it has more capabilities, and its license permits the same real-world use cases for free, without ever paying or talking to dbt Labs."
slug: comparing-dbt-and-dbt-oss

authors: [joel_labes]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2026-09-16
is_featured: true
---

As part of [releasing dbt v2 to general availability](/blog/dbt-v2-is-ga), we've renamed the two distributions to reflect their positions in the ecosystem. The **dbt Fusion engine is now just called dbt**, and **dbt Core v2 is now called dbt OSS**. We expect that most people adopting dbt v2 will adopt the primary dbt distribution, which is free to use and locally installable.

The name changes do not change our commitment to open source: there is and always will be a completely open source implementation of the dbt standard. All of the code we released to Apache 2.0 from ELv2 or proprietary licenses [in June](/blog/dbt-core-v2-is-here#putting-all-our-efforts-behind-a-single-engine) stays the same, and moving to a shared foundation (instead of having dbt Core remain on the legacy Python engine) makes the open source version of dbt stronger.

The change to two freely usable distributions with a shared foundation is the biggest point of confusion we've seen during the v2 beta. This post will help explain the differences between dbt and dbt OSS, and provide guidance on which distribution you should choose.

<!-- truncate -->

:::note TL;DR
The free distribution of dbt v2 (fka Fusion) is our default recommendation over dbt OSS. It has more capabilities and its license is designed to permit the same real-world use cases for free without ever paying or talking to dbt Labs.
:::

## The two distributions at a glance

- Remember how I've been [saying](/blog/dbt-core-v2-is-here#better-defining-dbt-cores-role-in-the-ecosystem) that the only unique characteristic of dbt Core v2 is that it's Apache-licensed open source? We're making that explicit by swapping the **dbt Core v2** name for **dbt OSS**.
    - For existing beta users of dbt Core v2, this is purely a rebrand; there are no changes to what code is publicly available, or what you can do with it.
    - For existing users of dbt Core v1, our guidance stays the same as [earlier this year](/blog/dbt-core-v2-is-here#better-defining-dbt-cores-role-in-the-ecosystem): upgrade to the full version of dbt for the best free and local experience, use dbt OSS if you need an Apache 2 binary.
- Meanwhile, the **dbt Fusion engine** is now called **dbt**. It's the default version of dbt that basically everyone should use, so it gets the default name.
    - This is also purely a rebrand; there are no changes to the licensing terms we announced earlier this year. As an end user, you can install and use it for free.

Both distributions share the same language spec; you can move between them without modifying any of your critical business logic.

## The rise of local CLIs

Local CLIs are having a moment. Agents love the structured input and output and tight iteration loops they enable. As I've said [before](/blog/dbt-core-v2-is-here?version=2#better-defining-dbt-cores-role-in-the-ecosystem), an exciting part of the move from Python to Rust is that the best free version of dbt can now be a totally local experience.

Historically, it's been common to use "dbt Core" as a shorthand for any of "the free version of dbt," "the local version of dbt," or "the open source version of dbt." In the v2 era, only one of those remains a unique differentiator, and we think that the dbt OSS name will better explain each distribution's purpose.

|  | dbt OSS | dbt |
| --- | --- | --- |
| Free to use | ✅ | ✅ |
| Usable locally | ✅ | ✅ |
| Standard framework features for free (parity or beyond dbt 1.x) | ✅ | ✅ |
| Supports optional usage-based paid features (e.g. dbt State, dbt Wizard) | ✅ | ✅ |
| Continues to receive feature updates and improvements | ✅ | ✅ |
| Shared codebase foundation | ✅ | ✅ |
| Advanced local features for free (e.g. SQL comprehension, linting, dbt LSP support) | ❌ | ✅ |
| Supports optional seat-based paid features (e.g. dbt Mesh, dbt Catalog) | ❌ | ✅ |
| 100% Apache 2.0 open source | ✅ | ❌ |

In my opinion, the false dichotomy of "Core vs Cloud" is a consequence of dbt's historic implementation details. There have always been capabilities that weren't implemented in the public dbt-core repository, but because you interacted with them through the dbt platform instead of a local CLI[^1] they _felt like_ cloud features, not dbt features per se.

If you've heard us talking about [One dbt](https://roundup.getdbt.com/p/one-dbt), this should feel like a breath of fresh air. Wherever and however your teams work with dbt, you can deploy a single binary across your entire organization. You can adopt additional free or paid features on your own schedule, without the need to first swap to a different dbt installation or authentication method.

## What do I get if I use the full dbt binary?

Out of the box, `pip install dbt >= 2.0.0` gets you free access to the most fully-featured version of dbt, without any login or payment requirements.

If you do choose to pay for commercial features, it gets even better. Accessing these extra features doesn't require you to install a different product[^2] or change how you authenticate - it's completely seamless.

Regardless of which distribution you use:

- Your dbt project shares a common language: when you run `dbt build` you'll get the same results.
- You can still contribute improvements and fixes to the [dbt repo](https://github.com/dbt-labs/dbt) and they'll propagate to both distributions.

## What do I get if I use dbt OSS?

If dbt OSS (the version built solely with Apache-licensed code) was the only distribution of dbt v2, it'd be a solid upgrade compared to dbt Core 1.12. It includes everything you need to execute your dbt project, and many developer experience improvements like the [new dbt docs site](/docs/build/view-documentation?version=2#dbt-docs-v2), increased speed, and the [dbt Information Schema](/docs/build/dbt-information-schema). Of course it also includes new language features like [checks](https://github.com/dbt-labs/dbt-core/discussions/15584).

But since it's _not_ the only distribution of dbt v2, and the fully featured distribution can also be used locally for free, you should only install dbt OSS if you specifically know your company requires Apache 2.0 licensed software for specific situations, or if you're going to write custom code to change how dbt works.

Even then, you should check whether it's possible to develop with dbt and only install dbt OSS into your deployment environments. Both distributions can read the same project files, so it's easy to hand off between the two.

## I'm using an oldish version of dbt Core. What should I do?

You should plan to move to dbt v2 (or dbt OSS v2) over time. We will continue to release patches for security and compatibility for years to come, but dbt Core 1.13 will be the final minor release to add meaningful functionality to the Python codebase.

Before switching over to either v2 distribution, you should move up to dbt Core 1.12 (or any release track in the dbt platform). It lets you test your project against the v2 parser (using the new `--use-v2-parser` flag), so that you can make any fixes to your project without interrupting production workflows.

To streamline your upgrade process, use the [`dbt-autofix` package](https://github.com/dbt-labs/dbt-autofix) and our [agent skills for project migration](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt-migration/skills).

At time of publishing, some adapters are not yet fully mature, so be sure to [check your adapter's status](/docs/local/connect-data-platform/about-dbt-connections?version=2) on the docs site before planning an upgrade.

## How do I install dbt v2 now?

The [installation guide](/docs/local/install-dbt) contains all the details. For teams using pip today, switch from `pip install dbt-<adapter>` to `pip install dbt` (recommended) or `pip install dbt-oss` depending on the distribution you want.

You no longer need to install adapters separately, as the relevant driver is downloaded on-demand based on the project's target.

If you are deploying dbt into an environment where networking policies prevent driver downloads from our CDN, you can alternatively install an adapter's package directly. For example `pip install dbt-snowflake` will include the full version of dbt _and_ the Snowflake ADBC driver.

For now, `pip install dbt-core` will continue to work (and will install dbt OSS), but we recommend explicitly switching to one distribution or another.

## FAQs

:::note Editor's note
These FAQs are based on the questions we've received about the two v2 distributions during the beta period, before they were renamed. After the renames, some of them become tautological and it feels kinda silly to write them out… but that's the point.
:::

- **Is dbt OSS open source?** Yes, it's Apache 2.0 licensed (OSS stands for Open Source Software).
- **Is dbt OSS the same code that was initially released as dbt Core 2.0?** Yes.
- **What's the difference between dbt and dbt OSS?** They are both free-to-use implementations of v2 of the dbt framework. dbt is the default distribution with the full feature set, and a [license designed to permit broad adoption](https://www.getdbt.com/licenses-faq). dbt OSS is the subset distribution, with only Apache 2 open source code.  The dbt language itself – the SQL and YAML files you write in your project – is the same across both distributions. The difference lies in what each distribution can do with the same input files.
- **What happened to dbt Fusion?** It is now just called dbt.
- **Why does dbt OSS exist if you recommend most people use dbt?** dbt OSS exists as a fallback option for teams who require Apache software in certain situations, and as a protection against vendor lock-in.
- **Should I upgrade to a distribution of dbt v2?** Yes. Over time, we hope everyone will migrate to version 2, just like everyone switched away from version 0 to version 1 in 2021. Today, the main determinant is whether your [adapter is fully supported](/docs/local/connect-data-platform/about-dbt-connections?version=2) for your use case.
- **If I use dbt, do I have to pay dbt Labs anything?** No.
- **If I use dbt, _can_ I pay dbt Labs to get access to cool features?** Yes! If you want to adopt features like cross-project/cross-platform mesh or a richer Catalog experience, the full dbt binary you've already installed will work seamlessly.
- **Who should choose dbt OSS over dbt?** Very few people. If you're building your own data transformation tool, you can fork and extend the dbt OSS codebase. If your company has a policy requiring Apache software, use dbt OSS. For everyone else, we recommend the full dbt distribution.
- **How do I move from dbt 1.x to 2.0?** Use [dbt-autofix](https://github.com/dbt-labs/dbt-autofix) or our [agent skills](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt-migration/skills) to upgrade to dbt Core v1.12. Check your project's compatibility with the `--use-v2-parser` CLI flag, then replace your existing dbt installation with your choice of v2 distribution.
- **Can I use dbt State with dbt OSS and dbt?** Yes, both distributions include support for dbt State, whether you're using the dbt platform or a different orchestrator. You can even use it with dbt Core v1 after [installing a separate plugin](/docs/deploy/dbt-state-setup?type=core-legacy).
- **Can I continue contributing to dbt v2's development if I use the proprietary version?** Yes! Feature requests, bug reports, discussions and PRs relating to both distributions, along with all the Apache-licensed code, live in the [dbt repo on GitHub](https://github.com/dbt-labs/dbt). If you contribute a change to the OSS code, it will be available everywhere.
- **For how long will dbt v1 receive security and compatibility patches?** When it's released, dbt Core 1.13 will be the final minor version of the 1.x vintage. 1.13 will continue to receive [critical support](/docs/dbt-versions#-versioning-1) (security and installation patch releases) beyond the normal 1 year window. We don't have a hard cutoff date defined, but we expect it to be many (3-5) years. We will monitor adoption of version 2 and provide ample notice before a final end-of-life date.

[^1]: except for the few proud Cloud CLI users.
[^2]: lookin' at you, Cloud CLI
