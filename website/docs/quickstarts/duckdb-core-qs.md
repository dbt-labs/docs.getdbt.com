---
title: "Quickstart for dbt Core using DuckDB"
id: duckdb
description: "Install dbt Core and DuckDB to begin testing within minutes"
platform: 'dbt-core'
icon: 'fa-light fa-square-terminal'
hide_table_of_contents: true
---

## Introduction

In this quickstart guide, you’ll learn how to install dbt Core and DuckDB, and import sample data from the fictional e-commerce Jaffle Shop data set within minutes. DuckDB is an in-process SQL OLAP database management system optimized for data analytics. Installing dbt and DuckDB together enables you to test all the available features and functionality dbt has to offer locally on your computer (no data warehouse required), and the Jaffle Shop Git repository provides a prebuilt dbt project that's ready to run out of the box.

## Prerequisites

* You must know some command line basics to use dbt Core. In particular, you should be familiar with `cd`, `ls` and `pwd` so you can navigate through the directory structure of your computer.
* You have a Windows, Mac, or Linux computer with sufficient storage. The Jaffle Shop sample data set is small and lightweight, taking up less than 200 MB. 
* You must have [Python 3.5](https://www.python.org/downloads/) or newer.
* You must have a [GitHub account](https://github.com/join). For details, refer to [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git) in the GitHub documentation.
* (Optional) [GitHub Codespace](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/enabling-or-disabling-github-codespaces-for-your-organization) enabled for your account.

## Installation instructions

Select a format below that applies to your environment. Copy and paste the commands (you can copy them all at once or line-by-line) into your command line interface (CLI) and execute them. The syntax varies slightly for each, but the result of the commands is the same. They will: 

- Clone the [jaffle_shop_duckdb GitHub repo](https://github.com/dbt-labs/jaffle_shop_duckdb) to your local machine.
- Change the directory to the Jaffle Shop.
- Create a Python virtual environment.
- Install and update pip.
- Install dbt Core and dependencies.
- Install DuckDB and dependencies.
- Build the Jaffle Shop project in dbt Core.
- Generate (`dbt docs generate`) and serve (`dbt docs serve`) dbt docs to your browser (localhost).

For the complete list of installed dependencies, refer to the [requirements.txt](https://github.com/dbt-labs/jaffle_shop_duckdb/blob/duckdb/requirements.txt) file in the jaffle_shop_duckdb GitHub repo. 

<Tabs>
<TabItem value="Bash" label="bash/zsh (Mac)">

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

</TabItem>
<TabItem value="csh" label="csh/tcsh">

```shell
git clone https://github.com/dbt-labs/jaffle_shop_duckdb.git
cd jaffle_shop_duckdb
python3 -m venv venv
source venv/bin/activate.csh
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
source venv/bin/activate.csh
dbt build
dbt docs generate
dbt docs serve
```

</TabItem>
<TabItem value="powershell" label="Windows Powershell">

```shell
git clone https://github.com/dbt-labs/jaffle_shop_duckdb.git
cd jaffle_shop_duckdb
python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
venv\Scripts\Activate.ps1
dbt build
dbt docs generate
dbt docs serve
```

</TabItem>
<TabItem value="codespace" label="GitHub Codespaces">

#### Steps:

1. Ensure you have [Codespaces](https://github.com/features/codespaces) enabled for your GitHub organization or turned on as a beta feature if you're an individual user.
2. Open the [jaffle_shop_duckdb](https://github.com/dbt-labs/jaffle_shop_duckdb) repo in your browser.
3. Click the green **Code** button near the top right of the repo's homepage (you may already be on it).
4. Rather than cloning the repo like you normally would, click the **Codespaces** tab of the pop-out and then click **Create codespace on `duckdb`**.
<div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/codespace-quickstart/open_in_codespaces.png" title="Open in Codespaces" />
    </div>

5. Wait for Codespaces to boot (this may take a few minutes).
6. Select whether you'd like to use the Web IDE or open the codespace in your local environment.
7. When the Codespaces opens, a **Task** pane will show up and call `dbt build` to show you how it's done.
8. (Optional) Install the recommended extensions (like **dbt Power User extension**).
9. Open up a new terminal and type: `dbt build`

</TabItem>
</Tabs>

## Query the data

The Jaffle Shop project seeds the data set to DuckDB, which can then be manually queried from the duckcli tool. 

Launch the DuckDB command-line interface (CLI):

    ```shell
    duckcli jaffle_shop.duckdb
    ```

    Run a query at the prompt and exit:

    ```
    select * from customers where customer_id = 42;
    exit;
    ```

## Browsing the data

There are a few options available to browse the data within DuckDB: 

- [duckcli](https://pypi.org/project/duckcli/)
- [DuckDB CLI](https://duckdb.org/docs/installation/?environment=cli)
- [DBeaver SQL IDE for DuckDB](https://duckdb.org/docs/guides/sql_editors/dbeaver)

## Next steps

Now that you've got dbt Core, DuckDB, and the Jaffle Shop data up and running, you can explore dbt's capabilities. Refer to these materials to get a better understanding of dbt projects and commands:

* The [About projects](/docs/build/projects) page guides you through the structure of a dbt project and its components.
* The [dbt command reference](/reference/dbt-commands) explains the various commands available and what they do.
* The [dbt Labs courses](https://courses.getdbt.com/collections) offer a variety of beginner, intermediate, and advanced learning modules designed to help you become a dbt expert. 
* Once you see the potential of dbt and what it can do for your organization, sign up for a free trial of [dbt Cloud](https://www.getdbt.com/signup). It's the fastest and easiest way to deploy dbt today!
* Check out the other [quickstart guides](/quickstarts) to begin integrating into your existing data warehouse.
