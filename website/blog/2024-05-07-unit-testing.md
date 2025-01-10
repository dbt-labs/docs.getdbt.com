---
title: "Unit testing in dbt for test-driven development"
description: "In dbt v1.8, we introduce support for unit testing. In this blog post, Doug will show how to use them"
slug: announcing-unit-testing

authors: [doug_beatty]

tags: [analytics craft]
hide_table_of_contents: false

date: 2024-05-07
is_featured: true
---

Do you ever have "bad data" dreams? Or am I the only one that has recurring nightmares? 😱

Here's the one I had last night:

It began with a midnight bug hunt. A menacing insect creature has locked my colleagues in a dungeon, and they are pleading for my help to escape . Finding the key is elusive and always seems just beyond my grasp. The stress is palpable, a physical weight on my chest, as I raced against time to unlock them.

Of course I wake up without actually having saved them, but I am relieved nonetheless. And I've had similar nightmares involving a heroic code refactor or the launch of a new model or feature.

Good news: beginning in dbt v1.8, we're introducing a first-class unit testing framework that can handle each of the scenarios from my data nightmares.

Before we dive into the details, let's take a quick look at how we got here.

<!--truncate-->

## Story of data quality in dbt

The underlying reason behind my bad dreams is worry about unfortunate data quality that affects shared outcomes.

One of the things I loved right away when I first started using dbt was that it had a first-class mechanism for asserting data quality on our full production data in the form of [data tests](https://docs.getdbt.com/docs/build/data-tests).

I no longer had to worry about whether or not my primary key was actually unique, I could just add a dbt data test to assert that expectation!

`dbt test` quickly became a beloved command, allowing me to run our full suite of data quality tests in production each day. And these same tests would run in CI and development.

But while this mechanism is tremendously useful at a holistic level, it doesn't lend itself as well at the granular level. It was not designed to handle minimal test cases for a model with with fixed inputs and the expected output from those inputs. Nor was it designed to handle isolated test cases that can run simultaneously for the same model.

So it doesn't meet the standard software engineering use-case of setting up and running individual test cases and other [desireable properties](https://tidyfirst.substack.com/p/desirable-unit-tests).

## Introducing unit testing in dbt

dbt version 1.8 marks the introduction of a built-in unit testing framework to extend the capabilities of software engineering best practices for analytics engineers. It allows for crafting isolated and repeatable [unit tests](https://en.wikipedia.org/wiki/Unit_testing) that are well-suited to execute during development and CI. They are useful in a variety of scenarios like responding to **bug reports**, confident **code refactoring,** and using [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) when adding **new features**.

Let's dive into the details...

## Hello, unit testing world

<Lightbox src="/img/blog/2024-05-07-unit-testing/hello-world.png" width="50%" title="Hello unit testing world" />

A key way that I build self-confidence is starting out with the [simplest example possible](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program). Once I've gotten the initial thing to work, then I can tweak it to take on more complicated use-cases (scroll down to the ["real world example"](#real-world-example) section below for something more realistic!). So here's a super simple example that you can use to get your feet wet. Afterwards, I'll explain more about each of the main components and how you can apply them to your own test cases.

First, create this trivial model:

```sql
-- models/hello_world.sql

select 'world' as hello
```

Then, add a simple unit test for that model:

```yaml
# models/_properties.yml

unit_tests:
  - name: test_hello_world

    # Always only one transformation to test
    model: hello_world

    # No inputs needed this time!
    # Most unit tests will have inputs -- see the "real world example" section below
    given: []

    # Expected output can have zero to many rows
    expect:
      rows:
        - {hello: world}
```

Finally, run the model and all its tests in a single command like this:

```shell
dbt build --select hello_world
```

<Lightbox src="/img/blog/2024-05-07-unit-testing/unit-test-terminal-output.png" title="Terminal output of hello world unit test" />

Voilà! We can see that a single unit test ran and it passed.

## Crafting Unit Tests

After you've run your first "hello, world" unit test, you'll want to get started writing your own. There's two things that will help you be successful:

1. How to think about a unit test conceptually
2. How to actually craft your unit tests in YAML

Here's a step-by-step guide for you to follow:

### Organizing your thoughts

1. **Identify your scenarios:** Which scenarios do you want to be more confident about? For each scenario, what is the relevant model? Consider edge cases: which inputs might be tricky for that model to handle correctly? This will identify your *model* and *given inputs*.
2. **Define the success criteria:** What is the expected output for each scenario? Be specific. This will identify your *expected output*.

### Writing your unit tests

1. **Start with a "model-inputs-output" structure:** When running this *model*, given these test *inputs*, then expect this *output*.
2. **Use meaningful descriptions:** They should clearly explain what the test is doing so collaborators and future developers can understand the purpose.
3. **Test one behavior per test case:** This keeps tests focused and easier to debug.

**Additional tips:**

- **Think about maintainability:** Write tests that are easy to understand and update.
- **Refactor tests as needed:** Keep them up-to-date with code changes.
- **Practice test-driven development (TDD):** Write tests before writing code to guide your development process.
- **Remember, unit testing is just one part of quality assurance.** Combine it with other testing methods like data tests and model contracts for a comprehensive approach.

Next, I'll show you a brief example from the "real" world.

## Real world example

When we were trying out the developer experience and ergonomics of unit testing in dbt, we went to our trusty [Jaffle Shop repo](https://github.com/dbt-labs/jaffle-shop). We began to follow the framework above to **identify scenarios** and then define the **success criteria**.

The first scenario we considered was counting the number of food items and drink items within an order. One natural edge case is an order without any drinks. Our success criteria in this case is for `count_drink_items` to be 0 in the `order_items_summary` model.

To implement the unit test, we started by starting with a "model-inputs-output" (MIO) structure above. The relevant **model** was `orders` with **given** inputs were from `order_items` and `stg_orders`. In this case, we **expect** our output for order_id 2 to be `count_drink_items: 0`.

Here's what the unit test YAML looked like:

### Unit test YAML

```yaml
unit_tests:

  - name: test_order_items_count_drink_items_with_zero_drinks
    description: >
      Scenario: Order without any drinks
        When the `order_items_summary` table is built
        Given an order with nothing but 1 food item
        Then the count of drink items is 0

    # Model
    model: order_items_summary

    # Inputs
    given:
      - input: ref('order_items')
        rows:
          - {
              order_id: 76,
              order_item_id: 3,
              is_drink_item: false,
            }
      - input: ref('stg_orders')
        rows:
          - { order_id: 76 }

    # Output
    expect:
      rows:
        - {
            order_id: 76,
            count_drink_items: 0,
          }
```

Suffice it to say that when we ran the unit test for the first time, it failed! 💥

But it wasn't because we defined the unit test incorrectly – it was because we found a bug that we didn't know about previously. To get things back on the right path, we [opened a PR](https://github.com/dbt-labs/jaffle-shop/pull/12) that added the relevant unit test to confirm the bug as well as the bug fix. The good news is that by implementing the unit test, we were able to find a bug before someone else did. 😎

If you're curious about what the model looked like before and the code changes for the fix, here you go:

### Original SQL code

```sql
with

order_items as (

    select * from {{ ref('order_items') }}

)

select
    order_id,

    sum(supply_cost) as order_cost,
    sum(product_price) as order_items_subtotal,
    count(order_item_id) as count_order_items,
    count(
        case
            when is_food_item then 1
            else 0
        end
    ) as count_food_items,
    count(
        case
            when is_drink_item then 1
            else 0
        end
    ) as count_drink_items

from order_items

group by 1
```

### SQL Code fix

```diff
17c17
<     count(
---
>     sum(
23c23
<     count(
---
>     sum(
```

### Caveats and pro-tips

See the docs for [helpful information before you begin](https://docs.getdbt.com/docs/build/unit-tests#before-you-begin), including unit testing [incremental models](https://docs.getdbt.com/docs/build/unit-tests#unit-testing-incremental-models), [models that depend on ephemeral model(s)](https://docs.getdbt.com/docs/build/unit-tests#unit-testing-a-model-that-depends-on-ephemeral-models), and platform-specific considerations like `STRUCT`s in BigQuery. In many cases, the [`sql` format](https://docs.getdbt.com/reference/resource-properties/data-formats#sql) can help solve tricky edge cases that come up.

Another advanced topic is overcoming issues when non-deterministic factors are involved, such as a current timestamp. To ensure that the output remains consistent regardless of when the test is run, you can set a fixed, predetermined value by using the [`overrides`](https://docs.getdbt.com/reference/resource-properties/unit-test-overrides) configuration.

Before we wrap up, let's do a brief comparison of the different data quality capabilties in dbt and identify the situations where each would be most effective.

## Unit tests vs. model contracts vs. data tests

dbt has multiple complementary features that support data quality including [unit tests](https://docs.getdbt.com/docs/build/unit-tests), [model contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts), and [data tests](https://docs.getdbt.com/docs/build/data-tests). Here's a table of how they compare and when you might use each:

| Unit tests | Model contracts | Data tests |
| --- | --- | --- |
| Enforced before a resource node is materialized | Enforced while the resource node is materialized | Enforced after a resource node is materialized |
| Blocks the attempt to build the resource | Blocks the building the resource node and downstream nodes | Blocks building of downstream nodes |
| Rigid tests of the exact expected output for a single transformation | Tests the "shape" of the container (column names and data types) for a single data set | Flexible and can test assertions across multiple data sets, ranges of values, etc. |
| Good for testing the precise values expected in the output | Good for enforcing the column names and data types that describe the "shape" of the data and specifying constraints like primary and foreign keys | Good for testing assertions other than equality (like ranges of acceptable values) or source data whose transformation is a black box |


## Summary

You're now ready to build your first unit tests with this new feature coming to dbt in v1.8! We're eager for you to try this out – let us know how it works for you by commenting in [this discussion](https://github.com/dbt-labs/dbt-core/discussions/8275) or [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new/choose).

There's more details about the syntax which you can access in our [documentation](https://docs.getdbt.com/docs/build/unit-tests). We hope this gives you the tools to boost your confidence in your data pipelines and sleep easier at night 😴
