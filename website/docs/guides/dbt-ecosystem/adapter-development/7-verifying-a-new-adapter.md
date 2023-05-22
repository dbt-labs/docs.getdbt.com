---
title: "Verifying a new adapter"
id: "7-verifying-a-new-adapter"
---

## Why verify an adapter?

The very first data platform dbt supported was Redshift followed quickly by Postgres (([dbt-core#174](https://github.com/dbt-labs/dbt-core/pull/174)). In 2017, back when dbt Labs (née Fishtown Analytics) was still a data consultancy, we added support for Snowflake and BigQuery. We also turned dbt's database support into an adapter framework ([dbt-core#259](https://github.com/dbt-labs/dbt-core/pull/259/)), and a plugin system a few years later. For years, dbt Labs specialized in those four data platforms and became experts in them. However, the surface area of all possible databases, their respective nuances, and keeping them up-to-date and bug-free is a Herculean and/or Sisyphean task that couldn't be done by a single person or even a single team! Enter the dbt community which enables dbt Core to work on more than 30 different databases (32 as of Sep '22)!

Free and open-source tools for the data professional are increasingly abundant. This is by-and-large a *good thing*, however it requires due dilligence that wasn't required in a paid-license, closed-source software world. Before taking a dependency on an open-source projet is is important to determine the answer to the following questions:

1. Does it work?
2. Does it meet my team's specific use case?
3. Does anyone "own" the code, or is anyone liable for ensuring it works?
4. Do bugs get fixed quickly?
5. Does it stay up-to-date with new Core features?
6. Is the usage substantial enough to self-sustain?
7. What risks do I take on by taking a dependency on this library?

These are valid, important questions to answer—especially given that `dbt-core` itself only put out its first stable release (major version v1.0) in December 2021! Indeed, up until now, the majority of new user questions in database-specific channels are some form of:
- "How mature is `dbt-<ADAPTER>`? Any gotchas I should be aware of before I start exploring?"
- "has anyone here used `dbt-<ADAPTER>` for production models?"
- "I've been playing with  `dbt-<ADAPTER>` -- I was able to install and run my initial experiments. I noticed that there are certain features mentioned on the documentation that are marked as 'not ok' or 'not tested'. What are the risks?
I'd love to make a statement on my team to adopt DBT [sic], but I'm pretty sure questions will be asked around the possible limitations of the adapter or if there are other companies out there using dbt [sic] with Oracle DB in production, etc."

There has been a tendency to trust the dbt Labs-maintained adapters over community- and vendor-supported adapters, but repo ownership is only one among many indicators of software quality. We aim to help our users feel well-informed as to the caliber of an adapter with a new program.

## Verified by dbt Labs

The adapter verification program aims to quickly indicate to users which adapters can be trusted to use in production. Previously, doing so was uncharted territory for new users and complicated making the business case to their leadership team. We plan to give quality assurances by:
1. appointing a key stakeholder for the adapter repository,
2. ensuring that the chosen stakeholder fixes bugs and cuts new releases in a timely manner see maintainer your adapter (["Maintaining your new adapter"](2-prerequisites-for-a-new-adapter#maintaining-your-new-adapter)),
3. demonstrating that it passes our adapter pytest suite tests,
4. assuring that it works for us internally and ideally an existing team using the adapter in production .


Every major & minor version of a adapter will be verified internally and given an official :white_check_mark: (custom emoji coming soon), on the ["Supported Data Platforms"](/docs/supported-data-platforms) page.

## How to get an adapter verified?

We envision that data platform vendors will be most interested in having their adapter versions verified, however we are open to community adapter verification. If interested, please reach out either to the `partnerships` at `dbtlabs.com` or post in the [#adapter-ecosystem Slack channel](https://getdbt.slack.com/archives/C030A0UF5LM).
