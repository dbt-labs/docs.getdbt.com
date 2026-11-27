---
title: "Find the Golden Jaffle: Advent of dbt starts December 1"
description: "Twelve weekday puzzles from December 1 to 16, on what's new in the dbt world, built on dbt v2. One growing dbt project on your laptop, and a very old recipe."
slug: advent-of-dbt
image: /img/blog/2026-11-30-advent-of-dbt/golden-jaffle-still.png

authors: [benoit_perigaud]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2026-11-30
is_featured: true
---

Inspired by [Advent of Code](https://adventofcode.com/), we are happy to announce Advent of dbt: one puzzle every weekday, from Tuesday, December 1 to Wednesday, December 16, on what's new in the dbt world, built on dbt v2.

> Jairko runs data at the Philly Jaffle Shop. One morning, he finds a note from the Old Toastmaster, the shop's founder, hidden in a toastie iron. It names a dbt project nobody ever built, and there is a Golden Jaffle recipe to piece together. Jairko's hands are covered in butter, so it's your turn at the keyboard. Can you find the Golden Jaffle, even if it takes a trip to Marseille?

<figure>
  <video width="80%" controls autoPlay muted loop playsInline poster="/img/blog/2026-11-30-advent-of-dbt/golden-jaffle-still.png">
    <source src="/img/blog/2026-11-30-advent-of-dbt/golden-jaffle.mp4" type="video/mp4" />
  </video>
  <figcaption style={{textAlign: 'center', fontSize: 'small'}}>24 crumbs to find, one Golden Jaffle to toast.</figcaption>
</figure>

<!-- truncate -->

## How does it work?

Every weekday, at about 8am CET (2am ET), we will release the new puzzle of the day on [the Advent of dbt website](https://dbt-labs.github.io/advent-of-dbt/). Each day will have 2 parts. Each part ends with a crumb, a number or a word you find by running dbt. There are 24 in all.

You will solve the puzzles by running a dbt project on your laptop with DuckDB: no cloud account and no warehouse needed. Each puzzle uses specific features of dbt.

You will enter your answers in the Advent of dbt website and know directly if you found the correct solution (nothing is sent anywhere).

Each day might take 15 to 30 min to solve, and you can go back to previous days or skip some days whenever you want. We will also publish the solution to the previous day at the same time as the next puzzle.

You need to know a bit of dbt, but day 1 starts with a short tour of the vocabulary. And yes, you can ask an AI agent to solve the puzzles, but you'll learn a lot more if you don't.

## What will you learn?

In addition to following Jairko on his quest to the Golden Jaffle, the puzzles are designed to explain and use some of the new (and sometimes less known) features that dbt offers.

Some puzzles will for example use the ability in dbt v2 to compile and verify SQL before reaching the warehouse, via [static analysis](https://docs.getdbt.com/reference/resource-configs/static-analysis?version=2), and others will require exploring the [new information schema](https://docs.getdbt.com/docs/build/dbt-information-schema?version=2) to analyze a given project. Each day covers one feature. Besides those two, you'll meet `dbt format` and `dbt lint`, unit tests, column lineage, `dbt check` and dbt-project-evaluator, and in the second week the semantic layer, dbt charts, OpenTelemetry, Iceberg catalogs and more.

## Get ready for Day 1

Each day will tell you exactly what to do, but in a nutshell, you will need:

- dbt v2 installed on version 2.0.12 or later ([how to install it](/docs/local/install-dbt?version=2)) — check it with `dbt --version`
- `git` installed so you can get the new challenges (or download each day's zip from its page)
- an IDE where you can see your code and run commands. We recommend VS Code with [the dbt extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt) installed, or Cursor with [the same extension](https://open-vsx.org/extension/dbtLabsInc/dbt), but you can also use Zed, nvim etc…
- Python, for MetricFlow and dbt charts in the second week (we recommend [installing uv](https://docs.astral.sh/uv/getting-started/installation/) for that)
- Docker (optional), for a few days in the second week (OpenTelemetry, an Iceberg catalog). Each of those days has a part you can do without it
- on Windows, PowerShell, Git Bash or WSL (not the old Command Prompt)

## Where to talk

Join #advent-of-dbt in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community) to ask for help and compare notes, with one thread per day. Please keep answers out of the main channel. And share your progress on LinkedIn with #AdventOfdbt.

## Ready?

Day 1 opens on Tuesday, December 1 at 8am CET (2am ET). Start with the [Start here](https://dbt-labs.github.io/advent-of-dbt/start-here.html) page, and find the project on [GitHub](https://github.com/dbt-labs/advent-of-dbt). See you at the Jaffle Shop!
