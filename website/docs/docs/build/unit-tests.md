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

This type of logic can be challenging to validate. Let’s add a unit test to this model to ensure our `is_valid_email_address` logic captures all known edge cases: emails without `.`, emails without `@`, and emails from invalid domains.

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

You’ll notice that we _only_ had to define the mock data for the columns we care about. This enables you to write succinct and _specific_ unit tests.

:::note

The direct parents of the model that you’re unit testing (in this example `stg_customers` and `top_level_email_domains`) need to exist in the warehouse before you’re able to execute the unit test.

Use the `—-empty` flag to build an empty version of those models to save warehouse spend. 

```bash

dbt run —-select "stg_customers top_level_email_domains" --empty

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

[add screenshot]

It looks like our clever regex statement wasn’t as clever as we thought as our model is incorrectly flagging `cool@example.com` as an invalid email address.

Updating our regex logic to `'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'` (those darn escape characters!) and running the unit test again does the trick:

[to add screenshot of example logs]

Your model is now ready for production! Adding this unit test helped us catch an issue with the SQL logic _before_ you materialized `dim_customers` in your warehouse and will better ensure the reliability of this model in the future. 

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
