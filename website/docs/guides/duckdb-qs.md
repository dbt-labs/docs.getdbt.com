---
title: Quickstart for dbt Core using DuckDB
id: duckdb
description: "Learn to use dbt Core using DuckDB."
hoverSnippet: "Learn to use dbt Core using DuckDB."
platform: 'dbt-core'
icon: 'duckdb-seeklogo'
level: 'Beginner'
hide_table_of_contents: true
tags: ['dbt Core','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Core with DuckDB, enabling you to get set up quickly and efficiently. [DuckDB](https://duckdb.org/) is an open-source database management system which is designed for analytical workloads. It is designed to provide fast and easy access to large datasets, making it well-suited for data analytics tasks. 


This guide will demonstrate how to: 

- Create a virtual development environment using a template provided by dbt Labs.
   - This sets up a fully functional dbt environment with an operational and executable project. The codespace automatically connects to the DuckDB database and loads a year's worth of data from our fictional Jaffle Shop café, which sells food and beverages in several US cities.
   - For additional information, refer to the [README](https://github.com/gwenwindflower/octocatalog) for the Jaffle Shop template. It includes instructions on how to do this, along with animated GIFs.
- Run any dbt command from the environment’s terminal. 
- Generate a larger dataset for the Jaffle Shop café (for example, five years of data instead of just one).

You can learn more through high-quality [dbt Learn courses and workshops](https://learn.getdbt.com). 


### Related content


- [DuckDBsetup](/docs/core/connect-data-platform/duckdb-setup)
- [Create a GitHub repository](/guides/manual-install?step=2)
- [Build your first models](/guides/manual-install?step=3)
- [Test and document your project](/guides/manual-install?step=4)
- [Schedule a job](/guides/manual-install?step=5)


### Prerequisites

- When using DuckDB with dbt Core, you'll need to use the dbt command-line interface (CLI). Currently, DuckDB is not supported in dbt Cloud.
- It's important that you know some basics of the terminal. In particular, you should understand `cd`, `ls` , and `pwd` to navigate through the directory structure of your computer easily.
- You have a [GitHub account](https://github.com/join).

## Set up DuckDB for dbt Core

The following provides a step-by-step guide for setting up DuckDB for use in local (Mac and Windows) environments and web browsers.

For more information on the setup of DuckDB, you can refer to [DuckDBsetup](/docs/core/connect-data-platform/duckdb-setup).


<Tabs>

<TabItem value="local" label="Local">

1. First, you'll need to [clone](https://github.com/git-guides/git-clone) the Jaffle Shop repository by running the following command in your terminal:



    ```bash
    git clone https://github.com.dbt-labs/jaffle_shop_duckdb.git

    ```

2. Change into the docs-duckdb directory from the command line:

    ```shell

    cd jaffle_shop_duck_db

    ```


3. Install dbt Core and DuckDB in a virtual environment.

    <Expandable alt_header="Example for Mac" >

    ```shell

    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install --upgrade pip
    python3 -m pip install -r requirements.txt
    source venv/bin/activate

    ```
    </Expandable>

    <Expandable alt_header="Example for Windows" >

    ```shell

    python -m venv venv
    venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    venv\Scripts\activate.bat

    ```

    </Expandable>

    <Expandable alt_header="Example for Windows PowerShell" >

    ```shell

    python -m venv venv
    venv\Scripts\Activate.ps1
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    venv\Scripts\Activate.ps1

    ```
    </Expandable>


4. Ensure your profile is setup correctly from the command line by running the following:


    - [dbt compile](https://docs.getdbt.com/reference/commands/compile) &mdash; generates executable SQL from your project source files
    - [dbt run](https://docs.getdbt.com/reference/commands/run) &mdash; compiles and runs your project
    - [dbt test](https://docs.getdbt.com/reference/commands/test) &mdash; compiles and tests your project
    - [dbt build](https://docs.getdbt.com/reference/commands/build) &mdash; compiles, runs, and tests your project
    - [dbt docs generate](/reference/commands/cmd-docs#dbt-docs-generate) &mdash; generates your project's documentation.
    - [dbt docs serve](/reference/commands/cmd-docs#dbt-docs-serve) &mdash; starts a webserver on port 8080 to serve your documentation locally and opens the documentation site in your default browser.

    For complete details, refer to the [dbt command reference](/reference/dbt-commands).

:::note

The steps will fail if you decide to run this project in your data warehouse (outside of this DuckDB demo). You will need to reconfigure the project files for your warehouse. Definitely consider this if you are using a community-contributed adapter.

:::


### Troubleshoot



   <Expandable alt_header="Could not set lock on file error" >

    ```Jinja

    IO Error: Could not set lock on file "jaffle_shop.duckdb": Resource temporarily unavailable

    ```

    This is a known issue in DuckDB. Try disconnecting from any sessions that are locking the database. If you are using DBeaver, this means shutting down DBeaver (disconnecting doesn't always work).

    As a last resort, deleting the database file will get you back in action (_but_ you will lose all your data).

   </Expandable>


</TabItem>
 
<TabItem value="web" label="Web browser">

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
    
    - [dbt compile](https://docs.getdbt.com/reference/commands/compile) &mdash; generates executable SQL from your project source files
    - [dbt run](https://docs.getdbt.com/reference/commands/run) &mdash; compiles and runs your project
    - [dbt test](https://docs.getdbt.com/reference/commands/test) &mdash; compiles and tests your project
    - [dbt build](https://docs.getdbt.com/reference/commands/build) &mdash; compiles, runs, and tests your project


  </TabItem>

</Tabs>


## Generate a larger data set

If you'd like to work with a larger selection of Jaffle Shop data, you can generate an arbitrary number of years of fictitious data from within your codespace. 

1. Install the Python package called [jafgen](https://pypi.org/project/jafgen/). At the terminal's prompt, run:

    ```shell
    /workspaces/test (main) $ python -m pip install jafgen
    ```

1. When installation is done, run:
    ```shell
    /workspaces/test (main) $ jafgen --years NUMBER_OF_YEARS
    ``` 
    Replace `NUMBER_OF_YEARS` with the number of years you want to simulate. This command builds the CSV files and stores them in the `jaffle-data` folder, and is automatically sourced based on the `sources.yml` file and the [dbt-duckdb](/docs/core/connect-data-platform/duckdb-setup) adapter.

As you increase the number of years, it takes exponentially more time to generate the data because the Jaffle Shop stores grow in size and number. For a good balance of data size and time to build, dbt Labs suggests a maximum of 6 years.

</div>