---
title: "Quickstart for dbt Charts"
id: "dbt-charts"
description: "Build a dbt project locally, write your first dbt Charts board by hand, and preview it in the browser."
hoverSnippet: "Build a dbt project locally, write your first dbt Charts board by hand, and preview it in the browser."
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Charts', 'Quickstart']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## Introduction

dbt Charts is a visualization layer that turns YAML files into interactive dashboards. You define queries, charts, and layouts as text and store them in Git alongside your dbt project. Because dbt Charts queries your dbt models directly, your dashboards stay in sync with the same transformations your team already trusts.

You develop dbt Charts locally with the `dct` command-line tool: it reads a board file, runs its queries against the connection in your dbt `profiles.yml`, and serves the result in your browser with hot reload as you edit.

In this quickstart, you'll learn how to:

- Create the `charts/` directory and a board file by hand.
- Write your first five charts &mdash; a line, bar, area, pie, and table &mdash; from your dbt models.
- Install dbt Charts and preview the board locally.

This guide uses the [`fusion-jaffle-shop`](https://github.com/matthewshaver/jaffle-shop-multi-adapter) sample project, which is built for v1.12+ and includes marts such as `order_items` and `location_performance`. When you finish, you'll have a board that trends revenue over time, compares performance across store locations, and lists location-level key performance indicators (KPIs).

### Prerequisites

- You have [dbt v1.12+ installed](/docs/local/install-dbt?version=2). This guide assumes <Constant name="fusion" />.
  - If you're using v2, you must install the v1 adapter for your dbt Charts project to load in your browser. You don't have to do any additional configuration. For example, if you're using Snowflake, run `pip install dbt-snowflake` before installing dbt Charts. As development on dbt Charts continues, this prerequisite will eventually be removed.
- You have [Git](https://git-scm.com/downloads) and basic familiarity with the command line and YAML.
- You have [Python](https://www.python.org/downloads/) 3.9 or later and a package manager such as [uv](https://docs.astral.sh/uv/) or `pip`, to install the `dct` tool.
- You have a working connection to your data platform (Snowflake in this guide) that dbt can build into.

### Related content

- [Build your dbt models](/docs/build/models)
- [How we structure our dbt projects](/best-practices/how-we-structure/1-guide-overview)
- [dbt Charts query types](https://docs.dataface.com/queries/)
- [dbt Charts documentation](https://docs.dataface.com/)

## Clone the sample project and build it

dbt Charts queries tables that already exist in your data platform, so build the project's models before you chart them.

1. Clone the sample project and change into it:

    ```bash
    git clone https://github.com/matthewshaver/jaffle-shop-multi-adapter.git
    cd fusion-jaffle-shop
    ```

2. Add a `profiles.yml` for your data platform. The project's `dbt_project.yml` sets `profile: default`, so name your profile `default` and give it a `dev` target. dbt reads a `profiles.yml` in the project root, or falls back to `~/.dbt/profiles.yml`. For platform-specific fields, refer to [Connection profiles](/docs/local/connect-data-platform/about-dbt-connections).

3. Install the project's packages:

    ```bash
    dbt deps
    ```

4. Seed the raw CSVs and build the models and tests in one command:

    ```bash
    dbt build
    ```

    The `dbt build` command runs seeds, models, snapshots, and tests in dependency order, so you don't need a separate `dbt seed` step. For the full list of commands, refer to [dbt commands](/reference/dbt-commands).

5. Confirm that a mart the charts read returns rows:

    ```bash
    dbt show --inline "select count(*) from {{ ref('order_items') }}"
    ```

:::note
Record the database and schema that dbt built into &mdash; your chart SQL references them. To find them, run `dbt list --output json` and read each model's `relation_name`.
:::

## Create the charts directory and board file

The sample project doesn't ship any dbt Charts files, so you create them yourself. dbt Charts needs two things: a project config at the root that declares a data source, and at least one board file under `charts/`.

1. From the project root, create the directory that holds your boards:

    ```bash
    mkdir charts
    ```

    Every `.yaml`, `.yml`, and `.md` file under `charts/` becomes a served page, and nested directories become nested paths.

2. Create `dbt_charts.yml` in the project root. Locally, dbt Charts reuses your dbt connection &mdash; there's no separate credential setup. Declare a source that points at a dbt profile and target, and boards reference it by name:

    <File name='dbt_charts.yml'>

    ```yaml
    sources:
      analytics:
        type: dbt_profile
        profile: default
        target: dev
    ```

    </File>

    The `profile` and `target` match your `profiles.yml` (`default` and `dev` in this project). Credentials stay in `profiles.yml`, including Snowflake key-pair auth through `private_key_path` if your account requires it.

3. Create an empty board file at `charts/analytics.yml` and give it a title and a source:

    <File name='charts/analytics.yml'>

    ```yaml
    title: "Jaffle Shop overview"
    source: analytics
    ```

    </File>

Over the next two steps, you add the queries and charts to this file, then the layout that positions them.

## Add your first five charts

Now add five charts to `charts/analytics.yml`, one for each of the most common chart types. Each chart references a SQL query &mdash; defined in a `queries:` block &mdash; and maps that query's output columns to the chart's channels (`x`, `y`, `theta`, `color`).

Each snippet below shows the query and the chart to add. Charts don't render until you add the layout in the next step, and the complete file appears in [Lay out your board](/guides/dbt-charts?step=5).

Each query references its model by fully qualified location. Replace `MY_DATABASE.MY_SCHEMA` with the database and schema that dbt built your marts into. The SQL uses Snowflake syntax, so adjust functions like `date_trunc` if you build on another platform.

### 1. Line chart: revenue over time

Line charts show trends over time. This query aggregates revenue by month from the `order_items` model.

```yaml
queries:
  revenue_by_month:
    sql: |
      SELECT date_trunc('month', ordered_at) AS month,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1
      ORDER BY 1

charts:
  revenue_trend:
    type: line
    query: revenue_by_month
    x: month
    y: revenue
    title: "Revenue by month"
```

### 2. Bar chart: revenue by location

Bar charts compare a value across categories. This query reads pre-aggregated revenue per store from the `location_performance` mart.

```yaml
queries:
  revenue_by_location:
    sql: |
      SELECT location_name,
             total_revenue AS revenue
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC

charts:
  revenue_by_location:
    type: bar
    query: revenue_by_location
    x: location_name
    y: revenue
    title: "Revenue by location"
```

### 3. Area chart: cumulative revenue

Area charts emphasize accumulation over time. This query uses a window function to running-total monthly revenue.

```yaml
queries:
  cumulative_revenue:
    sql: |
      SELECT month,
             sum(revenue) OVER (ORDER BY month) AS cumulative_revenue
      FROM (
        SELECT date_trunc('month', ordered_at) AS month,
               sum(product_price) AS revenue
        FROM MY_DATABASE.MY_SCHEMA.order_items
        GROUP BY 1
      )
      ORDER BY month

charts:
  cumulative_revenue:
    type: area
    query: cumulative_revenue
    x: month
    y: cumulative_revenue
    title: "Cumulative revenue"
```

### 4. Pie chart: revenue by product type

Pie (sector) charts show part-to-whole comparisons. This query splits revenue into food and drink. A sector chart uses `theta` for the wedge size and `color` for the category.

```yaml
queries:
  revenue_by_type:
    sql: |
      SELECT CASE WHEN is_food_item
                  THEN 'Food' ELSE 'Drink' END AS product_type,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1

charts:
  revenue_by_type:
    type: pie
    query: revenue_by_type
    theta: revenue
    color: product_type
    title: "Revenue by product type"
```

### 5. Table: location KPIs

Tables show detailed values. This query lists several columns per location for a scannable KPI table.

```yaml
queries:
  location_kpis:
    sql: |
      SELECT location_name,
             total_revenue,
             total_orders,
             avg_order_value
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC

charts:
  location_kpis_table:
    type: table
    query: location_kpis
    title: "Location KPIs"
```

## Lay out your board

Charts don't appear until you reference them in a layout. Boards use `rows:` to stack content vertically and `cols:` to place content side by side. Combine the queries and charts from the previous step under single `queries:` and `charts:` blocks, then add a layout that references each chart by its ID.

Your complete `charts/analytics.yml` should now look like this, with `MY_DATABASE.MY_SCHEMA` replaced by the database and schema that dbt built your marts into:

<File name='charts/analytics.yml'>

```yaml
title: "Jaffle Shop overview"
source: analytics

queries:
  revenue_by_month:
    sql: |
      SELECT date_trunc('month', ordered_at) AS month,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1
      ORDER BY 1
  revenue_by_location:
    sql: |
      SELECT location_name,
             total_revenue AS revenue
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC
  cumulative_revenue:
    sql: |
      SELECT month,
             sum(revenue) OVER (ORDER BY month) AS cumulative_revenue
      FROM (
        SELECT date_trunc('month', ordered_at) AS month,
               sum(product_price) AS revenue
        FROM MY_DATABASE.MY_SCHEMA.order_items
        GROUP BY 1
      )
      ORDER BY month
  revenue_by_type:
    sql: |
      SELECT CASE WHEN is_food_item
                  THEN 'Food' ELSE 'Drink' END AS product_type,
             sum(product_price) AS revenue
      FROM MY_DATABASE.MY_SCHEMA.order_items
      GROUP BY 1
  location_kpis:
    sql: |
      SELECT location_name,
             total_revenue,
             total_orders,
             avg_order_value
      FROM MY_DATABASE.MY_SCHEMA.location_performance
      ORDER BY total_revenue DESC

charts:
  revenue_trend:
    type: line
    query: revenue_by_month
    x: month
    y: revenue
    title: "Revenue by month"
  revenue_by_location:
    type: bar
    query: revenue_by_location
    x: location_name
    y: revenue
    title: "Revenue by location"
  cumulative_revenue:
    type: area
    query: cumulative_revenue
    x: month
    y: cumulative_revenue
    title: "Cumulative revenue"
  revenue_by_type:
    type: pie
    query: revenue_by_type
    theta: revenue
    color: product_type
    title: "Revenue by product type"
  location_kpis_table:
    type: table
    query: location_kpis
    title: "Location KPIs"

rows:
  - title: "Trends"
    cols:
      - revenue_trend
      - cumulative_revenue
  - title: "Locations"
    cols:
      - revenue_by_location
      - revenue_by_type
  - title: "Detail"
    rows:
      - location_kpis_table
```

</File>

Your project root should now contain:

```shell
fusion-jaffle-shop/
├── charts/
│   └── analytics.yml      # Your board
├── dbt_charts.yml         # dbt Charts project config
├── dbt_project.yml
├── models/
├── profiles.yml
└── seeds/
```

## Install dbt Charts and view your board

dbt Charts ships as a Python package with a command-line tool named `dct`.

1. Install dbt Charts with `uv`:

    ```bash
    uv tool install dbt-charts
    ```

    Or, with `pip`:

    ```bash
    pip install dbt-charts
    ```

2. From the project root, validate the board to catch YAML, reference, and SQL errors before it renders:

    ```bash
    dct validate
    ```

    With no arguments, `dct validate` checks every board under `charts/`. Pass a path &mdash; `dct validate charts/analytics.yml` &mdash; to check one.

3. Start the local development server:

    ```bash
    dct serve
    ```

    `dct` walks up from the current directory to find `dbt_charts.yml` or `dbt_project.yml`, infers the SQL dialect from your profile target, and picks a port derived from the project directory.

4. Open the URL `dct` prints. The page lists every board under `charts/`. Select `analytics.yml` to open yours.

    All five charts render across the three rows: the two trend charts side by side, the two location charts below them, and the KPI table at the bottom. The server hot-reloads as you edit YAML, so keep it running while you iterate.

5. Optionally, render static output to share or to inspect the compiled SQL:

    ```bash
    dct render charts/analytics.yml --format html
    ```

## Troubleshooting

- **`dbt_charts.yml` validation error: extra inputs are not permitted** &mdash; `dbt_charts.yml` accepts a fixed set of top-level keys, such as `sources` and `server`. Remove anything else, including a `name` key.
- **A chart shows no data** &mdash; Confirm your `profiles.yml` connection works (`dbt debug`) and that the profile's role can `SELECT` from the schemas your queries read.
- **Some charts show data but others are all zeros** &mdash; Check whether the empty charts read a model that your dev target filters. A common pattern limits development data to a recent time window, such as a `limit_in_dev` macro on orders. On a static demo dataset, that window can exclude every row and zero out the models downstream of it, while models without the filter still populate. Anchor the window to the data's own `max()` timestamp, widen it, or build against a target that skips the filter.
- **Table or view not found** &mdash; Confirm the database and schema prefix on each `FROM` matches where dbt actually builds the model. Run `dbt list --output json` and read `relation_name` to get the exact location.
- **Column not found** &mdash; A chart's channels (`x`, `y`, `theta`, `color`) must match the column names your query's `SELECT` returns. Alias columns in SQL so the names line up.
- **A chart renders blank** &mdash; Confirm the chart's `type` supports the channels you set. Sector charts (pie and donut) use `theta` and `color`, not `x` and `y`.
- **`dct validate` warns about re-aggregation** &mdash; The cumulative revenue query sums an already-aggregated column on purpose, so you can ignore this warning. `dct validate` still exits successfully.

## What's next

<ConfettiTrigger>

Congratulations 🎉! You built a dbt project locally, created your own dbt Charts directory and board file, wrote five charts from your dbt models, and previewed the board in your browser.

From here, you can:

- Add interactivity with [variables](https://docs.dataface.com/variables/) so viewers can filter by location or date range.
- Explore more [chart types](https://docs.dataface.com/charts/), such as small multiples, layered charts, and maps.
- Add more files under `charts/` &mdash; each one becomes its own page, so you can break a large dashboard into focused boards.
- Chart additional dbt models by adding more SQL queries, or explore other [query types](https://docs.dataface.com/queries/) such as values and HTTP sources.

</ConfettiTrigger>

</div>
