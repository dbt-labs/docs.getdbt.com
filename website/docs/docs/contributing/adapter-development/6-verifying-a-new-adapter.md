---
title: "Verifying a new adapter"
id: "6-verifying-a-new-adapter"
---

## Why verify an adapter?

Circa 2017,  dbt's adapter plugin framework was introduced to meet client demand back when dbt Labs (née Fishtown Analytics) still a data consultancy. As a result dbt Labs specialized in four data platforms and became experts in them. However, the covering the surface area of all possible databases, their respective nuances, and keeping them up-to-date and bug-free is a Herculean and/or Sisyphean task that couldn't be done by a single person or even a single team! Enter the dbt community which enables dbt Core to work on more than 30 different databases (32 as of Sep '22)!

Free and open-source tools for the data professional are increasingly abundant. This is by-and-large a *good thing*, however it requires due dilligence that wasn't required in a paid-license, closed-source software world. Before taking a dependency on an open-source projet is is important to determine the answer to the following questions:

1. Does it work?
2. Does it meet my team's specific use case?
3. Does anyone "own" the code, or is anyone liable for ensuring it works?
4. Do bugs get fixed quickly?
5. Does it stay up-to-date with new Core features?
6. Is the usage substantial enough to self-sustain?
7. What risks do I take on by taking a dependency on this library?

These are valid, important questions to answer, especially given that the main package, dbt-core has only been issueing stable releases since October '21. Indeed, up until now, the majority of new user questions in database-specific channels are some form of:
- "How mature is `dbt-<ADAPTER>`? Any gotchas I should be aware of before I start exploring?"
- "has anyone here used `dbt-<ADAPTER>` for production models?"
- "I've been playing with  `dbt-<ADAPTER>` -- I was able to install and run my initial experiments. I noticed that there are certain features mentioned on the documentation that are marked as 'not ok' or 'not tested'. What are the risks?
I'd love to make a statement on my team to adopt DBT, but I'm pretty sure questions will be asked around the possible limitations of the adapter or if there are other companies out there using DBT with Oracle DB in production, etc."

There has been a tendency to trust the dbt Labs-maintained adapters over community- and vendor-supported adapters, but who owns the repo is only loosely-correlated with quality. We aim to help our users feel well-informed as to the quality of an adapter with a new program.

## Verified by dbt Labs

The adapter verification program aims to quickly indicate to users which adapters can be trusted to use in production. Previously, doing so previously was uncharted for new users and made more arduous to make the business case to their leadership team. We plan to give quality assurances by:
1. appointing a key stakeholder for the adapter repository,
2. ensuring that the chosen stakeholder fixes bugs and cuts new releases in a timely manner,
3. demonstrating that it passes our adapter pytest suite tests,
4. assuring that it works for us internally and ideally an existing team using the adapter in production .


Every major & minor version of a adapter will be verified internally and given an official :white_check_mark: (custom emoji coming soon), on the [Available Adapters](available-adapters) page.

## How to get an adapter verified?

We envision that data platform vendors will be most interested in having their adapter versions verified, however we are not opposed to community adapter verification. If interested, please reach out either to the `partnerships` at `dbtlabs.com` or post in the [#adapter-ecosystem Slack channel](https://getdbt.slack.com/archives/C030A0UF5LM).