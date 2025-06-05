---
title: "Parser, Better, Faster, Stronger: A peek at the new dbt engine"
description: "Remember how dbt felt when you had a small project? You pressed enter and stuff just happened immediately? We're bringing that back."
slug: faster-project-parsing-with-rust

authors: [joel_labes]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2025-02-19
is_featured: true
---
Remember how dbt felt when you had a small project? You pressed enter and stuff just happened immediately? We're bringing that back.

<Lightbox src="/img/blog/2025-02-19-faster-project-parsing-with-rust/parsing_10k.gif" width="100%" title="Benchmarking tip: always try to get data that's good enough that you don't need to do statistics on it" />

After a [series of deep dives](/blog/the-levels-of-sql-comprehension) into the [guts of SQL comprehension](/blog/sql-comprehension-technologies), let's talk about speed a little bit. Specifically, I want to talk about one of the most annoying slowdowns as your project grows: project parsing.

When you're waiting a few seconds or a few minutes for things to start happening after you invoke dbt, it's because parsing isn't finished yet. But Lukas' [SDF demo at last month's webinar](https://www.getdbt.com/resources/webinars/accelerating-dbt-with-sdf) didn't have a big wait, so why not?

<!-- truncate -->

## A primer on parsing

Parsing your project (remember: [not your SQL](/blog/the-levels-of-sql-comprehension)!) is how dbt builds the dependency graph of models and macros. If you've ever looked at a `manifest.json` and noticed all the `depends_on` blocks, that's what we're talking about.

Without the resolved dependencies, dbt can't filter down to a subset of your project – this is why parsing is always an all-or-nothing affair. You can't do `dbt parse --select my_model+` because parsing is what works out what's on the other side of that plus. (Of course, most projects use partial parsing so are not starting from scratch every time).

All those refs and macros are defined in Jinja. I don't know if you've ever thought about how Jinja gets from curly braces into text, but it's pretty weird! It's actually a two-step process: first it gets converted into Python code, and then that Python code is *itself run to generate a string*!

This is kinda slow. Not so much as a one-off, but a project with 10,000 nodes might have 15-20,000 dependencies so every millisecond adds up.

## What if we wanted it to be faster?

Since running the code is slow, one way to get results faster is to not run the code. Since v1.0, dbt's parser has [used a static analyzer](https://github.com/dbt-labs/dbt-core/blob/main/docs/guides/parsing-vs-compilation-vs-runtime.md#:~:text=Simple%20Jinja%2DSQL%20models%20(using%20just%20ref()%2C%20source()%2C%20%26/or%20config()%20with%20literal%20inputs)%20are%20also%20statically%20analyzed%2C%20using%20a%20thing%20we%20built.%20This%20is%20very%20fast%20(~0.3%20ms)) to resolve refs when possible, which is [about 3x faster](https://docs.getdbt.com/reference/parsing#:~:text=For%20now%2C%20the%20static%20parser,speedup%20in%20the%20model%20parser) than going through the whole rigmarole above.

<Lightbox src="/img/blog/2025-02-19-faster-project-parsing-with-rust/evaluation_strategies_1.png" width="100%" />

The other way you could get the result faster is to run the code faster.

The original author of Jinja also wrote [minijinja](https://github.com/mitsuhiko/minijinja) – a Rust implementation of a subset of the original Jinja library.

This is not the post for a deep dive on *why* Rust and Python have such different performance characteristics, but the key takeaway is that [minijinja can *fully evaluate* a ref 30 times faster](https://github.com/mitsuhiko/minijinja/tree/main/benchmarks) than today's dbt can even *statically analyze* it.

<Lightbox src="/img/blog/2025-02-19-faster-project-parsing-with-rust/evaluation_strategies_2.png" width="100%" />

Our analysis in the leadup to dbt v1.0 showed that the static analyzer could handle 60% of models. Evaluating refs 30x faster in 60% of models would itself be great.

But recall that static analysis was the workaround for evaluating Jinja being slow. Since **we can now evaluate Jinja faster than we can statically analyze it**, let's just<sup>†</sup> evaluate everything!

<sup>†</sup>The word "just" is doing a *lot* of heavy lifting here. In practice, there's a lot happening behind the scenes to get both the performance of minijinja and the ability to process the full range of capabilities of a dbt project. Another story for another day.

## What does this mean in practice?

As you saw at the top of the post, I've been running some synthetic projects against an early build of the new dbt engine, and it's pretty snappy - **parsing a 10,000 model project in under 600ms**. Let's see how it goes with some other common project sizes:

<Lightbox src="/img/blog/2025-02-19-faster-project-parsing-with-rust/parse_time_comparison_linear.png" width="100%" title="You might have to squint, but I promise there's a yellow line on each of those groups" />

Even a 20,000-model project finished parsing in about a second. The equivalent cold parse takes well over a minute, and a partial parse (with no changed files) took about 12 seconds.

Let's look at one more comparison: **100k models. I need to break out the log scale for this one:**

<Lightbox src="/img/blog/2025-02-19-faster-project-parsing-with-rust/parse_time_comparison_log.png" width="100%" />

 The new dbt engine parsed our 100,000 model example project in under 10 seconds, compared with almost 20 minutes.

Let me be clear: I do not think you should put 100,000 models into your project! I mostly ran that one for the lols. But back in the realm of project sizes that actually exist:

- If your project isn't currently eligible for partial parsing, cold parses in Rust are fast enough to make it a moot point.
- Regardless of how your project parses today, your project will feel like it's a couple of orders of magnitude smaller than it is.

## We're just getting started

Speed is just one benefit to come from this integration, and pales in comparison to, say, [the importance of logical plans](https://roundup.getdbt.com/p/the-power-of-a-plan-how-logical-plans). But it sure is fun!

The teams are still hard at work integrating the two tools, and we'll have more to share on how the developer experience will change thanks to SDF's tech at our [Developer Day event in March](https://www.getdbt.com/resources/webinars/dbt-developer-day).
