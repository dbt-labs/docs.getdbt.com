---
title: "Deployment platform capabilities (catalog)"
sidebar_label: "Platform capabilities catalog"
description: "Draft machine-readable catalog of regions, PrivateLink posture, lifecycle, and warehouse connection authentication — synced from dbt-cloud-platform-validator-metadata."
id: "deployment-platform-capabilities-catalog"
---

import PlatformCapabilitiesFromCatalog from '/snippets/_platform-capabilities-from-catalog.md';

This page is generated when the docs site builds: it pulls [`platform_capabilities.yml`](https://github.com/dbt-labs/dbt-cloud-platform-validator-metadata/blob/main/platform_capabilities.yml) from the **[dbt-cloud-platform-validator-metadata](https://github.com/dbt-labs/dbt-cloud-platform-validator-metadata)** repo and renders Markdown tables. Override the URL with **`PLATFORM_CAPABILITIES_YAML_URL`** in CI if the canonical org or branch changes.

See **Feature requests** on the [Deployment configuration validator](/docs/deploy/deployment-configuration-validator) docs page (and the app README) to propose missing regions or connectivity — tie requests to Salesforce opportunity and ARR where possible.

<PlatformCapabilitiesFromCatalog />
