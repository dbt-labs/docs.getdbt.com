---
title: "Enabling dbt State on environments"
sidebar_label: "Enable on environments"
description: "Enable dbt State on deployment environments so jobs can inherit the setting."
id: "dbt-state-enable-environments"
tags: ['dbt State']
availability: everywhere_usage
---

# Enabling dbt State on environments

You can enable [dbt State](/docs/deploy/dbt-state-about) at the environment level, allowing jobs in that environment to inherit the setting automatically. This option is only visible if dbt State is enabled on your account.

When dbt State is enabled on a deployment environment (production, staging, or general):
- New jobs default to **Inherited from environment** and have dbt State enabled without any additional configuration.
- Existing jobs are _not_ updated &mdash; you must configure them manually. Refer to [Enabling dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs) for more information.

To enable dbt State on a deployment environment:

1. Go to **Orchestration** > **Environments**.
2. Select the environment you want to enable dbt State for.
3. Click **Settings** > **Edit**.
3. In the **dbt State** section, select **Enable dbt State**.
5. Click **Save**.

For development environments, refer to [Enabling dbt State in Studio](/docs/deploy/dbt-state-enable-studio) for more information.

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [Enable dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs)
- [Enable dbt State in Studio](/docs/deploy/dbt-state-enable-studio)
