---
title: "Fusion availability"
id: "fusion-availability"
description: "Learn where the dbt Fusion engine is available."
hide_table_of_contents: true
---

import FusionAvailability from '/snippets/_fusion_availability.md';

<FusionAvailability/>

- Like <Constant name="core" />, you can install <Constant name="fusion" /> locally from the [CLI](/docs/fusion/install-fusion-cli) to power local workflows. For ergonomic and LSP-based intelligent development (powered by <Constant name="fusion" />), [install the VS Code extension](/docs/fusion/install-dbt-extension).
-  <Constant name="fusion"/> in the <Constant name="dbt_platform" /> is available in private preview. To use <Constant name="fusion" /> in the <Constant name="dbt_platform" />, contact your account team for access and then [upgrade environments to the <Constant name="fusion_engine" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine) to power your projects.
   - If your account isn't on the <Constant name="fusion_engine" />, you use the <Constant name="dbt_platform"/> with the traditional Python-based <Constant name="core" /> engine. However, it doesn't come with the <Constant name="fusion" /> [features](/docs/fusion/supported-features#features-and-capabilities), such as 30x faster compilation/parsing, autocomplete, hover info, inline error highlights, and more. To use <Constant name="fusion" />, contact your account team for access.
