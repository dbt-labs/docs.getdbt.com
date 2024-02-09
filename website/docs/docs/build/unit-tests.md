---
title: "Unit tests"
sidebar_label: "Unit tests"
description: "Read this tutorial to learn how to use unit tests on your SQL models."
search_weight: "heavy"
id: "unit-tests"
keywords:
  - unit test, unit tests, unit testing, dag
---
:::note closed beta

Unit testing is currently in closed beta for dbt Cloud accounts that have updated to a [versionless environment](/docs/dbt-versions/upgrade-core-in-cloud).

It is available now as an alpha feature for dbt Core v1.8 users.

:::

Historically, the test coverage capabilities of dbt were limited to “data” tests &dash; testing the quality of input data or the shape of the resulting datasets &mdash; that could only be executed *after* a model had been built. 

Now, we are introducing a new type of test to dbt - unit tests. In software programming, unit tests validate small portions of your functional code, and they work much the same way here. Unit tests allow you to validate your SQL modeling logic on a small set of static inputs _before_ you materialize your full model in production. Unit tests enable test-driven development, benefiting developer efficiency and code reliability. 

:::note Before you begin

- We currently only support unit testing SQL models.
- We currently only support adding unit tests to models in your _current_ project.
- If your model has multiple versions, be default the unit test will run on *all* versions of your model. Read [unit testing versioned models for more information](#unit-testing-versioned-models).

Read the [refernce doc](/reference/resource-properties/unit-tests) for more details about formatting your unit tests.
:::

Let’s say you’re creating a new `dim_customers` model with a field `is_valid_email_address`, that calculates whether or not the customer’s email is valid: 

```sql
with customers as (

    select * from {{ ref('stg_customers') }}

),

accepted_email_domains as (

    select * from {{ ref('top_level_email_domains') }}

),
	
check_valid_emails as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
				coalesce (regexp_like(
            customers.email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
        )
        = true
        and accepted_email_domains.tld is not null,
        false) as is_valid_email_address
    from customers
		left join accepted_email_domains
        on customers.email_top_level_domain = lower(accepted_email_domains.tld)

)

select * from check_valid_emails
```

This type of logic can be challenging to validate. You can add a unit test to this model to ensure your `is_valid_email_address` logic captures all known edge cases: emails without `.`, emails without `@`, and emails from invalid domains.

```yaml
unit_tests:
  - name: test_is_valid_email_address
    description: "Check my is_valid_email_address logic captures all known edge cases - emails without ., emails without @, and emails from invalid domains."
    model: dim_customers
    given:
      - input: ref('stg_customers')
        rows:
          - {customer_id: 1, email: cool@example.com, email_top_level_domain: example.com}
          - {customer_id: 2, email: cool@unknown.com, email_top_level_domain: unknown.com}
          - {customer_id: 3, email: badgmail.com, email_top_level_domain: gmail.com}
          - {customer_id: 4, email: missingdot@gmailcom, email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        rows:
          - {tld: example.com}
          - {tld: gmail.com}
    expect:
      rows:
        - {customer_id: 1, is_valid_email_address: true}
        - {customer_id: 2, is_valid_email_address: false}
        - {customer_id: 3, is_valid_email_address: false}
        - {customer_id: 4, is_valid_email_address: false}

```

The above example defines the mock data using the inline `dict` format, but there are a handful of different options for how you format your mock data. 

You’ll notice that you only_had to define the mock data for the columns you care about. This enables you to write succinct and _specific_ unit tests.

:::note

The direct parents of the model that you’re unit testing (in this example `stg_customers` and `top_level_email_domains`) need to exist in the warehouse before you’re able to execute the unit test.

Use the `—-empty` flag to build an empty version of those models to save warehouse spend. 

```bash

`dbt run —-select "stg_customers top_level_email_domains" --empty`.

```

Alternatively, use `dbt build` to, in lineage order:

- Run the unit tests on your model.
- Materialize your model in the warehouse.
- Run the data tests on your model.

:::

Now we’re ready to run this unit test! We have a couple of options for commands depending on how specific we want to be: 

- `dbt test —-select dim_customers` runs _all_ of the tests on `dim_customers`.
- `dbt test —-select "dim_customers,test_type:unit"` runs all of the _unit_ tests on `dim_customers`.
- `dbt test —-select test_is_valid_email_address` runs the test named `test_is_valid_email_address`.

```bash

dbt test --select test_is_valid_email_address
16:03:49  Running with dbt=1.8.0-a1
16:03:49  Registered adapter: postgres=1.8.0-a1
16:03:50  Found 6 models, 5 seeds, 4 data tests, 0 sources, 0 exposures, 0 metrics, 410 macros, 0 groups, 0 semantic models, 1 unit test
16:03:50  
16:03:50  Concurrency: 5 threads (target='postgres')
16:03:50  
16:03:50  1 of 1 START unit_test dim_customers::test_is_valid_email_address ................... [RUN]
16:03:51  1 of 1 FAIL 1 dim_customers::test_is_valid_email_address ............................ [FAIL 1 in 0.26s]
16:03:51  
16:03:51  Finished running 1 unit_test in 0 hours 0 minutes and 0.67 seconds (0.67s).
16:03:51  
16:03:51  Completed with 1 error and 0 warnings:
16:03:51  
16:03:51  Failure in unit_test test_is_valid_email_address (models/marts/unit_tests.yml)
16:03:51    

actual differs from expected:

@@ ,customer_id,is_valid_email_address
→  ,1        ,True→False
   ,2        ,False
...,...      ,...


16:03:51  
16:03:51    compiled Code at models/marts/unit_tests.yml
16:03:51  
16:03:51  Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1

```

It looks like the clever regex statement wasn’t as clever as we thought as the model is incorrectly flagging `missingdot@gmailcom` as a valid email address.

Updating the regex logic to `'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'` (those darn escape characters!) and running the unit test again solves the problem:

```bash

dbt test --select test_is_valid_email_address
16:09:11  Running with dbt=1.8.0-a1
16:09:12  Registered adapter: postgres=1.8.0-a1
16:09:12  Found 6 models, 5 seeds, 4 data tests, 0 sources, 0 exposures, 0 metrics, 410 macros, 0 groups, 0 semantic models, 1 unit test
16:09:12  
16:09:13  Concurrency: 5 threads (target='postgres')
16:09:13  
16:09:13  1 of 1 START unit_test dim_wizards::test_is_valid_email_address ................... [RUN]
16:09:13  1 of 1 PASS dim_wizards::test_is_valid_email_address .............................. [PASS in 0.26s]
16:09:13  
16:09:13  Finished running 1 unit_test in 0 hours 0 minutes and 0.75 seconds (0.75s).
16:09:13  
16:09:13  Completed successfully
16:09:13  
16:09:13  Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1

```

Your model is now ready for production! Adding this unit test helped us catch an issue with the SQL logic _before_ you materialized `dim_customers` in your warehouse and will better ensure the reliability of this model in the future. 

### Unit testing versioned models

When a unit test is added to a model, with no supplied version, the unit test will run on all versions of the model.
Using the example on this page, if you have version 1, 2, and 3 of `my_model`, `my test_is_valid_email_address` unit test will run on all 3 versions.

To to only unit test a specific version (or versions) of a model, you can include the desired version(s) in the model config:

```yml

unit-tests:
  - name: test_is_valid_email_address # this is the unique name of the test
    model: my_model # name of the model I'm unit testing
      versions:
        include: 
          - 2
    given: # optional: list of inputs to provide as fixtures

```

In this scenario, if you have version 1, 2, and 3 of `my_model`, `my test_is_valid_email_address` unit test will run on _only_ version 2.

To to unit test all versions except a specific version (or versions) of a model, you can exclude the relevant version(s) in the model config:

```yml

unit-tests:
  - name: test_is_valid_email_address # this is the unique name of the test
    model: my_model # name of the model I'm unit testing
      versions:
        exclude: 
          - 1
    given: # optional: list of inputs to provide as fixtures

```
So if you have version 1, 2, and 3 of `my_model`, your `test_is_valid_email_address` unit test will run on _only_ version 2 and 3.

If you want to unit test a model that references a pinned version of model, you should specify that in the ref of your input:

```yml

unit-tests:
  - name: test_is_valid_email_address # this is the unique name of the test
    model: my_model # name of the model I'm unit testing
    given: # optional: list of inputs to provide as fixtures

```

### Best practices for “when to add a unit test to your model”:

- when your SQL contains complex logic:
    - Regex
    - Date math
    - Window functions
    - `case when` statements when many `when`s
    - Truncation
    - Recursion
- Add a unit test for anything that feels like writing a function. For example, it involves your own logic processing the input.
    - You wouldn't need to prioritize unit testing just calling `min()`, for example. That's already tested extensively by the warehouse and if something unexpected happens it's going to be a result of issues in the underlying data, so your fixture data in the unit test isn't going to help you.
- Logic for which you had bugs reported before.
- Edge cases not yet seen in your actual data that you want to handle.
- Prior to refactoring the transformation logic (especially if the refactor is significant).
- Models with high “criticality” (public, contracted models or models directly upstream of an exposure).
