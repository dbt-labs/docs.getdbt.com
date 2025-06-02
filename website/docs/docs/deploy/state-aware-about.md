---
title: "About state-aware orchestration"
description: "Learn about how state-aware orchestration automatically determines which models to build by detecting changes in code or data every time a job runs." 
id: "state-aware-about"
tags: ['scheduler','SAO']
---

# About state-aware orchestration <Lifecycle status="beta,managed,managed_plus" />

<IntroText>

Every time a job runs, state-aware orchestration automatically determines which models to build by detecting changes in code or data.

</IntroText>

import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

State-aware orchestration saves you compute costs and reduces runtime because when a job runs, it checks for new records and only builds the models that will change.

<Lightbox src="/img/docs/deploy/sao.gif" title="Fusion powered state-aware orchestration" />

We built <Constant name="cloud" />'s state-aware orchestration on these four core principles:

- **Real-time shared state:** All jobs write to a real-time shared model-level state, allowing <Constant name="cloud" /> to rebuild only changed models regardless of which jobs the model is built in.
- **Model-level queueing:** Jobs queue up at the model-level so you can avoid any 'collisions' and prevent rebuilding models that were just updated by another job.
- **State-aware and state agnostic support:** You can build jobs dynamically (state-aware) or explicitly (state-agnostic). Both approaches update shared state so everything is kept in sync.
- **Sensible defaults:** State-aware orchestration works out-of-the-box (natively), with an optional configuration setting for more advanced controls. For more information, refer to [state-aware advanced configurations](/docs/deploy/state-aware-setup#advanced-configurations).

## Optimizing builds with state-aware orchestration

State-aware orchestration uses shared state tracking to determine which models need to be built by detecting changes in code or data every time a job runs. It also supports custom refresh intervals and custom source freshness configurations, so <Constant name="cloud" /> only rebuilds models when they're actually needed.

For example, you can configure your project so that <Constant name="cloud" /> skips rebuilding the dim_wizards model (and its parents) if they’ve already been refreshed within the last 4 hours, even if the job itself runs more frequently.

Without configuring anything, <Constant name="cloud" />'s state-aware orchestration automatically knows to build your models either when the code has changed or if there’s any new data in a source (or upstream model in the case of [dbt Mesh](/docs/mesh/about-mesh)).

## Related docs

- [State-aware orchestration configuration](/docs/deploy/state-aware-setup)
- [Artifacts](/docs/deploy/artifacts)
- [Continuous integration (CI) jobs](/docs/deploy/ci-jobs)
- [`freshness`](/reference/resource-configs/freshness)
