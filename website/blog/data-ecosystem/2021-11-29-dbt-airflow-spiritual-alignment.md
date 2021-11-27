---
title: "The spiritual alignment of dbt + Airflow"
description: "Airflow and dbt are often framed as either / or, but in practice I've experienced them to play extremely well together."
slug: dbt-airflow-spiritual-alignment

authors: [sung]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2021-11-29
is_featured: true
---

Airflow and dbt are often framed as either / or: 

You either build SQL transformations using Airflow’s SQL database operators (like [SnowflakeOperator](https://airflow.apache.org/docs/apache-airflow-providers-snowflake/stable/operators/snowflake.html)), or develop them in a dbt project. 

You either orchestrate dbt models in Airflow, or you deploy them using dbt Cloud.

In my experience, these are false dichotomies, that sound great as hot takes but don’t really help us do our jobs as data people. 

In my days as a data consultant and now as a member of the dbt Labs Solutions Architecture team, I’ve frequently seen Airflow, dbt Core & dbt Cloud ([via the API](https://docs.getdbt.com/dbt-cloud/api-v2)) blended as needed, based on the needs of a specific data pipeline, or a team’s structure and skillset.

More fundamentally, I think it’s important to call out that Airflow + dbt are **spiritually aligned**inpurpose. They both exist to facilitate clear communication across data teams, in service of producing trustworthy data.

Let’s dive a bit deeper into that spiritual alignment, hone in on a couple cases where they play nicely, and then dive into the nitty gritty of which combination of Airflow + dbt might be right for your team.

## Where Airflow + dbt align

Let’s walk through a hypothetical scenario I’d run into as a consultant, to illustrate how Airflow + dbt operate on a parallel spiritual wavelength.

TL;DR: they both provide **common interfaces** that data teams can use to get on the same page. 

The intricacies of when I’ve found each to be useful (Airflow alone, Airflow w/ dbt Core or Cloud, dbt Core or Cloud alone) is in _which team members_ need to get on the same page—I’ll get to that in the next section.

### From the Airflow side

A client has 100 data pipelines running via a cron job in a GCP (Google Cloud Platform) virtual machine, every day at 8am. 

It was simple to set up, but then the conversation started flowing:

* “Where am I going to put logs?”  In a Google Cloud Storage bucket.
* “Where can I view history in a table format?”  Let’s export log events into BigQuery.
* “I have to create log alerts to notify people of failures.”  Let’s use GCP’s logging alerts to send emails.
* “When something fails, how do you rerun from the point of failure?”  Let’s mangle the production script. 

Over time, you end up building a bunch of pieces that Airflow provides out of the box.

But what makes one come alive as a data engineer—is it fine-tuning logging and making sure that the basic overhead of your pipeline works, or is it getting trustworthy data to the people you’re working with?

Airflow solves those same problems, but in a publicly-verifiable and trusted way—it provides **a common interface** by which data teams can get on the same page about overall data pipeline health. And that common interface is configured in code + version-controlled.

### From the dbt side

That pipeline above included a plethora of data transformation jobs, built in various ways.

They were often written in naked python scripts that only ran a SQL query + wrote data to BigQuery. These stored procedure-like SQL scripts required:

* Writing boilerplate DDL (`CREATE TABLE` etc * 1000) 
* Managing schema names between production and dev environments
* Manually managing dependencies between scripts

Again, this is **pretty easy to set up**, but it doesn’t get to the heart of the matter: getting trusted data to the people that you care about. 

It _kind of _works, but you need it to _really work_ in a way that’s publicly observable + verifiable via testing. 

I have never encountered a client writing a script to auto-generate DDL, or writing boilerplate tests for SQL—no one wants these to be their job.

So like Airflow for pipeline orchestration, dbt does these things out of the box for the data transformation layer.

dbt provides a **common interface** where data teams can get on the same page about the business logic + run status of data transformations—again, in a way that’s configured in code + version-controlled.

> If you’re curious about the migration path from a stored procedure-based transformation workflow to modular data modeling in dbt, check out my colleagues Sean McIntyre + Pat Kearns writing on [migrating to an ELT pipeline](https://getdbt.com/analytics-engineering/case-for-elt-workflow/). 

## A note on data team roles for Airflow + dbt

In my experience, these tech decisions also boil down to the **[data team structure](https://www.getdbt.com/data-teams/data-org-structure-examples/)** you’re building around, and specifically the **skills** + **training** baked into that structure. 

Tools are cheap relative to hiring + training, so I’ve most often seen tool decisions made by the availability of staff + training support, rather than the technical specs or features of the tools themselves. So let’s peek into what roles are required to build around dbt and Airflow (these same skills would also roughly map to any other orchestration tool).

Many of us define roles like [data engineer](https://www.getdbt.com/data-teams/hiring-data-engineer/), [analytics engineer](https://getdbt.com/what-is-analytics-engineering/) and data analyst differently.  

So instead of getting bogged down in defining roles, let’s focus on hard skills I’ve seen in practice.

![airflow and dbt skills required](/img/blog/airflow-dbt-skills.png "airflow and dbt skills required")

The common skills needed for implementing any flavor of dbt (Core or Cloud) are:

* SQL: ‘nuff said
* YAML: required to generate config files for [writing tests on data models](/docs/building-a-dbt-project/tests)
* [Jinja](/tutorial/using-jinja): allows you to write DRY code (using [macros](/docs/building-a-dbt-project/jinja-macros), for loops, if statements, etc)

YAML + Jinja can be learned pretty quickly, but SQL is the non-negotiable you’ll need to get started.

SQL skills are generally shared by data people + engineers, which makes SQL-based transformations (as in dbt) a ripe common interface for collaboration.

To layer on Airflow, you’ll need more software or infrastructure engineering-y skills to build + deploy your pipelines: Python, Docker, Bash (for using the Airflow CLI), Kubernetes, Terraform and secrets management.

## How Airflow + dbt play nicely 

Knowing that this toolbelt (Airflow + dbt) provides sustenance to the same spiritual needs (public observability, configuration as code, version control etc), how might one decide when and where to deploy them?

> This is the same sensibility expressed in the [dbt viewpoint](/docs/about/viewpoint) in 2016, the closest thing to a founding blog post as exists for dbt. ] 

I usually think in terms of how I want my job to look when things go wrong—am I equipped to do the debugging, and is it clear who to pass the baton to, to fix the issue (if it’s not me)?

A couple examples:

### Pipeline observability for analysts

If your team’s dbt users are analysts rather than engineers, they still may need to be able to dig into the root cause of a failing dbt [source freshness test](/docs/dbt-cloud/using-dbt-cloud/cloud-snapshotting-source-freshness). 

Having your upstream extract + load jobs configured in Airflow means that analysts can pop open the Airflow UI to monitor for issues (as they would a GUI-based [ETL tool](https://www.getdbt.com/analytics-engineering/etl-tools-a-love-letter/)), rather than opening a ticket or bugging an engineer in Slack. The Airflow UI provides the common interface that analysts need to self-serve, up to the point of action needing to be taken.

![airflow dashboard](/img/blog/airflow-dbt-dashboard.png "airflow dashboard")

### Transformation observability for engineers

When a dbt run fails within an Airflow pipeline, an engineer monitoring the overall pipeline will likely not have the business context to understand why the individual model or test failed—they were probably not the one who built it.

dbt provides common programmatic interfaces (the [dbt Cloud Admin + Metadata APIs](/docs/dbt-cloud/dbt-cloud-api/cloud-apis), and [.json-based artifacts](/reference/artifacts/dbt-artifacts) in the case of dbt Core) that provide the context needed for the engineer to self-serve—either by rerunning from a point of failure or reaching out to the owner.

![dbt run log](/img/blog/airflow-dbt-run-log.png "dbt run log")

## Why I ❤️ dbt Cloud + Airflow

dbt Core is a fantastic framework for developing data transformation + testing logic. It is less fantastic as a shared interface for data analysts + engineers to collaborate **_on production runs of transformation jobs_**.

dbt Cloud picks up that baton, and provides a common interface where teams can configure runs + debug issues in production jobs. 

If you productionalize your dbt runs in Airflow using the dbt Core operator, you run into the same `SQL wrapped in Python` communication challenge I mentioned at the top: the analyst who built the transformation logic is in the dark about the production run workflow, which is spiritually the thing we’re trying to avoid here.

### dbt Core + Airflow

Let’s take a look at an example, from GitLab’s `[dbt_full_refresh](https://gitlab.com/gitlab-data/analytics/-/blob/master/dags/transformation/dbt_full_refresh.py)` Airflow pipeline. 

If this task fails in the Airflow pipeline, there are a number of aspects of the pipeline to debug: was it an issue with Kubernetes or secrets, the Docker image, or the dbt transformation code itself?

An analyst will be in the dark when attempting to debug this, and will need to rely on an engineer to tap them on the shoulder in the event that the issue lies with dbt.

This can be perfectly ok, in the event your data team is structured for data engineers to exclusively own dbt modeling duties, but that’s a quite uncommon org structure pattern from what I’ve seen. And if you have easy solutions for this analyst-blindness problem, I’d love to hear them.

### dbt Cloud + Airflow

With dbt Cloud and its aforementioned [APIs](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/cloud-apis), any dbt user can configure dbt runs from the UI.

In Airflow, engineers can then call the API, and everyone can move on with their lives. This allows the API to be a programmatic interface between analysts and data engineers, vs relying on the human interface.

If you look at what this practically looks like in code (my [airflow-toolkit repo is here](https://github.com/sungchun12/airflow-toolkit/blob/demo-sung/dags/examples/dbt_cloud_example.py)), just a few settings need to be configured after you create the initial python API call: [here](https://github.com/sungchun12/airflow-toolkit/blob/95d40ac76122de337e1b1cdc8eed35ba1c3051ed/dags/dbt_cloud_utils.py)

```

dbt_cloud_job_runner_config = dbt_cloud_job_runner(

    account_id=4238, project_id=12220, job_id=12389, cause=dag_file_name

)

```

If the operator fails, it’s an Airflow problem. If the dbt run returns a model or test failure, it’s a dbt problem and the analyst can be notified to hop into the dbt Cloud UI to debug.

This creates a much more natural baton pass, and clarity on who needs to fix what.

And if my goal is to ship trusted data, I opt for that simplicity + clarity every time. 

But there are no right or wrong decisions here! Any combination of tools that solves the problem of delivering trusted data for your team is the right choice.
