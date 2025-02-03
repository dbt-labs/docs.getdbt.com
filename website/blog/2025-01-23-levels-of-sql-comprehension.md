---
title: "The Three Levels of SQL Comprehension: What they are and why you need to know about them"
description: "Parsers, compilers, executors, oh my! What it means when we talk about 'understanding SQL'."
slug: the-levels-of-sql-comprehension

authors: [joel_labes]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2025-01-23
is_featured: true
---


Ever since [dbt Labs acquired SDF Labs last week](https://www.getdbt.com/blog/dbt-labs-acquires-sdf-labs), I've been head-down diving into their technology and making sense of it all. The main thing I knew going in was "SDF understands SQL". It's a nice pithy quote, but the specifics are *fascinating.*

For the next era of Analytics Engineering to be as transformative as the last, dbt needs to move beyond being a [string preprocessor](https://en.wikipedia.org/wiki/Preprocessor) and into fully comprehending SQL. **For the first time, SDF provides the technology necessary to make this possible.** Today we're going to dig into what SQL comprehension actually means, since it's so critical to what comes next.

<!-- truncate -->

## What is SQL comprehension?

Let’s call any tool that can look at a string of text, interpret it as SQL, and extract some meaning from it a *SQL Comprehension tool.*

Put another way, SQL Comprehension tools **recognize SQL code and deduce more information about that SQL than is present in the [tokens](https://www.postgresql.org/docs/current/sql-syntax-lexical.html) themselves**. Here’s a non-exhaustive set of behaviors and capabilities that such a tool might have for a given [dialect](https://blog.sdf.com/p/sql-dialects-and-the-tower-of-babel) of SQL:

- Identify constituent parts of a query.
- Create structured artifacts for their own use or for other tools to consume in turn.
- Check whether the SQL is valid.
- Understand what will happen when the query runs: things like what columns will be created, what datatypes do they have, and what DDL is involved
- Execute the query and return data (unsurprisingly, your database is a tool that comprehends SQL!)

By building on top of tools that truly understand SQL, it is possible to create systems that are much more capable, resilient and flexible than we’ve seen to date.

## The Levels of SQL Comprehension

When you look at the capabilities above, you can imagine some of those outcomes being achievable with [one line of regex](https://github.com/joellabes/mode-dbt-exposures/blob/main/generate_yaml.py#L52) and some that are only possible if you’ve literally built a database. Given that range of possibilities, we believe that “can you comprehend SQL” is an insufficiently precise question.

A better question is “to what level can you comprehend SQL?” To that end, we have identified different levels of capability. Each level deals with a key artifact (or more precisely - a specific "[intermediate representation](https://en.wikipedia.org/wiki/Intermediate_representation)"). And in doing so, each level unlocks specific capabilities and more in-depth validation.

| Level | Name | Artifact | Example Capability Unlocked |
| --- | --- | --- | --- |
| 1 | Parsing | Syntax Tree | Know what symbols are used in a query. |
| 2 | Compiling | Logical Plan | Know what types are used in a query, and how they change, regardless of their origin. |
| 3 | Executing | Physical Plan + Query Results | Know how a query will run on your database, all the way to calculating its results.  |

At Level 1, you have a baseline comprehension of SQL. By parsing the string of SQL into a Syntax Tree, it’s possible to **reason about the components of a query** and identify whether you've **written syntactically legal code**.

At Level 2, the system produces a complete Logical Plan. A logical plan knows about every function that’s called in your query, the datatypes being passed into them, and what every column will look like as a result (among many other things). Static analysis of this plan makes it possible to **identify almost every error before you run your code**.

Finally, at Level 3, you can actually **execute a query and modify data**, because it understands all the complexities involved in answering the question "how does the exact data passed into this query get transformed/mutated".

## Can I see an example?

This can feel pretty theoretical based on descriptions alone, so let’s look at a basic Snowflake query.

A system at each level of SQL comprehension understands progressively more about the query, and that increased understanding enables it to **say with more precision whether the query is valid**.

To tools at lower levels of comprehension, some elements of a query are effectively a black box - their syntax tree has the contents of the query but cannot validate whether everything makes sense. **Remember that comprehension is deducing more information than is present in the plain text of the query; by comprehending more, you can validate more.**

### Level 1: Parsing

<Lightbox src="/img/blog/2025-01-23-levels-of-sql-comprehension/level_1.png" width="100%" />

A parser recognizes that a function called `dateadd` has been called with three arguments, and knows the contents of those arguments.

However, without knowledge of the [function signature](https://en.wikipedia.org/wiki/Type_signature#Signature), it has no way to validate whether those arguments are valid types, whether three is the right number of arguments, or even whether `dateadd` is an available function. This also means it can’t know what the datatype of the created column will be.

Parsers are intentionally flexible in what they will consume - their purpose is to make sense of what they're seeing, not nitpick. Most parsers describe themselves as “non-validating”, because true validation requires compilation.

### Level 2: Compiling

<Lightbox src="/img/blog/2025-01-23-levels-of-sql-comprehension/level_2.png" width="100%" />

Extending beyond a parser, a compiler *does* know the function signatures. It knows that on Snowflake, `dateadd` is a function which takes three arguments: a `datepart`, an `integer`, and an `expression` (in that order).

A compiler also knows what types a function can return without actually running the code (this is called [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis), we’ll get into that another day). In this case, because `dateadd`’s return type depends on the input expression and our expression isn’t explicitly cast, the compiler just knows that the `new_day` column can be [one of three possible datatypes](https://docs.snowflake.com/en/sql-reference/functions/dateadd#returns).

### Level 3: Executing

<Lightbox src="/img/blog/2025-01-23-levels-of-sql-comprehension/level_3.png" width="100%" />

A tool with execution capabilities knows everything about this query and the data that is passed into it, including how functions are implemented. Therefore it can perfectly represent the results as run on Snowflake. Again, that’s what databases do. A database is a Level 3 tool.

### Review

Let’s review the increasing validation capabilities unlocked by each level of comprehension, and notice that over time **the black boxes completely disappear**:

<Lightbox src="/img/blog/2025-01-23-levels-of-sql-comprehension/validation_all_levels.png" width="100%" />

In a toy example like this one, the distinctions between the different levels might feel subtle. As you move away from a single query and into a full-scale project, the functionality gaps become more pronounced. That’s hard to demonstrate in a blog post, but fortunately there’s another easier option: look at some failing queries. How the query is broken impacts what level of tool is necessary to recognize the error.

## So let’s break things

As the great analytics engineer Tolstoy [once noted](https://en.wikipedia.org/wiki/Anna_Karenina_principle), “All correctly written queries are alike; each incorrectly written query is incorrect in its own way”.

Consider these three invalid queries:

- `selecte dateadd('day', 1, getdate()) as tomorrow` (Misspelled keyword)
- `select dateadd('day', getdate(), 1) as tomorrow` (Wrong order of arguments)
- `select cast('2025-01-32' as date) as tomorrow` (Impossible date)

Tools that comprehend SQL can catch errors. But they can't all catch the same errors! Each subsequent level will catch more subtle errors in addition to those from *all prior levels*. That's because the levels are additive — each level contains and builds on the knowledge of the ones below it.

Each of the above queries requires progressively greater SQL comprehension abilities to identify the mistake.

### Parser (Level 1): Capture Syntax Errors

Example: `selecte dateadd('day', 1, getdate()) as tomorrow`

Parsers know that `selecte` is **not a valid keyword** in Snowflake SQL, and will reject it.

### Compiler (Level 2): Capture Compilation Errors

Example: `select dateadd('day', getdate(), 1) as tomorrow`

To a parser, this looks fine - all the parentheses and commas are in the right places, and we’ve spelled `select` correctly this time.

A compiler, on the other hand, recognizes that the **function arguments are out of order** because:

- It knows that the second argument (`value`) needs to be a number, but that `getdate()` returns a `timestamp_ltz`.
- Likewise, it knows that a number is not a valid date/time expression for the third argument.

### Executor (Level 3): Capture Data Errors

Example: `select cast('2025-01-32' as date) as tomorrow`

Again, the parser signs off on this as valid SQL syntax.

But this time the compiler also thinks everything is fine! Remember that a compiler checks the signature of a function. It knows that `cast` takes a source expression and a target datatype as arguments, and it's checked that both these arguments are of the correct type.

It even has an overload that knows that strings can be cast into dates, but since it can’t do any validation of those strings’ *values* it doesn’t know **January 32nd isn’t a valid date**.

To actually know whether some data can be processed by a SQL query, you have to, well, process the data. Data errors can only be captured by a Level 3 system.

## Conclusion

Building your mental model of the levels of SQL comprehension – why they matter, how they're achieved and what they’ll unlock for you – is critical to understanding the coming era of data tooling.

In introducing these concepts, we’re still just scratching the surface. There's a lot more to discuss:

- Going deeper on the specific nuances of each level of comprehension
- How each level actually works, including the technologies and artifacts that power each level
- How this is all going to roll into a step change in the experience of working with data
- What it means for doing great data work

Over the coming days, you'll be hearing more about all of this from the dbt Labs team - both familiar faces and our new friends from SDF Labs.

This is a special moment for the industry and the community. It's alive with possibilities, with ideas, and with new potential. We're excited to navigate this new frontier with all of you.
