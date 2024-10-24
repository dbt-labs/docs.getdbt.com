---
title: "Quickstart for dbt Cloud and Amazon Athena"
id: "athena"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'athena'
hide_table_of_contents: true
tags: ['Amazon','Athena', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with BigQuery. It will show you how to: 

- Create an S3 bucket for Athena query results.
- Creat an Athena database.
- Access sample data in a public dataset.
- Connect dbt Cloud to Amazon Athena.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

:::tip Videos for you
You can check out [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) for free if you're interested in course learning with videos.
:::

### Prerequisites​

- You have a [dbt Cloud account](https://www.getdbt.com/signup/). 
- You have an [AWS account](https://aws.amazon.com/).
- You have set up [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/getting-started.html).

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Getting started

Download these CSV files (the Jaffle Shop sample data) that you will need for this guide:
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

### Set up the S3 bucket

You can use an existing or create a new S3 bucket for these steps.

1. Log into your AWS account and navigate to the **Athena console**.
    - If this is your first time in the Athena console (in your current AWS Region), click **Explore the query editor** to open the query editor. Otherwise, Athena opens automatically in the query editor.
1. Open **Settings** and find the **Location of query result box** field.