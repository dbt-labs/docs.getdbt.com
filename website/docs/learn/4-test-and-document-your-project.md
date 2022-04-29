---
title: Test and document your project
id: test-and-document-your-project
description: Let's test and document our models to build trust in our data.
---

## Add tests to your models
Adding [tests](/docs/building-a-dbt-project/tests) to a project helps validate that your models are working correctly. So let's add some tests to our project!

<CloudCore>
    <LoomVideo id="86a1e7ed19084810a7903bd31ebd83e0" />
    <LoomVideo id="61693e928ec94100bef33371aab8296a" />
</CloudCore>

1. Create a new YAML file in the `models` directory, named `models/schema.yml`
2. Add the following contents to the file:

<File name='models/schema.yml'>

```yaml
version: 2

models:
  - name: customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null

  - name: stg_customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null

  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('stg_customers')
              field: customer_id

```

</File>

3. Execute `dbt test`, and confirm that all your tests passed.

<CloudCore>
    <Lightbox src="/img/successful-tests-dbt-cloud.png" title="Passing tests when using dbt Cloud" />
    <Lightbox src="/img/successful-tests-dbt-cli.png" title="Passing tests when using the dbt CLI" />
</CloudCore>

:::info
When you run `dbt test`, dbt iterates through your YAML files, and constructs a query for each test. Each query will return the number of records that fail the test. If this number is 0, then the test is successful.
:::

### FAQs
<FAQ src="available-tests" alt_header="What tests are available for me to use in dbt? Can I add my own custom tests?" />
<FAQ src="test-one-model" />
<FAQ src="failed-tests" />
<FAQ src="schema-yml-name" alt_header="Does my test file need to be named `schema.yml`?" />
<FAQ src="multiple-test-files" />
<FAQ src="why-version-2" />
<FAQ src="recommended-tests" />
<FAQ src="when-to-test" />

## Document your models
Adding [documentation](/docs/building-a-dbt-project/documentation) to your project allows you to describe your models in rich detail, and share that information with your team. Here, we're going to add some basic documentation to our project.

<CloudCore>
    <LoomVideo id="f946321f692747e59bec3b726eccbfd4" />
    <LoomVideo id="230b30756f674bf7ba38311099070d37" />
</CloudCore>

1. Update your `models/schema.yml` file to include some descriptions, such as those below.

<File name='models/schema.yml'>

```yaml
version: 2

models:
  - name: customers
    description: One record per customer
    columns:
      - name: customer_id
        description: Primary key
        tests:
          - unique
          - not_null
      - name: first_order_date
        description: NULL when a customer has not yet placed an order.

  - name: stg_customers
    description: This model cleans up customer data
    columns:
      - name: customer_id
        description: Primary key
        tests:
          - unique
          - not_null

  - name: stg_orders
    description: This model cleans up order data
    columns:
      - name: order_id
        description: Primary key
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']

```

</File>

2. Execute `dbt docs generate` to generate the documentation for your project. dbt introspects your project and your warehouse to generate a JSON file with rich documentation about your project.
3. [CLI] Execute `dbt docs serve` to launch the documentation in a local website. [Cloud] Click the link above the file tree in the develop interface to launch documentation in a new tab.


:::tip
Great work ⭐️! You've just built your first dbt project that's tested and documented!
:::


### FAQs
<FAQ src="long-descriptions" />
<FAQ src="sharing-documentation" />


## Extra exercises

<CloudCore>
    <LoomVideo id="384fa15250d44ca3950a06477bc31a89" />
    <LoomVideo id="6db6956adbb04f55b6027c461e9b1792" />
</CloudCore>

* Write a test that fails, for example, omit one of the order statuses in the `accepted_values` list. What does a failing test look like? Can you debug the failure?
* Run the tests for one model only. If you grouped your `stg_` models into a directory, try running the tests for all the models in that directory.
* Use a [docs block](/docs/building-a-dbt-project/documentation#using-docs-blocks) to add a Markdown description to a model.

## Commit your changes
First off, we need to commit the changes we made to our project so that our repository has our latest code.

### dbt Cloud
<LoomVideo id="afd55d89abdc4a77b34deaee90da0813" />

Click the `commit` button, with a message like "Add customers model, tests, docs"

### dbt CLI
<LoomVideo id="b07d7efe3f054e3bb357b4bccd805e70" />

1. Add all your changes to git: `git add -A`
2. Commit your changes: `git commit -m "Add customers model, tests, docs"`
3. Push your changes to your repository: `git push`

## Next steps

:::tip
Congratulations 🎉! You've just deployed your first dbt project! <strong>Please reply to the email you received with your credentials with a link to your GitHub repository.</strong>
:::
