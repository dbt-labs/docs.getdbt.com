---
title: "Latest dbt: a stable foundation for improvement & innovation"
description: "Over the past 6 months, we've laid a stable foundation for continuously improving dbt."
slug: latest-dbt-stability

authors: [michelle_ark, chenyu_li, colin_rogers]

tags: [dbt Cloud]
hide_table_of_contents: false

date: 2024-05-02
is_featured: true
---

As long as it's existed, dbt Cloud has required users to select a version of dbt Core to use under the hood in their jobs and environments. This made sense in the earliest days, when dbt Core minor versions often included breaking changes. It provided a clear way for everyone to know which version of the underlying runtime they were getting.

However, this came at a cost. While bumping a project's dbt version *appeared* as simple as selecting from a dropdown, there was real effort required to test the compatibility of the new version against existing projects, package dependencies, and adapters. On the other hand, putting this off meant foregoing access to new features and bug fixes in dbt.

But no more. Today, we're ready to announce the general availability of a new option in dbt Cloud: **"Keep on latest version."** 

For customers, this means less maintenance overhead, faster access to bug fixes and features, and more time to focus on what matters most: building trusted data products. This will be our stable foundation for improvement and innovation in dbt Cloud. 

But we wanted to go a step beyond just making this option available to you. In this blog post, we aim to shed a little light on the extensive work we've done to ensure that using "Keep on latest version" is a stable, reliable experience for the thousands of customers who rely daily on dbt Cloud. 

## How we safely deploy dbt upgrades to Cloud

We've put in place a rigorous, best-in-class suite of tests and control mechanisms to ensure that all changes to dbt under the hood are fully vetted before they're deployed to customers of dbt Cloud.

This pipeline has in fact been in place since January! It's how we've already been rolling out patch releases for existing dbt Core versions to dbt Cloud customers, and shipping continuous changes to the hundreds of customers who've selected "Keep on latest version" while it's been in Beta and Preview. In that time, this process has enabled us to prevent multiple regressions before they were rolled out to any customers.

We're very confident in the robustness of this process**. We also know that we'll need to continue building trust with time.** We're sharing details about this work in the spirit of transparency and to build that trust.

Any new change to dbt-core and adapters goes through the following steps before it's available to customers in dbt Cloud:

<Lightbox src="/img/blog/2024-05-22-latest-dbt/testing-deploy-pipeline.png" title="Testing and deploy pipeline" />

### **Step 1: Unit & functional tests in dbt Core + adapters**

First up is a battery of thousands of tests that we run dozens of times per day. No change, in either dbt-core or in the [data platform adapters](https://docs.getdbt.com/docs/trusted-adapters) supported by dbt Cloud, is merged until it has passed this full suite of tests. 

Here, *unit tests* test internal components in isolation from one another, and *functional tests* represent edge cases in expected behavior under known conditions.

For adapters, tests also ensure that the full matrix of data platform features continue to work as expected: BigQuery partitioning + incremental strategies, Snowflake data types + model contracts, Redshift sort keys — so on and so forth.

### Step 2: P**re-deploy smoke tests**

Next, we create a Docker image with the latest dbt changes installed alongside each adapter supported in dbt Cloud. We run an additional suite of end-to-end tests on this image across the matrix of supported adapters, across a sample of projects and packages representing real-world complexity, through several dbt workflows. In doing so, this phase of testing also ensures that the latest version of dbt does not break compatibility with frequently relied-upon dbt packages. 

This breadth of testing provides early detection of any regressions that might have been introduced by our changes to dbt-core, changes by adapter maintainers, or any of their dependencies and drivers — using the exact installed versions that would be deployed to dbt Cloud. Crucially, this helps safeguard us from breaking changes in third-party software. 

### Step 3: **dbt Cloud service tests**

Before the new image version goes live, we ensure that all dbt changes are cross-compatible with every dbt Cloud service that depends on Core functionality, including areas such as the Cloud IDE, the Cloud CLI, scheduled job runs, CI, and connection testing. 

For each dbt Cloud service, we run a testing suite that consists of:

- Unit and integration specific tests to behavior of each dbt Cloud service
- End-to-end headless browser testing for our UI-heavier applications
- Compatibility for each adapter with that service

This step provides further depth in testing the interplay between dbt Core and dbt Cloud application-specific functionality, covering cases such as linting SQL that has an ephemeral reference, or resolving [cross-project refs](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref) across multi-project "dbt Mesh" deployments.

### Step 4: **Canary deployment**

Once *all* the aforementioned tests have passed, we roll out the latest deployment to a small subset (5%) of accounts, including our own Internal Analytics project.

These "canary" deployments are continually monitored against a set of precise observability metrics. Metrics we monitor include overall job error and cancellation rates to ensure they don't deviate from our expectations relative to a stable baseline. Any anomaly immediately alerts us, and we can shut off the canary in a matter of seconds, before any additional accounts are affected.

### Step 5: Phased **rollout**

Once the canary deployment has been proven to run stably for at least 24 hours, we mark it as eligible for all accounts to upgrade in their next scheduled deployment of dbt Cloud.

<aside>
ℹ️ Even with a robust testing, deployment, and monitoring system in place, it will never be *impossible* for a breaking change to make it through — just as in any other SaaS application.

If this does happen, we commit to identifying and rolling back any breaking changes as quickly as possible. Under the new testing and deployment model in dbt Cloud, we have consistently demonstrated to have been able roll back changes in less than an hour and ship roll forward bug fixes in less than 4 hours.

All incidents are retrospected to make sure we not only identify and fix the root cause(s), but also promptly put in place testing, automation, and quality gates to ensure that the same problem never happens again.

</aside>

The outcome of this process is that, when you select "Keep on latest version" in dbt Cloud, the time between an improvement or fix being made to dbt Core and you *safely* getting access to it in your projects is a matter of days — rather than months of waiting for the next dbt Core release, on top of any additional time it may have taken to actually carry out the upgrade.

We're pleased to say that since the beta launch of "Keep on latest version" in dbt Cloud, **we have not had any functional regressions reach customers**, while we've also been shipping 5-10 improvements to core dbt functionality every day. This is a foundation that we aim to build on for the foreseeable future.

## Stability as a feature

A rigorous testing pipeline in dbt Cloud is crucial, but real ongoing stability required some deeper changes in the dbt framework. We take our responsibility as the maintainers of dbt Core seriously, as well the open-source ecosystem around it.

We've ******taken a longer release cycle for the upcoming 1.8 release of dbt Core to revisit some of the "do later" design choices we made in the past — specifically around adapter compatibility, behavior change management, and metadata artifacts.

### **Decoupling the adapter interface**

The adapter interface — i.e. how dbt Core actually connects to a third-party data platform — has historically been somewhat of a pain point. Adapter maintainers have often been *required to make* reactive changes when there's been an update to dbt Core.

To solve that, we've released a new set of interfaces that are entirely independent of the `dbt-core` library: [`dbt-adapters==1.0.0`](https://github.com/dbt-labs/dbt-adapters). From now on, any changes to `dbt-adapters` will be backward and forward-compatible. This also decouples adapter maintenance from the regular release cadence of `dbt-core`  — meaning maintainers get full control over when they ship implementations of new adapter-powered features.

Note that adapters running in dbt Cloud **must** be [migrated to the new decoupled architecture](https://github.com/dbt-labs/dbt-adapters/discussions/87) as a baseline in order to support the new "Keep on latest version".

### **Managing behavior changes: stability as a feature**

We all want the benefits of a stable, actively maintained product. Occasionally the dbt Labs team identifies a change to default behavior that we believe is more sensible, more secure, more helpful — just better in some way — but which would come as a change to users who have grown accustomed to the existing behavior.

To accommodate both groups in these scenarios, we've extended dbt to support project-level behavior flags. These can be used to *opt into* or *opt out of* changes to default behavior. From now on, backward-incompatible changes to dbt functionality will be implemented behind a flag with a default value that preserves the legacy behavior. After a few months, the new behavior will become the default — but only after some proactive communication with customers and external package maintainers.

The same behaviour change flags will naturally extend to dbt packages, which are fundamentally just dbt projects. This allows package maintainers to ensure that behaviour doesn't change unexpectedly as a result of changes to dbt Core. For more details, check out our user documentation on [legacy behaviours](https://docs.getdbt.com/reference/global-configs/legacy-behaviors#behaviors), as well as our [contributor documentation](https://github.com/dbt-labs/dbt-core/blob/main/docs/eli64/behavior-change-flags.md) for introducing behaviour changes safely.

**Stability for metadata artifacts**

Lastly, we've revisited our [artifact interfaces](https://docs.getdbt.com/reference/artifacts/dbt-artifacts) — which are the workhorses of many integrations in the dbt ecosystem, whether maintained by dbt Labs, third-party tools and vendors, or are custom to a particular organization. While these schemas have adhered to a well-defined and versioned since dbt-core 1.0, they have historically seen major changes on almost every minor release of dbt-core. We've [formalized our development best practices](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/artifacts/README.md#making-changes-to-dbtartifacts) on strongly preferring minor schema evolutions over major breaking changes, and put [automated CI in place](https://github.com/dbt-labs/dbt-core/blob/main/.github/workflows/check-artifact-changes.yml) to ensure we are not unintentionally introducing breaking changes to artifacts to avoid disruption to artifact-based integrations across the OSS ecosystem.

---

In conclusion, we're putting new muscle behind our commitments to the community & ecosystem:

- Compatibility for adapters, maintained by us and by others
- Predictable behaviour changes for maintainers of project and package code
- Rigorous tests in CI/CD against documented interfaces, first-party adapters, metadata artifacts, and popular third-party packages

All of this stands behind our commitment to customers of dbt Cloud — we'll keep you on the latest version, ensuring quality and stability, so you can focus on what matters.
