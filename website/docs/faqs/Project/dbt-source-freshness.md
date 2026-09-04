---
title: Are the results of freshness stored anywhere?
description: "How to access Source Freshness results"
sidebar_label: 'Accessing Source Freshness results'
id: dbt-source-freshness

---
Yes!

<VersionBlock firstVersion="2.0">

The [`dbt freshness`](/reference/commands/freshness) command outputs a pass/warning/error status for each source or model selected in the freshness check.

dbt writes the model and source freshness results to `target/freshness.json`. When sources are included, it also writes `target/sources.json` for backward compatibility.

</VersionBlock>

<VersionBlock lastVersion="1.99">

The `dbt source freshness` command will output a pass/warning/error status for each <Term id="table" /> selected in the freshness snapshot.

Additionally, dbt will write the freshness results to a file in the `target/` directory called `sources.json` by default. You can also override this destination, use the `-o` flag to the `dbt source freshness` command.

</VersionBlock>

After enabling source freshness within a job, configure [Artifacts](/docs/deploy/artifacts) in your **Project Details** page, which you can find by selecting your account name on the left side menu in <Constant name="dbt" /> and clicking **Account settings**. You can see the current status for source freshness by clicking **View Sources** in the job page.
