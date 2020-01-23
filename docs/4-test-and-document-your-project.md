---
title: Test and document your project
id: test-and-document-your-project
---
## Add tests
Adding tests to a project helps validate that your models are working correctly.
In this section, we're going to add some tests to your dbt project.
<iframe width="640" height="400" src="https://www.loom.com/embed/86a1e7ed19084810a7903bd31ebd83e0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


1. Create a new YAML file in the `models` directory, named `models/schema.yml`
2. Add the following contents to the file:
```yaml
version: 2

models:
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
              to: ref('customers')
              field: customer_id

  - name: customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null

```
3. Execute `dbt test`, and confirm that all your tests passed. Here's the
expected output when using dbt Cloud and the dbt CLI.

[ TO-DO: Add Cloud image ]

<div class='text-left'>
    <a href="#" data-featherlight="/img/successful-tests.png">
        <img
            data-toggle="lightbox"
            width="300px"
            alt="Passing tests when using the dbt CLI"
            src="/img/successful-tests.png"
            class="docImage" />
    </a>
</div>

### Extra exercises
* Try writing a test that fails, for example, omit one of the order statuses in
the `accepted_values` list. What does a failing test look like? Can you debug
the failure?
* Try running the tests for one model only. If you grouped your `stg_` models
into a directory, try running the tests for all the models in that directory.

## Add documentation
Adding documentation to your project allows you to describe your models in rich
detail, and share that information with your team. Here, we're going to add
some basic documentation to our project.

1. Update your `models/schema.yml` file to include some descriptions, such as
those below.
```yaml
version: 2

models:
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
```
2. Execute `dbt docs generate` to generate the documentation for your project.
3. Execute `dbt docs serve` to launch the documentation in a local website.
[ To-do ]: Docs flow for this

Great work ⭐️! You've just built your first dbt project!

### Extra exercises
* Try using a [docs block](https://docs.getdbt.com/docs/documentation#section-docs-blocks)
to add a Markdown description to a field.
