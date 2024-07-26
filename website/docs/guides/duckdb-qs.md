---
title: Quickstart for dbt Core using DuckDB
id: duckDB
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

In this quickstart guide, you’ll learn how to install dbt Core for the use of DuckDB. 

We'll also touch on creating a codespace executing the `dbt build` command from it in _less than 5 minutes_. 

It will show you how to:

- Install DuckDB
- Create a larger dataset
- How to use DuckDB



### What is DuckDB?



<Tabs>

<TabItem value="local" label="Local">

DuckDB is an open-source database management system which is designed for analytical workloads.  It is designed to provide fast and easy access to large datasets, making it well-suited for data analytics tasks. 

Here's a list of some of the main features of DuckDB:

- In-Process Database: Unlike traditional databases that run as a separate server process, DuckDB runs within the host application process. This allows for tight integration and low-latency data access.

- SQL Support: DuckDB supports standard SQL, making it accessible to users familiar with SQL syntax and enabling the use of complex queries for data analysis.

- Columnar Storage: DuckDB uses a columnar storage format, which is efficient for analytical queries that often need to scan large amounts of data but only a few columns. This design improves performance for read-heavy operations.

- OLAP (Online Analytical Processing) Focused: While traditional relational databases are optimized for OLTP (Online Transaction Processing) workloads, DuckDB is optimized for OLAP workloads, which involve complex queries and data analysis.

- Embeddable: Being embeddable means DuckDB can be included as a library in applications, making it a good choice for scenarios where a lightweight, high-performance database is needed without the overhead of a separate database server.

- Cross-Platform: DuckDB works on multiple operating systems, including Windows, macOS, and Linux.

- Easy Integration: It can be easily integrated with other data processing tools and environments, such as Python, R, and various data science and machine learning frameworks.

- No External Dependencies: DuckDB does not rely on external services or infrastructure, making it easy to deploy and use in a wide range of environments.


 </TabItem>
 
 <TabItem value="web" label="Web">

dbt Labs provides a [GitHub Codespace](https://docs.github.com/en/codespaces/overview) template that you (and anyone else) can reuse to create a complete dbt environment with a working and runnable project. When you create the codespace, the [dev container](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) creates a fully functioning dbt environment, connects to a DuckDB database, and loads a year of data from our fictional Jaffle Shop café, which sells food and beverages in several US cities. The [README](https://github.com/dbt-labs/jaffle-shop-template#readme) for the Jaffle Shop template also provides instructions on how to do this, along with animated GIFs. 


</TabItem>

</Tabs>


- [DuckDBsetup](/docs/core/connect-data-platform/duckdb-setup)
- [Create a GitHub repository](/guides/manual-install?step=2)
- [Build your first models](/guides/manual-install?step=3)
- [Test and document your project](/guides/manual-install?step=4)
- [Schedule a job](/guides/manual-install?step=5)
- Learn more with [dbt Learn courses](https://learn.getdbt.com)


### Prerequisites

- When using DuckDB with dbt Core, you'll need to use the dbt command-line interface (CLI).
- It's important that you know some basics of the terminal. In particular, you should understand `cd`, `ls` , and `pwd` to navigate through the directory structure of your computer easily.
- You have a [GitHub account](https://github.com/join).


## Install DuckDB

Further down is a step-by-step explanation of the steps to install DuckDB.


On a Mac, copy & paste the following to your terminal (standalone or with an IDE like VS Code).

```shell
git clone https://github.com/dbt-labs/jaffle_shop_duckdb.git
cd jaffle_shop_duckdb
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
source venv/bin/activate
dbt build
dbt docs generate
dbt docs serve
```

On Windows, use either Powershell or the command line prompt:

Windows cmd.exe

```shell
git clone https://github.com/dbt-labs/docs-duckdb.git
cd docs-duckdb
python -m venv venv
venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
venv\Scripts\activate.bat
dbt deps
dbt build
dbt docs generate
dbt docs serve
```

Windows PowerShell

```shell
git clone https://github.com/dbt-labs/docs-duckdb.git — Clones the repo locally
cd docs-duckdb — Changes directory to the repo
python3 -m venv venv — Creates a Python virtual environment called "venv"
source venv/bin/activate — Activates the Pythong virtual environment
python3 -m pip install --upgrade pip — Ensures Pip is up to date
python3 -m pip install -r requirements.txt — Installs the programs and dependencies defined in the file
source venv/bin/activate — Ensures the virtual environment is activated
dbt deps — Installs dbt packages
dbt build — Seeds data to the Duckdb database and builds models and dependecies
dbt docs generate — Compiles the projects docs
dbt docs serve — Displays the docs in your open or default browser.
```

Fore more information on the setup of DuckDB, you can refer to [DuckDBsetup](/docs/core/connect-data-platform/duckdb-setup).


:::info DuckDB Support

Currently, DuckDB is not supported in dbt Cloud.

:::


## Set up DuckDB for dbt Core


Below you'll find a step by step guide on getting up and running with this project.


<Tabs>

<TabItem value="duckdb" label="DuckDB">

1. First, you'll need to clone this repository.

2. Change into the docs-duckdb directory from the command line:

```Jinja

cd docs-duckdb

```

3. Install dbt and DuckDB in a virtual environment.

If you're using MAC, you can copy and paste the below:

```Jinja

python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
source venv/bin/activate

```

Windows cmd.exe

```Jinja

python -m venv venv
venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
venv\Scripts\activate.bat

```

Windows PowerShell

```Jinja

python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
venv\Scripts\Activate.ps1

```

4. Ensure your profile is setup correctly from the command line:

```Jinja

dbt --version
dbt debug

```

5. Load the CSVs with the demo data set, run the models, and test the output of the models using the dbt build command:

```Jinja

dbt build

```

6. Generate and view the documentation for the project:

```Jinja

dbt docs generate
dbt docs serve

```

### Run build steps independently

1. Load the CSVs with the demo data set. This materializes the CSVs as tables in your target schema. Note that a typical dbt project does not require this step since dbt assumes your raw data is already in your warehouse.

```Jinja

dbt seed

```
2. Run the models:

```Jinja

dbt run

```

:::note Note.

NOTE: If you decide to run this project in your own data warehouse (outside of this DuckDB demo) and steps fail, it might mean that you need to make small changes to the SQL in the models folder to adjust for the flavor of SQL of your target database. Definitely consider this if you are using a community-contributed adapter.

:::

3. Test the output of the models using the test command:

```Jinja

dbt test

```

### Troubleshoot

You may get an error like the one in the example below, in which case you will need to disconnect from any sessions that are locking the database:

```Jinja

IO Error: Could not set lock on file "jaffle_shop.duckdb": Resource temporarily unavailable

```

This is a known issue in DuckDB. If you are using DBeaver, this means shutting down DBeaver (disconnecting doesn't always work).

As a last resort, deleting the database file will get you back in action (_BUT_ you will lose all your data).


 </TabItem>
 
 <TabItem value="codespaces" label="Codespaces">

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