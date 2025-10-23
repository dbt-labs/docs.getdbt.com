---
title: "Caching and the dbt Fusion engine"
id: "about-fusion-caching"
sidebar_label: "About Fusion Caching"
description: "Caching is a big source of Fusion's improved Developer Experience."
pagination_next: null
pagination_prev: null
---

# Caching and the dbt Fusion engine

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

<IntroText>

Caching is large part of how <Constant name="fusion_engine" /> delivers a vastly impoved developer experience. The goal for Fusion is to enable analytics engineers to meaningful feedback as fast as possible.

## Kinds of Caching

### Source Schema Cache

In order to perform offline [static analysis](new-concepts) of your project, the first thing that's required is