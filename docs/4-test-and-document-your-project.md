---
title: Test and document your project
id: test-and-document-your-project
---
## Add tests
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

  - name: customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null

```
3. Execute `dbt test`, and confirm that all your tests passed.
[ to-do: passing image ]

### Extra exercises
* Try writing a test that fails, for example, omit one of the order statuses in
the `accepted_values` list. What does a failing test look like? Can you debug
the failure?
* Try running the tests for one model only. If you grouped your `stg_` models
into a directory, try running the tests for all the models in that directory.

## Add documentation
1. Update your `models/schema.yml` file to include some descriptions:
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


🎉Congrats! You've just built your first dbt project!

### Extra exercises
* Try using a [docs block](https://docs.getdbt.com/docs/documentation#section-docs-blocks)
to add a Markdown description to a field.
