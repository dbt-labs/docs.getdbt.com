---
title: Build your first models
id: build-your-first-models
description: "Now that you've set up the starter project, you can get to the fun part — building models!"
---

Now that you set up your sample project and had a successful run, you can get to the fun part — [building models](building-models)! You will take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.

## Checkout a new git branch

1. Make sure you're in the Develop interface. If you're not, click ![hamburger icon](/img/hamburger-icon.png), then click `Develop`. The master branch should now be set to read-only mode, so you'll need to create a new branch.

2. Click **+ create new branch**, and name your branch `add-customers-model`.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/checkout-branch-dbt-cloud.png" title="Checkout a new branch" />
    </div>

## Build your first model

1. If you're not already in the Develop interface, click ![hamburger icon](/img/hamburger-icon.png), and then `Develop`.
2. Click the `models` directory, then click ![kebob icon](/img/kebob-menu.png), then select **New file**.  
3. Name the file `models/customers.sql`, then click **Create**.
4. Paste the following query into the file and click **save**.
    
    <Snippet src="tutorial-sql-query" />

5. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see three models under DETAILS:
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/first-model-dbt-cloud.png" title="A successful run with dbt Cloud" />
    </div>

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

Once you build your first model, you're ready to [test and document your project](guides/getting-started/building-your-first-project/test-and-document-your-project).

<Snippet src="tutorial-next-steps-1st-model" />
