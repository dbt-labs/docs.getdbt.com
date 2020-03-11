---
title: "Create a project"
id: "creating-a-project"
---



## Creating a dbt project
To create your first dbt project, run:

```bash
$ dbt init [project-name]
```

This will create a new directory in your current path (i.e. at `./[project-name]`) with a [starter project](https://github.com/fishtown-analytics/dbt-starter-project). The starter project contains default configurations as well as helpful notes to get you started.

## Understanding projects
### What is a dbt project?
A project is a directory of `.sql` and .`yml` files. The directory must contain at a minimum:
* Models: A model is a single `.sql` file. Each model contains a single `select` statement that either transforms raw data into a dataset that is ready for analytics, or, more often, is an intermediate step in such a transformation.
* A project file: a `dbt_project.yml` file which specifies how dbt operates on your project.

### How should I structure my dbt project?
How you structure your dbt project is up to you! If you're just getting started, check out [our guide](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355) on how we structure our projects, and check out our [demonstration project](https://github.com/fishtown-analytics/jaffle_shop/tree/demo/master).