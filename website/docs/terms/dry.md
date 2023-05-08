---
id: dry
title: DRY
description: DRY is a software development principle that stands for “Don’t Repeat Yourself.” Living by this principle means that your aim is to reduce repetitive patterns and code.
displayText: DRY  
hoverSnippet: DRY is a software development principle that stands for “Don’t Repeat Yourself.” Living by this principle means that your aim is to reduce repetitive patterns and duplicate code and logic in favor of modular and referenceable code.
---

<head>
  <title>What is DRY? Hint: It makes for great code - dbt Labs</title>
</head>

DRY is a software development principle that stands for “Don’t Repeat Yourself.” Living by this principle means that your aim is to reduce repetitive patterns and duplicate code and logic in favor of modular and referenceable code.

The DRY code principle was originally made with software engineering in mind and coined by Andy Hunt and Dave Thomas in their book, _The Pragmatic Programmer_. They believed that “every piece of knowledge must have a single, unambiguous, authoritative representation within a system.” As the field of analytics engineering and [data transformation](https://www.getdbt.com/analytics-engineering/transformation/) develops, there’s a growing need to adopt [software engineering best practices](https://www.getdbt.com/product/what-is-dbt/), including writing DRY code.

## Why write DRY code?

DRY code is one of the practices that makes a good developer, a great developer. Solving a problem by any means is great to a point, but eventually, you need to be able to write code that's maintainable by people other than yourself and scalable as system load increases. That's the essence of DRY code.

But what's so great about being DRY as a bone anyway, when you can be WET?

### Don’t be WET

WET, which stands for “Write Everything Twice,” is the opposite of DRY. It's a tongue-in-cheek reference to code that doesn’t exactly meet the DRY standard. In a practical sense, WET code typically involves the repeated _writing_ of the same code throughout a project, whereas DRY code would represent the repeated _reference_ of that code.

Well, how would you know if your code isn't DRY enough? That’s kind of subjective and will vary by the norms set within your organization. That said, a good rule of thumb is [the Rule of Three](https://en.wikipedia.org/wiki/Rule_of_three_(writing)#:~:text=The%20rule%20of%20three%20is,or%20effective%20than%20other%20numbers.). This rule states that the _third_ time you encounter a certain pattern, you should probably abstract it into some reusable unit.

There is, of course, a tradeoff between simplicity and conciseness in code. The more abstractions you create, the harder it can be for others to understand and maintain your code without proper documentation. So, the moral of the story is: DRY code is great as long as you [write great documentation.](https://docs.getdbt.com/docs/collaborate/documentation)

### Save time & energy

DRY code means you get to write duplicate code less often. You're saving lots of time writing the same thing over and over. Not only that, but you're saving your cognitive energy for bigger problems you'll end up needing to solve, instead of wasting that time and energy on tedious syntax.

Sure, you might have to frontload some of your cognitive energy to create a good abstraction. But in the long run, it'll save you a lot of headaches. Especially if you're building something complex and one typo can be your undoing.

### Create more consistent definitions

Let's go back to what Andy and Dave said in _The Pragmatic Programmer_: “Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.” As a data person, the words “single” and “unambiguous” might have stood out to you.

Most teams have essential business logic that defines the successes and failures of a business. For a subscription-based DTC company, this could be [monthly recurring revenue (MRR)](https://www.getdbt.com/blog/modeling-subscription-revenue/) and for a SaaS product, this could look like customer lifetime value (CLV). Standardizing the SQL that generates those metrics is essential to creating consistent definitions and values.

By writing DRY definitions for key business logic and metrics that are referenced throughout a dbt project and/or BI (business intelligence) tool, data teams can create those single, unambiguous, and authoritative representations for their essential transformations. Gone are the days of 15 different definitions and values for churn, and in are the days of standardization and DRYness.

:::note Experimental dbt Metrics!
dbt v1.0 currently supports the use of experimental metrics, time series aggregations over a table that support zero or one dimensions. Using [dbt Metrics](/docs/build/metrics), data teams can define metric calculations, ownerships, and definitions in a YAML file that lives within their dbt project. dbt Metrics are in their experimental stage; if you’re interesting in learning more about dbt Metrics, please make sure to join the #dbt-metrics-and-server channel in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/).
:::

## Tools to help you write DRY code

Let’s just say it: Writing DRY code is easier said than done. For classical software engineers, there’s a ton of resources out there to help them write DRY code. In the world of data transformation, there are also some tools and methodologies that can help folks in [the field of analytics engineering](https://www.getdbt.com/what-is-analytics-engineering/) write more DRY and [modular code](https://www.getdbt.com/analytics-engineering/modular-data-modeling-technique/).


###  Common Table Expressions (CTEs)

<Term id="cte">CTEs</Term> are a great way to help you write more DRY code in your data analysis and dbt models. In a formal sense, a CTE is a temporary results set that can be used in a query. In a much more human and practical sense, we like to think of CTEs as separate, smaller queries within the larger query you’re building up. Essentially, you can use CTEs to break up complex queries into simpler blocks of code that are easier to debug and can connect and build off of each other.

If you’re referencing a specific query, perhaps for aggregations that join back to an unaggregated view, CTEs can simply be referenced throughout a query with its CTE_EXPRESSION_NAME.


### View materializations

View [materializations](https://docs.getdbt.com/docs/build/materializations) are also extremely useful for abstracting code that might otherwise be repeated often. A <Term id="view" /> is a defined passthrough SQL query that can be run against a database. Unlike a table, it doesn’t store data, but it defines the logic that you need to use to fetch the underlying data.

If you’re referencing the same query, CTE, or block of code, throughout multiple data models, that’s probably a good sign that code should be its own view.

For example, you might define a SQL view to count new users created in a day:

```sql
  select
    created_date,
    count(distinct(user_id)) as new_users
  from {{ ref('users') }}
  group by created_date
```

While this is a simple query, writing this logic every time you need it would be super tedious. And what if the `user_id` field changed to a new name? If you’d written this in a WET way, you’d have to find every instance of this code and make the change to the new field versus just updating it once in the code for the view.

To make any subsequent references to this view DRY-er, you simply reference the view in your data model or query.

### dbt macros and packages

dbt also supports the use of [macros](/docs/build/jinja-macros) and [packages](https://docs.getdbt.com/docs/build/packages) to help data folks write DRY code in their dbt projects. Macros are Jinja-supported functions that can be reused and applied throughout a dbt project. Packages are libraries of dbt code, typically models, macros, and/or tests, that can be referenced and used in a dbt project. They are a great way to use transformations for common data sources (like [ad platforms](https://hub.getdbt.com/dbt-labs/facebook_ads/latest/)) or use more [custom tests for your data models](https://hub.getdbt.com/calogica/dbt_expectations/0.1.2/) _without having to write out the code yourself_. At the end of the day, is there really anything more DRY than that?

## Conclusion

DRY code is a principle that you should always be striving for. It saves you time and energy. It makes your code more maintainable and extensible. And potentially most importantly, it’s the fine line that can help transform you from a good analytics engineer to a great one.

## Further reading

* [Data modeling technique for more modularity](https://www.getdbt.com/analytics-engineering/modular-data-modeling-technique/)
* [Why we use so many CTEs](https://docs.getdbt.com/docs/guides/best-practices)
* [Glossary: CTE](https://docs.getdbt.com/terms/cte)
* [Glossary: Materialization](https://docs.getdbt.com/terms/materialization)
* [Glossary: View](https://docs.getdbt.com/terms/view)
