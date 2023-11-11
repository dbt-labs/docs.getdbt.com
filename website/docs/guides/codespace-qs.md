---
title: Quickstart for dbt Core using GitHub Codespaces
id: codespace
platform: 'dbt-core'
icon: 'fa-github'
level: 'Beginner'
hide_table_of_contents: true
tags: ['dbt Core','Quickstart']
---

## Introduction

In this quickstart guide, you’ll learn how to create a codespace and be able to execute the `dbt build` command from it in _less than 5 minutes_. 

dbt Labs provides a [GitHub Codespace](https://docs.github.com/en/codespaces/overview) template that you (and anyone else) can reuse to create a complete dbt environment with a working and runnable project. When you create the codespace, the [dev container](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) creates a fully functioning dbt environment, connects to a DuckDB database, and loads a year of data from our fictional Jaffle Shop café, which sells food and beverages in several US cities. The [README](https://github.com/dbt-labs/jaffle-shop-template#readme) for the Jaffle Shop template also provides instructions on how to do this, along with animated GIFs. 

### Prerequisites

- To use the dbt command-line interface (CLI), it's important that you know some basics of the terminal. In particular, you should understand `cd`, `ls` , and `pwd` to navigate through the directory structure of your computer easily.
- You have a [GitHub account](https://github.com/join).

## Related content

- [Create a GitHub repository](/guides/manual-install?step=2)
- [Build your first models](/guides/manual-install?step=3)
- [Test and document your project](/guides/manual-install?step=4)
- [Schedule a job](/guides/manual-install?step=5)
- Learn more with [dbt Courses](https://courses.getdbt.com/collections)

## Create a codespace

1. Go to the `jaffle-shop-template` [repository](https://github.com/dbt-labs/jaffle-shop-template) after you log in to your GitHub account. 
1. Click **Use this template** at the top of the page and choose **Create new repository**.
1. Click **Create repository from template** when you’re done setting the options for your new repository.
1. Click **Code** (at the top of the new repository’s page). Under the **Codespaces** tab,  choose **Create codespace on main**. Depending on how you've configured your computer's settings, this either opens a new browser tab with the Codespace development environment with VSCode running in it or opens a new VSCode window with the codespace in it. 
1. Wait for the codespace to finish building by waiting for the `postCreateCommand` command to complete; this can take several minutes:

    <Lightbox src="/img/codespace-quickstart/postCreateCommand.png" title="Wait for postCreateCommand to complete" />

    When this command completes, you can start using the codespace development environment. The terminal the command ran in will close and you will get a prompt in a brand new terminal. 

1. At the terminal's prompt, you can execute any dbt command you want. For example:

    ```shell
    /workspaces/test (main) $ dbt build
    ```

    You can also use the [duckcli](https://github.com/dbcli/duckcli) to write SQL against the warehouse from the command line or build reports in the [Evidence](https://evidence.dev/) project provided in the `reports` directory.
    
    For complete information, refer to the [dbt command reference](https://docs.getdbt.com/reference/dbt-commands). Common commands are:
    
    - [dbt compile](https://docs.getdbt.com/reference/commands/compile) — generates executable SQL from your project source files
    - [dbt run](https://docs.getdbt.com/reference/commands/run) — compiles and runs your project
    - [dbt test](https://docs.getdbt.com/reference/commands/test) — compiles and tests your project
    - [dbt build](https://docs.getdbt.com/reference/commands/build) — compiles, runs, and tests your project

## Generate a larger data set

If you'd like to work with a larger selection of Jaffle Shop data, you can generate an arbitrary number of years of fictitious data from within your codespace. 

1. Install the Python package called [jafgen](https://pypi.org/project/jafgen/). At the terminal's prompt, run:

    ```shell
    /workspaces/test (main) $ pip install jafgen
    ```

1. When installation is done, run:
    ```shell
    /workspaces/test (main) $ jafgen --years NUMBER_OF_YEARS
    ``` 
    Replace `NUMBER_OF_YEARS` with the number of years you want to simulate. This command builds the CSV files and stores them in the `jaffle-data` folder, and is automatically sourced based on the `sources.yml` file and the [dbt-duckdb](/docs/core/connect-data-platform/duckdb-setup) adapter.

As you increase the number of years, it takes exponentially more time to generate the data because the Jaffle Shop stores grow in size and number. For a good balance of data size and time to build, dbt Labs suggests a maximum of 6 years.

