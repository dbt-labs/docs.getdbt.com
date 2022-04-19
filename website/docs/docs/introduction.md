---
title: "What is dbt?"
id: "introduction"
---

dbt (data build tool) enables analytics engineers to transform data in their warehouses by simply writing select statements. dbt handles turning these select statements into tables and views.

dbt does the `T` in `ELT` (Extract, Load, Transform) processes – it doesn’t extract or load data, but it’s extremely good at transforming data that’s already loaded into your warehouse.

The role of dbt within a modern data stack is discussed in more detail [here](https://blog.fishtownanalytics.com/what-exactly-is-dbt-47ba57309068).

dbt also enables analysts to work more like software engineers, in line with the dbt [Viewpoint](viewpoint).

## How do I use dbt?

### dbt Projects
A dbt project is a directory of `.sql` and .`yml` files. The directory must contain at a minimum:
* Models: A model is a single `.sql` file. Each model contains a single `select` statement that either transforms raw data into a dataset that is ready for analytics, or, more often, is an intermediate step in such a transformation.
* A project file: a `dbt_project.yml` file which configures and defines your dbt project.

Projects typically contain a number of other resources as well, including tests, snapshots, and seed files (see [below](#what-else-can-dbt-do)).

Whether you are starting a project from scratch, or if your organization already has a dbt project, see the docs on [projects](projects) for more information on getting started.

:::info Check out our sample dbt project

Want to check out a sample project? Have a look at our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop) project on GitHub!

:::

### Database Connections
dbt connects to your data warehouse to run data transformation queries. As such, you’ll need a data warehouse with source data loaded in it to use dbt. dbt natively supports connections to Snowflake, BigQuery, Redshift and Postgres data warehouses, and there’s a number of community-supported adapters for other warehouses (see [docs](available-adapters)).

When you define your connection, you’ll also be able to specify the target schema where dbt should create your models as tables and views. See [Managing environments](managing-environments)  for more information on picking target schema names.


### dbt Commands
A command is an instruction to execute dbt which compiles and runs SQL against the database.

When you issue a dbt command, such as `run`, dbt:

1. Determines the order to execute the models in your project in.
2. Generates the DDL required to build the model, as per the model's *materialization*
3. Executes the compiled queries against your data warehouse, using the credentials specified in the *target* defined in your *profile*. Executing these queries creates relations in the target schema in your data warehouse. These relations contain transformed data, ready for analysis.

A list of commands can be found in the [Command reference](dbt-commands) section of these docs.

## What does the workflow for using dbt look like?
There’s two main ways of working with dbt -- using the web-based Integrated Development Environment (IDE) in dbt Cloud, or using the Command Line Interface (CLI).

### Developing in dbt Cloud
To get started with a project and connection, follow the onboarding flow. Use the web editor to build your project and execute dbt commands. If you don't have one already, you can sign up for a [free account](https://www.getdbt.com/signup).

### Developing locally with the Command Line Interface (CLI)
To use the CLI:

1. Follow [these instructions](dbt-cli/install/overview) to install the dbt CLI
2. [Set up a profile](configure-your-profile) to connect to your data warehouse
3. Build your dbt project in a code editor, like Atom or VSCode
4. Execute commands using your terminal

:::info Developing locally?

If you’re developing your dbt project locally, we recommend checking out [this article](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243) to understand how we set up our computers.

:::

## What makes dbt so powerful?
As a dbt user, your main focus will be on writing models (i.e. select queries) that reflect core business logic – there’s no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you.

**dbt handles boilerplate code to materialize queries as relations.**
For each model you create, you can easily configure a *materialization*.

A materialization represents a build strategy for your select query – the code behind a materialization is robust, boilerplate SQL that wraps your select query in a statement to create a new, or update an existing, relation.

dbt ships with the following built-in materializations:
* `view` (default): The model is built as a view in the database.
* `table`: The model is built as a table in the database.
* `ephemeral`: The model is not directly built in the database, but is instead pulled into dependent models as common table expressions.
* `incremental`: The model is initially built as a table, and in subsequent runs, dbt inserts new rows and updates changed rows in the table.

Custom materializations can also be built if required.

**dbt determines the order of model execution.**
Often when transforming data, it makes sense to do so in a staged approach. dbt provides a mechanism to implement transformations in stages through the [ref](ref) function.

Rather than selecting from existing tables and views in your warehouse, you can select from _another model_, like so:

<File name='/models/orders.sql'>

```sql
select
  orders.id,
  orders.status,
  sum(case when payments.payment_method = 'bank_transfer' then payments.amount else 0 end) as bank_transfer_amount,
  sum(case when payments.payment_method = 'credit_card' then payments.amount else 0 end) as credit_card_amount,
  sum(case when payments.payment_method = 'gift_card' then payments.amount else 0 end) as gift_card_amount,
  sum(amount) as total_amount

from {{ ref('base_orders') }} as orders
left join {{ ref('base_payments') }} as payments on payments.order_id = orders.id
```

</File>

When compiled to executable SQL, dbt will replace the model specified in the `ref` function with the relation name.

Importantly, dbt also uses the `ref` function to determine the sequence in which to execute the models – in the above example, `base_orders` and `base_payments` need to be built prior to building the `orders` model.

<Lightbox src="/img/docs/2ce8dce-Screen_Shot_2018-09-16_at_11.46.12_AM.png" title="A DAG for a simple dbt project"/>

dbt builds a directed acyclic graph (DAG) based on the interdepencies between models – each node of the graph represents a model, and edges between the nodes are defined by `ref` functions, where a model specified in a `ref` function is recognized as a predecessor of the current model.

When dbt runs, models are executed in the order specified by the DAG – there’s no need to explicitly define the order of execution of your models. Building models in staged transformations also reduces the need to repeat SQL, as a single transformation (for example, renaming a column) can be shared as a predecessor for a number of downstream models.

For more information see [Ref](ref).

:::info Want to see a DAG visualization for your project?

Check out the [Documentation Website](documentation) docs

:::

## What else can dbt do?
dbt has a number of additional features that make it even more powerful, including:


**Code compiler:**
In dbt, SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures (e.g. `if` statements and `for` loops) in your queries. It also enables repeated SQL to be shared through `macros`.

The power of using Jinja in your queries is discussed in [Using Jinja](using-jinja).


**Documentation:**
dbt provides a mechanism to write, version-control, and share documentation for your dbt models. Descriptions (in plain text, or markdown) can be written for each model and field.

These descriptions, along with additional implicit information (for example, the model lineage, or the field data type and tests applied), can be generated as a website and shared with your wider team, providing an easily referenceable databook for anyone that interacts with dbt models.

For more information see [Documentation](documentation).

**Tests:**
SQL can be difficult to test, since the underlying data is frequently changing. dbt provides a way to improve the integrity of the SQL in each model by making assertions about the results generated by a model. Out of the box, you can test whether a specified column in a model only contains:

* Non-null values
* Unique values
* Values that have a corresponding value in another model (e.g. a `customer_id` for an `order` corresponds to an `id` in the `customers` model)
* Values from a specified list

Tests can be easily extended to suit business logic specific to your organization – any assertion that you can make about your model in the form of a select query can be turned into a test.

To learn more about writing tests for your models, see [Testing](building-a-dbt-project/tests).


**Package management:**
dbt ships with a package manager, which allows analysts to use and publish both public and private repositories of dbt code which can then be referenced by others.

This means analysts can leverage libraries that provide commonly-used macros like [dbt_utils](https://github.com/dbt-labs/dbt-utils), or dataset-specific projects for software services like [Snowplow](https://github.com/dbt-labs/snowplow) and [Stripe](https://github.com/dbt-labs/stripe), to hit the ground running.

For more information, see [Package Management](package-management).


**Seed file loader:**
Often in analytics, raw values need to be mapped to a more readable value (e.g. converting a country-code to a country name) or enriched with static, or infrequently changing data (e.g. using revenue targets set each year to assess your actuals).

These data sources, known as seed files, can be saved as a CSV file in your `project` and loaded into your data warehouse through use of the `seed` command.

The documentation for the seed command can be found [here](seeds).


**Data snapshots:**
Often, records in a data source are mutable, in that they change over time. This can be difficult to handle in analytics if you want to reconstruct historic values.

dbt provides a mechanism to snapshot raw data for a point in time, through use of [snapshots](snapshots).


**Understand raw data sources:**
Since dbt selects from raw data already loaded in your data warehouse, it's useful to understand the role of these tables and schemas within your warehouse. Defining raw data as a Source in dbt allows you to:
* Document and test the data that is loaded into your warehouse
* Check the freshness of your data against specified limits, to help identify upstream issues.
* Understand which models depend on each data source.

Check out the [documentation on Sources](using-sources).


## Who should use dbt?
dbt is appropriate for anyone who interacts with a data warehouse. It can be used by data engineers, data analysts and data scientists, or anyone that knows how to write select queries in SQL.

For dbt users that are new to programming, you may also need to spend some time getting to know the basics of the command line, and familiarizing yourself with git.

To make full use of dbt, it may also be beneficial to know some programming basics, such as `for` loops and `if` statements, to use Jinja effectively in your models.
