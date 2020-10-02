---
title: "Best practices"
id: "best-practices"
---

This page contains the collective wisdom of experienced users of dbt on how to best use it in your analytics work. Observing these best practices will help your analytics team work as effectively as possible, while implementing the pro-tips will add some polish to your dbt projects!

## Best practice workflows
### Version control your dbt project
All dbt projects should be managed in version control. Git branches should be created to manage development of new features and bug fixes. All code changes should be reviewed by a colleague (or yourself) in a Pull Request prior to merging into `master`. 

:::info Git guide

We've codified our best practices in Git, in our [Git guide](https://github.com/fishtown-analytics/corp/blob/master/git-guide.md).

:::

### Use separate development and production environments
dbt makes it easy to maintain separate production and development environments through the use of target within a profile. We recommend using a `dev` target when running dbt from your command line, and only running against a `prod` target when running from a production deployment. You can read more [about managing environments](managing-environments).

### Use a style guide and code conventions for your project
SQL styles, field naming conventions, and other rules for your dbt project should be codified, especially on projects where multiple dbt users are writing code.

:::info Coding conventions

We've made our [coding conventions](https://github.com/fishtown-analytics/corp/blob/master/dbt_coding_conventions.md) public – these can act as a good starting point for your own coding conventions.

:::


## Best practices in dbt projects
### Use the ref function
The [ref](ref) function is what makes dbt so powerful! Using the `ref` function allows dbt to infer dependencies, ensuring that models are built in the correct order. It also ensures that your current model selects from upstream tables and views in the same environment that you're working in.
Always use the `ref` function when selecting from another model, rather than using the direct relation reference (e.g. `my_schema.my_table`).

### Limit references to raw data
Your dbt project will depend on raw data stored in your database. Since this data is normally loaded by third parties, the structure of it can change over time – tables and columns may be added, removed, or renamed. When this happens, it is easier to update models if raw data is only referenced in one place.

:::info Using sources for raw data references

As of v0.13.0, we recommend defining your raw data as [sources](using-sources), and selecting from the source rather than using the direct relation reference. Our dbt projects no longer contain any direct relation references in any models.

:::

### Rename and recast fields once
Raw data is generally stored in a source-conformed structure, that is, following the schema and naming conventions that the source defines. Not only will this structure differ between different sources, it is also likely to differ from the naming conventions you wish to use for analytics.

The first layer of transformations in a dbt project should:
* Select from only one source
* Rename fields and tables to fit the conventions you wish to use within your project, for example, ensuring all timestamps are named `<event>_at`. These conventions should be declared in your project coding conventions (see above).
* Recast fields into the correct data type, for example, changing dates into UTC and prices into dollar amounts.

All subsequent data models should be built on top of these models, reducing the amount of duplicated code.


:::info What happened to base models?

Earlier versions of this documentation recommended implementing “base models” as the first layer of transformation, and gave advice on the SQL within these models. We realized that while the reasons behind this convention were valid, the specific advice around "base models" represented an opinion, so we moved it out of the official documentation.

You can instead find our opinions on how we structure our dbt projects in [this Discourse article](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355).

:::

### Break complex models up into smaller pieces
Complex models often include multiple Common Table Expressions (CTEs). In dbt, you can instead separate these CTEs into separate models that build on top of each other. It is often a good idea to break up complex models when:
* A CTE is duplicated across two models. Breaking the CTE into a separate model allows you to reference the model from any number of downstream models, reducing duplicated code.
* A CTE changes the grain of a the data it selects from. It's often useful to test any transformations that change the grain (as in, what one record represents) of your data. Breaking a CTE into a separate model allows you to test this transformation independently of a larger model.
* The SQL in a query contains many lines. Breaking CTEs into separate models can reduce the cognitive load when another dbt user (or your future self) is looking at the code.

### Group your models in directories
Within your `models/` directory, you can have any number of nested subdirectories. We leverage directories heavily, since using a nested structure within directories makes it easier to:
* Configure groups of models, by specifying configurations in your `dbt_project.yml` file.
* Run subsections of your DAG, by using the [model selection syntax](node-selection/syntax).
* Communicate modeling steps to collaborators
* Create conventions around the allowed upstream dependencies of a model, for example, "models in the `marts` directory can only select from other models in the `marts` directory, or from models in the `staging` directory".

### Add tests to your models
dbt provides a framework to test assumptions about the results generated by a model. Adding tests to a project helps provide assurance that both:
* your SQL is transforming data in the way you expect, and
* your source data contains the values you expect

:::info Recommended tests

Our [coding conventions](https://github.com/fishtown-analytics/corp/blob/master/dbt_coding_conventions.md) recommend that at a minimum, every model should have a primary key that is tested to ensure it is unique, and not null.

:::

### Consider the information architecture of your data warehouse
When a user connects to a data warehouse via a SQL client, they often rely on the names of schemas, relations, and columns, to understand the data they are presented with. To improve the information architecture of a data warehouse, we:
* Use [custom schemas](using-custom-schemas) to separate relations into logical groupings, or hide intermediate models in a separate schema. Generally, these custom schemas align with the directories we use to group our models, and are configured from the `dbt_project.yml` file.
* Use prefixes in table names (for example, `stg_`, `fct_` and `dim_`) to indicate which relations should be queried by end users.

### Choose your materializations wisely
[Materializations](materializations) determine the way models are built through configuration. As a general rules:
* Views are faster to build, but slower to query compared to tables.
* Incremental models provide the same query performance as tables, are faster to build compared to the table materialization, however they introduce complexity into a project.

We often:
* Use views by default
* Use ephemeral models for lightweight transformations that shouldn't be exposed to end-users
* Use tables for models that are queried by BI tools
* Use tables for models that have multiple descendants
* Use incremental models when the build time for table models exceeds an acceptable threshold 

## Pro-tips for workflows
### Use the model selection syntax when running locally
When developing, it often makes sense to only run the model you are actively working on and any downstream models. You can choose which models to run by using the [model selection syntax](node-selection/syntax).

### Run only modified models to test changes ("slim CI")
To merge code changes with confidence, you want to know that those changes will not cause breakages elsewhere in your project. For that reason, we recommend running models and tests in a sandboxed environment, separated from your production data, as an automatic check in your git workflow. (If you use GitHub and dbt Cloud, read about [how to set up CI jobs](cloud-enabling-continuous-integration-with-github).)

<Changelog>New in v0.18.0</Changelog>

By comparing to artifacts from a previous production run, dbt can determine
which models are modified and build them on top of of their unmodified parents.

```bash
dbt run -m state:modified+ --defer --state path/to/prod/artifacts
dbt test -m state:modified+
```

:::info [β] Beta Feature
This is net-new functionality in v0.18.0, with iterative improvements to come.
You may need to adjust syntax for your project. If you encounter unexpected 
behavior, please post in Slack or open an issue.
:::

For more details, see the docs on [deferred runs](run#deferring-to-previous-run-state) and [the state selection method](node-selection/methods#the-state-method).

## Pro-tips for dbt Projects
### Limit the data processed when in development
In a development environment, faster run times allow you to iterate your code more quickly. We frequently speed up our runs by using a pattern that limits data based on the [target](target) name:
```sql
select
*
from event_tracking.events
{% if target.name == 'dev' %}
where created_at >= dateadd('day', -3, current_date)
{% endif %}
```

### Use hooks to manage privileges on objects that dbt creates
Use `grant` statements from [hooks](hooks-operations) to ensure that permissions are applied to the objects created by dbt. By codifying these grant statements in hooks, you can version control and repeatably apply these permissions.


:::info Recommended grant statements

We've shared the exact grant statements we use over on [Discourse](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)

:::

### Separate source-centric and business-centric transformations
When modeling data, we frequently find there are two stages:

1. Source-centric transformations to transform data from different sources into a consistent structure, for example, re-aliasing and recasting columns, or unioning, joining or deduplicating source data to ensure your model has the correct grain; and
2. Business-centric transformations that transform data into models that represent entities and processes relevant to your business, or implement business definitions in SQL.

We find it most useful to separate these two types of transformations into different models, to make the distinction between source-centric and business-centric logic clear.

### Managing whitespace generated by Jinja
If you're using macros or other pieces of Jinja in your models, your compiled SQL (found in the `target/compiled` directory) may contain unwanted whitespace. Check out the [Jinja documentation](http://jinja.pocoo.org/docs/2.10/templates/#whitespace-control) to learn how to control generated whitespace.
