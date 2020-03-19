---
title: "Projects"
id: "projects"
---
## Getting started
A dbt project is a directory of `.sql` and `.yml` files, which dbt uses to transform your data. At a minimum, a dbt project must contain:
* A project file: A `dbt_project.yml` file tells dbt that a particular directory is a dbt project, and also contains configurations for your project.
* [Models](building-models): A model is a single `.sql` file. Each model contains a single select statement that either transforms raw data into a dataset that is ready for analytics, or, more often, is an intermediate step in such a transformation.

A project may also contain a number of other resources, such as [snapshots](snapshots), [seeds](seeds), [tests](testing), [macros](macros), [documentation](documentation), and [sources](using-sources).

## Creating a dbt project

<Callout type="info" title="Creating your first dbt project">

If you're new to dbt, check out our [Getting Started Tutorial](tutorial/1-setting-up.md) to build your first dbt project.

</Callout>


### dbt CLI
To create your first dbt project, run:

```bash
$ dbt init [project-name]
```

This will create a new directory in your current path (i.e. at `./[project-name]`) with a [starter project](https://github.com/fishtown-analytics/dbt-starter-project). The starter project contains default configurations as well as helpful notes to get you started.



### dbt Cloud
* to Do

## Using an existing project

### dbt CLI

This guide assumes your organization already has a dbt project hosted on GitHub / GitLab / BitBucket / etc. If you're not sure if your project is already hosted on one of these services, or if you don't have access to the repository, you should check with your account administrator.


If you're using the git CLI, you'll need to set up git authentication. GitHub has [an excellent overview of how this works](https://help.github.com/articles/connecting-to-github-with-ssh/), and a [simple guide on how to quickly get set up](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

Once you've set up your SSH keys for git, you can make a clone of your dbt project with:

```bash
git clone git@github.com:your-organization/your-dbt-project.git
```

## Related documentation
* [`dbt_project.yml` configurations](reference/dbt_project.yml.md)
* The `dbt init` [command](running-a-dbt-project/command-line-interface/init.md)


## FAQS
<FAQ src="structure-a-project" />

### How do I create a dbt project?
If you're creating a dbt project from scratch, use the [init command](init)! This creates a `dbt_project.yml` file with default configurations, as well as a basic directory structure for your project.

### How do I run a dbt project?
dbt projects are run via the command line – check out the docs on the [command line interface](command-line-interface) for more information.

### What goes in the dbt_project.yml file?
Your `dbt_project.yml` file contains configurations for your project, including:
* **Project details**: Values that describe your project, such as your project `name` and `version`.
* **Connection configurations**: The default profile for the project
* **File path configurations**: Values that tell dbt how to operate on your project, such:
  * Resource paths, for example `model-paths`, that tell dbt where it should read files that define each of the resources in your project.
  * Target paths, that tell dbt where to write files to, including compiled SQL, and logs.
* **Resource configurations**: You can configure resources (models, seeds, etc.) from your `dbt_project.yml` file – check out the docs on configuring resources [here](configuring-models).
* **Run hooks**: [Hooks](hooks) are snippets of SQL, often used to perform tasks like granting privileges, or inserting audit records. You can invoke hooks at the start or end of a dbt run, by defining them as `on-run-start` and `on-run-end` hooks.
