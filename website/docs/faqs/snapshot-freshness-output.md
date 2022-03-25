---
title: Are the results of freshness stored anywhere?
---
Yes!

The `snapshot-freshness` command will output a pass/warning/error status for each <Term id="table" /> selected in the freshness snapshot.

Additionally, dbt will write the freshness results to a file in the `target/` directory called `sources.json` by default. You can also override this destination, use the `-o` flag to the `snapshot-freshness` command.
