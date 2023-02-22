---
title: Are the results of freshness stored anywhere?
description: "How to access Source Freshness results"
sidebar_label: 'Accessing Source Freshness results'
id: dbt-source-freshness

---
Yes!

The `dbt source freshness` command will output a pass/warning/error status for each <Term id="table" /> selected in the freshness snapshot.

Additionally, dbt will write the freshness results to a file in the `target/` directory called `sources.json` by default. You can also override this destination, use the `-o` flag to the `dbt source freshness` command.

After enabling source freshness within a job, configure [Artifacts](/docs/deploy/artifacts) in your **Project Details** page, which you can find by clicking the gear icon and then selecting **Account settings**. You can see the current status for source freshness by clicking **View Sources** in the job page.
