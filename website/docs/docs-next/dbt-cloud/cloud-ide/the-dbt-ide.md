---
title: "The dbt IDE"
id: "the-dbt-ide"
---


:::info Prerequisites

You must have a dbt Cloud account to use the IDE. Consult the guide on [using the dbt IDE](using-the-dbt-ide). Don't have an account? You can get started for free [here](https://www.getdbt.com/signup).

:::


The dbt Integrated Development Environment (IDE) provides a realtime editing and execution environment for your dbt project. In the dbt IDE, you can write, run, test, and version control the code in your dbt project from your browser -- no command line use required.

## Compiling and Running SQL

In the dbt IDE, you can compile dbt code into SQL and execute it against your database directly. The IDE leverages the open-source [dbt server](rpc) to intelligently recompile only the parts of your project that have changed. This brings the cycle time for dbt project development down from minutes to seconds.

<Lightbox src="/img/docs/dbt-cloud/d6a75a5-Screen_Shot_2019-11-05_at_9.04.02_PM.png" title="Executing dbt SQL in the browser"/>

## Running Projects

In addition to compiling and executing SQL, you can also *run* dbt projects in the dbt IDE. Use dbt's [rich model selection syntax](node-selection/syntax) to [run dbt commands](dbt-commands) directly in your browser.

The dbt IDE updates in real-time as models, tests, seeds, and operations are run. If a model or tests fails, you can dig into the logs to find and fix the issue.

<Lightbox src="/img/docs/dbt-cloud/50e939e-Screen_Shot_2019-11-05_at_9.08.38_PM.png" title="Running jobs and viewing results in the dbt IDE"/>

## Version Control

Leverage git directly from the dbt IDE to version control your code from your browser. You can branch, commit, push, and pull code with a couple of clicks - no command line required.

<Lightbox src="/img/docs/dbt-cloud/8959807-Screen_Shot_2019-11-05_at_9.15.46_PM.png" title="Creating a new git branch in the IDE"/>

## Dark mode
As Ben Franklin once said:

> In matters of principle, stand like a rock; in matters of taste, swim with the current.

<Lightbox src="/img/docs/dbt-cloud/7adcb15-Screen_Shot_2019-11-05_at_9.35.48_PM.png" title="Now with 205% more Dark"/>
