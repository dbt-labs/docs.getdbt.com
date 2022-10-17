---
title: Build your first models
id: build-your-first-models
description: "Now that you've set up the starter project, you can get to the fun part — building models!"
---

Now that you set up your sample project and had a successful run, you can get to the fun part — [building models](/docs/build/sql-models)! You will take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.

## Checkout a new git branch

1. Click **Develop** from the upper left of dbt Cloud. You need to create a new branch since the main branch is now set to read-only mode. 

2. Click **Create branch**, and name your branch `add-customers-model`.
  
    <Lightbox src="/img/create-branch-new-ide.png" title="Checkout a new branch" />


## Build your first model

1. Click **Develop** from the upper left of dbt Cloud.
2. Click the **...** next to the Models directory, then select **Create file**.  
3. Name the file `models/customers.sql`, then click **Create**.
4. Copy the following query into the file and click **Save File**.

    <Snippet src="tutorial-sql-query" />

5. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see three models under DETAILS.

In the future, you would connect your business intelligence (BI) tools to these views and tables so they only read cleaned up data rather than raw data in your BI tool.

#### FAQs

<FAQ src="Runs/checking-logs" />
<FAQ src="Project/which-schema" />
<FAQ src="Models/create-a-schema" />
<FAQ src="Models/run-downtime" />
<FAQ src="Troubleshooting/sql-errors" />

## Change the way your model is materialized

<Snippet src="tutorial-change-way-model-materialized" />

## Delete the example models

<Snippet src="tutorial-delete-example-models" />

## Build models on top of other models

<Snippet src="tutorial-build-models-atop-other-models" />

## Next steps

Once you build your first model, you're ready to [test and document your project](/docs/get-started/getting-started/building-your-first-project/test-and-document-your-project).

<Snippet src="tutorial-next-steps-1st-model" />
