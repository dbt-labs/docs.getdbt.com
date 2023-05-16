---
title: "Contribute to adapters"
id: "contribute-core-adapters"
---

test test


<Tabs>

<TabItem value="preexisting" label="Contribute to a pre-existing adapter">

Community-supported plugins are works in progress, and anyone is welcome to contribute by testing and writing code. If you're interested in contributing:

- Join both the dedicated channel, [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM), in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store (see **Slack Channel** column of above tables)
- Check out the open issues in the plugin's source repository (follow relevant link in **Adapter Repository** column of above tables)

</TabItem>

<TabItem value="newadapter" label="Create a new adapter">

If you see something missing from the lists above, and you're interested in developing an integration, read more about adapters and how they're developed in the  [Adapter Development](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters) section.

If you have a new adapter, please add it to this list using a pull request! See [Documenting your adapter](5-documenting-a-new-adapter) for more information.

</TabItem>
</Tabs>

[^1]: Here are the two different adapters. Use the PyPI package name when installing with `pip`

    | Adapter repo name | PyPI package name    |
    | ----------------- | -------------------- |
    | `dbt-athena`      | `dbt-athena-adapter` |
    | `dbt-layer`       | `dbt-layer-bigquery` |
