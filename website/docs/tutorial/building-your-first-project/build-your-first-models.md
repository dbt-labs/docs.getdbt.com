---
title: Build your first models
id: build-your-first-models
description: "Now that you've set up the starter project, you can get to the fun part — building models!"
---

Now that you set up your sample project, you can get to the fun part — [building models](building-models)! You will take a sample query and turn it into a model in your dbt project.

## Checkout a new git branch

1. Ensure you're in the Develop interface. If you're not, click the hamburger menu, and then `Develop`. The master branch should now be set to "read only" mode, so you'll need to create a new branch.

2. Click the "create new branch" button, and name your branch `add-customers-model`.

<Lightbox src="/img/checkout-branch-dbt-cloud.png" title="Checkout a new branch" />

## Build your first model

<LoomVideo id="09919ddb02e44015878c9e93e15fe792" />

1. Ensure you're in the Develop interface. If you're not, click the hamburger menu, and then `Develop`.
2. Create a new file in the `models` directory named `models/customers.sql`.
3. Paste the query from the [Setting up](/tutorial/getting-set-up) instructions into the file.
4. Execute `dbt run` in the command prompt at the bottom of the screen. You should get a successful run, like so:

<Lightbox src="/img/first-model-dbt-cloud.png" title="A successful run with dbt Cloud" />

If you switch back to the BigQuery console you'll be able to `select` from this model.
#### FAQs

<FAQ src="checking-logs" />
<FAQ src="which-schema" />
<FAQ src="create-a-schema" />
<FAQ src="run-downtime" />
<FAQ src="sql-errors" />

## Change the way your model is materialized

One of the most powerful features of dbt is that you can change the way a model is materialized in your warehouse, simply by changing a configuration value. Let's see this in action.

<LoomVideo id="fbaa9948dccf4f74a17ffc7de1ddf4f2" />

<Snippet src="tutorial-change-way-model-materialized" />

## Delete the example models

<Snippet src="tutorial-delete-example-models" />

<LoomVideo id="093d46e965994cb6a13e8a98559f6f9f" />

## Build models on top of other models

<Snippet src="tutorial-build-models-atop-other-models" />

<LoomVideo id="cf070e26faa3423e80338e6a918ae9f8" />

## Next steps

Once you build your first model, you're ready to [test and document your project](tutorial/building-your-first-project/test-and-document-your-project).

<Snippet src="tutorial-next-steps-1st-model" />

<LoomVideo id="8e9ff6e496e44347afe7accc44eb6c79" />