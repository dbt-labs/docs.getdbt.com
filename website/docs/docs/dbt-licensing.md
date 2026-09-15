---
title: "dbt licensing"
id: "dbt-licensing"
description: "Learn about dbt v1 and dbt v2 licensing."
pagination_next: null
pagination_prev: null
---

<VersionBlock firstVersion="2.0">

dbt v2 has the following distributions today, all free to install and run.

<SimpleTable>

| Distribution | Package | Use it when |
| --- | --- | --- |
| <Constant name="fusion" /> | `dbt` | The recommended v2 experience. |
| dbt OSS | `dbt-core` | Your organization has a strict requirement to use the Apache 2.0 open-source runtime |

</SimpleTable>

If you have a older project that isn’t ready to move to v2, continue using v1.x for compatibility. For new or upgraded projects, we recommend [upgrading to v2](/docs/dbt-versions/upgrade-dbt-platform-version?version=2.0#dbt-v2).

## Which one should I use?

For most people: <Constant name="fusion" />. It has more [capabilities](/docs/dbt/dbt-availability?version=2.0#what-you-get-with-v2) out of the box than the open source v2 &mdash; including a built-in high-performance SQL linter &mdash; even if you never create a dbt account.

We recommend everyone to just [install dbt](/docs/local/install-dbt) and get <Constant name="fusion" /> by default.

Typically you'd choose the open source installtion directly only if you're in one of two specific situations: 
1. Your organization's license policy requires a strict open-source distribution
2. You're building something custom on top of the OSS code itself. 

Already running <Constant name="core_v1" />? You don't have to move to v2 &mdash; it's still fully supported. Over time, new capabilities will land in v2 only, so most people will eventually want to [upgrade](/docs/dbt-versions/upgrade-dbt-platform-version?version=2.0#dbt-v2).

To check which distribution you're using, run `dbt --version` in the command line.

## What changed, and what didn't

**Changed:**
- v2 is available through two distributions: <Constant name="fusion" /> and dbt OSS.
- dbt OSS, the Apache 2.0 open-source distribution for v2, is powered by the shared Rust engine code and is now available in `dbt-core`.
- dbt v2 builds on dbt OSS and extends it with additional proprietary capabilities under the dbt Product Licensing Agreement.

**Unchanged:**
- <Constant name="core_v1" /> is still fully available and still Apache 2.0.
- <Constant name="fusion" /> is still completely free to use, with some features unlocked by a free login or a paid dbt platform account &mdash; not required for any distribution.
- Contributing to dbt is still open to everyone.


</VersionBlock>

<VersionBlock lastVersion="1.99">

dbt v1 is released under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0). It's fully supported and free to install and run.

Typically, you'd use <Constant name="core_v1" /> if you're managing older projects and aren't yet ready to [upgrade to v2](/docs/dbt-versions/upgrade-dbt-platform-version?version=2.0#dbt-v2).

### What's v2?

dbt v2 introduces a shared Rust runtime available through two free distributions: the Apache 2.0 open-source distribution, and <Constant name="fusion" />, which builds on the open source offering with more capabilities out of the box. Over time, new capabilities will land in v2 only, so most people will eventually want to upgrade when possible.

When you're ready to upgrade to v2, check out the [Upgrade to v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2) for guidance.

</VersionBlock>

## Licensing details

[<Constant name="core" />](https://github.com/dbt-labs/dbt) is released under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0). <Constant name="fusion" /> is proprietary to dbt Labs, made available under the [dbt Product Licensing Agreement](https://www.getdbt.com/dbt-fusion-engine-license-agreement).

For the full breakdown of what's permitted under each license &mdash; source visibility, contributions, modifications, self-hosting, and redistribution &mdash; see the [dbt Licensing FAQ](https://www.getdbt.com/licenses-faq).

<Constant name="dbt_platform" /> is a separate hosted product governed by its own [terms of service](https://www.getdbt.com/terms-of-use). Also not to be confused with <Constant name="dbt_platform"/> [licenses](/docs/platform/manage-access/seats-and-users). 

