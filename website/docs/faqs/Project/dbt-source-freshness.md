---
title: Are the results of freshness stored anywhere?
description: "How to access Source Freshness results"
sidebar_label: 'Accessing Source Freshness results'
id: dbt-source-freshness

---
Yes!

The `dbt source freshness` command will output a pass/warning/error status for each <Term id="table" /> selected in the freshness snapshot.

Additionally, dbt will write the freshness results to a file in the `target/` directory called `sources.json` by default. You can also override this destination, use the `-o` flag to the `dbt source freshness` command.

Lastly, after enabling source freshness within a job, configure [Artifacts](docs/dbt-cloud/using-dbt-cloud/artifacts) in your account settings to enable 'Data Sources' to appear as a new dropdown in the hamburger menu, where you can see current status for source freshness.
