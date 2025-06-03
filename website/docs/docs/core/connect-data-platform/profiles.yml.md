---
title: "About profiles.yml"
description: "The dbt profiles.yml file contains the connection details for your data warehouse."
id: profiles.yml
---

If you're using [dbt Core](/docs/core/installation-overview), you'll need a `profiles.yml` file that contains the connection details for your data platform. When you run dbt Core from the command line, it reads your `dbt_project.yml` file to find the `profile` name, and then looks for a profile with the same name in your `profiles.yml` file. This profile contains all the information dbt needs to connect to your data platform.

For detailed info, you can refer to the [Connection profiles](/docs/core/connect-data-platform/connection-profiles).

:::tip No `profiles.yml` file needed for <Constant name="cloud" />
If you're using <Constant name="cloud" />, you can [connect to your data platform](/docs/cloud/connect-data-platform/about-connections) directly in the <Constant name="cloud" /> interface and don't need a `profiles.yml` file.
:::

This section identifies the parts of your `profiles.yml` that aren't specific to a particular data platform. For specific connection details, refer to the relevant page for your data platform.

To add an additional target (like `prod`) to your existing `profiles.yml`, you can add another entry under the `outputs` key.

<VersionBlock firstVersion="1.8">

<File name='profiles.yml'>

```yml

<profile-name>:
  target: <target-name> # this is the default target
  outputs:
    <target-name>:
      type: <bigquery | postgres | redshift | snowflake | other>
      schema: <schema_identifier>
      threads: <natural_number>

      ### database-specific connection details
      ...

    <target-name>: # additional targets
      ...

<profile-name>: # additional profiles
  ...

```

</File>

</VersionBlock>

## User config

You can set default values of global configs for all projects that you run using your local machine. Refer to [About global configs](/reference/global-configs/about-global-configs) for details.
