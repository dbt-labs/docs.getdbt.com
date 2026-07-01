---
title: Quickstart for dbt Core using local PostgreSQL
id: postgres
description: "Learn to use dbt Core with a local PostgreSQL database."
hoverSnippet: "Learn to use dbt Core with a local PostgreSQL database."
platform: 'dbt-core'
icon: 'postgres'
level: 'Beginner'
hide_table_of_contents: true
tags: ['dbt Core','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use <Constant name="core" /> with PostgreSQL on your own machine. [PostgreSQL](https://www.postgresql.org/) is an open-source relational database and an official <Constant name="core" /> adapter.

This guide covers PostgreSQL with the <Constant name="core" /> command-line interface (CLI). For <Constant name="fusion" />-specific PostgreSQL setup, refer to [Postgres setup](/docs/local/connect-data-platform/postgres-setup?version=2).

This guide will demonstrate how to:

- Clone a starter project provided by dbt Labs.
- Start a local PostgreSQL database using Docker Compose.
- Install <Constant name="core" /> with the Postgres adapter in a virtual environment.
- Configure your `profiles.yml` file and validate the connection with `dbt debug`.
- Load sample data and run core dbt commands against the fictional Jaffle Shop café project.

You can learn more through high-quality [dbt Learn courses and workshops](https://learn.getdbt.com).

### Related content

- [Postgres setup](/docs/local/connect-data-platform/postgres-setup)
- [profiles.yml reference](/docs/local/profiles.yml)
- [Install dbt Core](/docs/local/install-dbt)

## Prerequisites

- When using PostgreSQL with <Constant name="core" />, you'll need to use the CLI.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine.
- Python 3.9 or higher installed.
- Basic familiarity with the terminal. In particular, you should understand `cd`, `ls`, and `pwd`.
- A [GitHub account](https://github.com/join).

## Set up PostgreSQL for dbt Core

This section provides a step-by-step guide for setting up PostgreSQL for local development on Mac, Linux, and Windows.

The [`jaffle-shop`](https://github.com/dbt-labs/jaffle-shop) repository includes the dbt project, sample CSV data, and package dependencies. You will create a `docker-compose.yml` file in the project to run PostgreSQL locally, and install `dbt-core` and `dbt-postgres` in a virtual environment.

Below is an example of the project structure after setup:

```shell
/jaffle-shop/
├── dbt_project.yml
├── docker-compose.yml      # you create this file
├── models/
│   └── ...
├── seeds/
│   └── jaffle-data/
├── packages.yml
└── ...
```

Create a `docker-compose.yml` file in the project root with the following content. Use the `postgres:16-alpine` image:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: jaffle-postgres
    environment:
      POSTGRES_USER: dbt
      POSTGRES_PASSWORD: dbt
      POSTGRES_DB: jaffle_shop
    ports:
      - "5432:5432"
    volumes:
      - jaffle_postgres_data:/var/lib/postgresql/data

volumes:
  jaffle_postgres_data:
```

For more information, refer to [Postgres setup](/docs/local/connect-data-platform/postgres-setup).

### Local setup

1. First, [clone](https://git-scm.com/docs/git-clone) the Jaffle Shop git repository by running the following command in your terminal:

    ```bash
    git clone https://github.com/dbt-labs/jaffle-shop.git
    ```

2. Change into the `jaffle-shop` directory from the command line:

    ```shell
    cd jaffle-shop
    ```

3. Create a `docker-compose.yml` file in the project root (see the example above), then start the local PostgreSQL database:

    ```bash
    docker compose up -d
    ```

    This starts a PostgreSQL container on port `5432` with a database named `jaffle_shop`.

4. Install <Constant name="core" /> and the Postgres adapter in a virtual environment.

    <Expandable alt_header="Mac and Linux">

    ```shell
    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install --upgrade pip
    python3 -m pip install dbt-core dbt-postgres
    ```

    </Expandable>

    <Expandable alt_header="Windows (Command Prompt)">

    ```shell
    python -m venv venv
    venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    python -m pip install dbt-core dbt-postgres
    ```

    </Expandable>

    <Expandable alt_header="Windows (PowerShell)">

    ```shell
    python -m venv venv
    venv\Scripts\Activate.ps1
    python -m pip install --upgrade pip
    python -m pip install dbt-core dbt-postgres
    ```

    </Expandable>

5. Configure your dbt profile. Create a `profiles.yml` file at `~/.dbt/profiles.yml` (the profile name must be `default` to match `dbt_project.yml` in the repo):

    ```bash
    mkdir -p ~/.dbt
    ```

    Add the following to `~/.dbt/profiles.yml`:

    ```yaml
    default:
      target: dev
      outputs:
        dev:
          type: postgres
          host: localhost
          port: 5432
          user: dbt
          password: dbt
          dbname: jaffle_shop
          schema: dev
          threads: 4
    ```

6. Validate your setup from the command line:

    ```bash
    dbt debug
    ```

    You should see **All checks passed!** at the end of the output.

7. Install package dependencies:

    ```bash
    dbt deps
    ```

    :::note

    After `dbt deps`, you may see a warning that `dbt-audit-helper` is pinned to the `main` branch. That comes from the starter repo's `packages.yml` and is safe to ignore. Packages still install successfully.

    :::

8. Run the following [dbt commands](/reference/dbt-commands) to load data, build models, and run tests:

    - [`dbt deps`](/reference/commands/deps) &mdash; installs packages defined in `packages.yml`
    - [`dbt seed`](/reference/commands/seed) &mdash; loads CSV files from the `seeds/` directory into your database
    - [`dbt run`](/reference/commands/run) &mdash; compiles and runs your models
    - [`dbt test`](/reference/commands/test) &mdash; runs tests defined in your project
    - [`dbt build`](/reference/commands/build) &mdash; runs seeds, models, and tests in the correct order

    Then run:

    ```bash
    dbt seed --full-refresh --vars '{"load_source_data": true}'
    dbt run
    dbt test
    ```

    :::caution

    On your **first** run, run `dbt seed` before `dbt run` and `dbt test`. Do not use `dbt build` for the initial load. Models can start before large seed files finish loading.

    :::

    For complete details, refer to the [dbt command reference](/reference/dbt-commands).

    Here's what successful output looks like after running `dbt seed`, `dbt run`, and `dbt test`:

    ```text
    (venv) jaffle-shop $ dbt seed --full-refresh --vars '{"load_source_data": true}'
    Running with dbt=x.y.z
    Registered adapter: postgres=x.y.z
    Found 13 models, 6 seeds, 27 data tests, 6 sources, 19 metrics, 820 macros, 6 semantic models, 3 saved queries, 3 unit tests

    Concurrency: 4 threads (target='dev')

    1 of 6 START seed file raw.raw_customers ....................................... [RUN]
    2 of 6 START seed file raw.raw_items ........................................... [RUN]
    ...
    6 of 6 OK loaded seed file raw.raw_supplies .................................... [INSERT 65 in 1.49s]

    Finished running 6 seeds in 0 hours 0 minutes and 29.14 seconds (29.14s).

    Completed successfully

    Done. PASS=6 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=6

    (venv) jaffle-shop $ dbt run
    Running with dbt=x.y.z
    Registered adapter: postgres=x.y.z
    Found 13 models, 27 data tests, 6 sources, 19 metrics, 820 macros, 6 semantic models, 3 saved queries, 3 unit tests

    Concurrency: 4 threads (target='dev')

    1 of 13 START sql table model dev.metricflow_time_spine ........................ [RUN]
    2 of 13 START sql view model dev.stg_customers ................................. [RUN]
    ...
    13 of 13 OK created sql table model dev.customers .............................. [SELECT 935 in 0.18s]

    Finished running 7 table models, 6 view models in 0 hours 0 minutes and 1.31 seconds (1.31s).

    Completed successfully

    Done. PASS=13 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=13

    (venv) jaffle-shop $ dbt test
    Running with dbt=x.y.z
    Registered adapter: postgres=x.y.z
    Found 13 models, 27 data tests, 6 sources, 19 metrics, 820 macros, 6 semantic models, 3 saved queries, 3 unit tests

    Concurrency: 4 threads (target='dev')

    1 of 30 START test not_null_customers_customer_id ............................... [RUN]
    2 of 30 START test accepted_values_customers_customer_type__new__returning ..... [RUN]
    ...
    30 of 30 PASS stg_locations::test_does_location_opened_at_trunc_to_date ........ [PASS in 0.20s]

    Finished running 27 data tests, 3 unit tests in 0 hours 0 minutes and 0.85 seconds (0.85s).

    Completed successfully

    Done. PASS=30 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=30
    ```

    To preview data from the command line:

    - `dbt show --select orders` &mdash; runs a query against the `orders` model and previews results in the terminal.

    To generate and view project documentation:

    ```bash
    dbt docs generate
    dbt docs serve
    ```

### Troubleshoot

<Expandable alt_header="Docker daemon is not running">

```text
Cannot connect to the Docker daemon. Is the docker daemon running?
```

Open Docker Desktop and wait until it is fully running. Confirm with:

```bash
docker info
```

Then run `docker compose up -d` again.

</Expandable>

<Expandable alt_header="Postgres container exits immediately (exec format error)">

```text
exec /usr/local/bin/docker-entrypoint.sh: exec format error
```

If the `postgres:16` image fails to start, use `postgres:16-alpine` in your `docker-compose.yml` instead.

</Expandable>

<Expandable alt_header="Port 5432 is already in use">

```text
Bind for 0.0.0.0:5432 failed: port is already allocated
```

Another PostgreSQL instance may already be running on your machine. You can either:

- Stop the other PostgreSQL service, or
- Change the port in `docker-compose.yml` and update `port` in your `profiles.yml` to match.

</Expandable>

<Expandable alt_header="dbt debug connection failed">

If `dbt debug` fails to connect:

1. Confirm the database is running: `docker compose ps`
2. Confirm Docker started successfully: `docker compose logs`
3. Check that `host`, `port`, `user`, `password`, and `dbname` in `profiles.yml` match the values in `docker-compose.yml`

</Expandable>

## Local database

PostgreSQL stores your data in the Docker volume configured in `docker-compose.yml`. Your dbt models, seeds, and tests are written to the `jaffle_shop` database.

To confirm the container is running:

```bash
docker compose ps
```

To stop the database when you are finished (data is kept in the Docker volume):

```bash
docker compose down
```

To stop the database and remove stored data:

```bash
docker compose down -v
```

:::note

`docker compose down` stops the container but keeps your data. After running `docker compose up -d` again, you can run `dbt run` without re-running `dbt seed`. If you run `docker compose down -v`, the volume is removed and you will need to run `dbt seed --full-refresh --vars '{"load_source_data": true}'` again to reload the sample data.

:::

## Next steps

Now that you have <Constant name="core" />, PostgreSQL, and the Jaffle Shop data up and running, you can explore dbt's capabilities. Refer to these materials to get a better understanding of dbt projects and commands:

- The [About projects](/docs/build/projects) page guides you through the structure of a dbt project and its components.
- [dbt command reference](/reference/dbt-commands) explains the various commands available and what they do.
- [dbt Labs courses](https://courses.getdbt.com/collections) offer a variety of beginner, intermediate, and advanced learning modules designed to help you become a dbt expert.
- Check out the other [quickstart guides](/guides?tags=Quickstart).
- Once you see the potential of dbt and what it can do for your organization, sign up for a free trial of [<Constant name="dbt" />](https://www.getdbt.com/signup).

Additionally, with your new understanding of the basics of using PostgreSQL locally, consider [documenting your project](/guides/postgres#document-your-project) or [scheduling a job](/guides/postgres#schedule-a-job).

### Document your project

To document your dbt project, follow these steps:

- Use `dbt docs generate` to compile information about your dbt project and warehouse into `manifest.json` and `catalog.json` files.
- Run [`dbt docs serve`](/reference/commands/cmd-docs#dbt-docs-serve) to view your project's documentation in a web browser.
- Enhance your documentation by adding [descriptions](/reference/resource-properties/description) to models, columns, and sources using the `description` key in your YAML files.

### Commit your changes

If you forked the repository to make your own copy, you can commit and push your changes:

1. Run the following commands in the terminal from your project directory:

```shell
git add .
git commit -m "Your commit message"
git push
```

2. Go back to your GitHub repository to verify your new files have been added.

### Schedule a job

1. Ensure <Constant name="core" /> is installed and configured to connect to your PostgreSQL instance.
2. Create a dbt project and define your [`models`](/docs/build/models), [`seeds`](/reference/seed-properties), and [`tests`](/reference/commands/test).
3. Use a scheduler such as [Prefect](/docs/deploy/deployment-tools#prefect) to schedule your dbt runs.
4. Write a script that runs your dbt commands, such as [`dbt run`](/reference/commands/run), `dbt test`, and more.
5. Use your chosen scheduler to run the script at your desired frequency.

<ConfettiTrigger>

Congratulations on making it through the guide 🎉!

</ConfettiTrigger>

</div>
