---
title: "So You Want to Build a dbt Package"
description: "Packages are the easiest way for a dbt user to contribute code to the dbt community."
slug: so-you-want-to-build-a-package

authors: [amy_chen]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2021-11-29
is_featured: true
---


Packages are the easiest way for a dbt user to contribute code to the dbt community. This is a belief that I hold close as someone who is a contributor to packages and has helped many partners create their own during my time here at dbt Labs.

The reason is simple: packages, as an inherent part of dbt, follow our principle of being built by and for analytics engineers. They’re easy to install, accessible and at the end of the day, it’s just SQL (with sprinklings of git and jinja). You can either share your package with the community or just use it among your teams at your org.

So I challenge you after reading this article to test out your skillsets, think about the code that you find yourself reusing again and again, and build a package. Packages can be as complex as you would want; it’s just SQL hidden in the mix of reusable macros and expansive testing frameworks. So let’s get started on your journey.
<!--truncate-->
**What is a package even?**

If you’re considering making a package, you probably already know what one is but let’s take a quick review to help structure our thinking. A dbt package is basically a mini-dbt project. The only mandatory file that it requires is a dbt_project.yml to validate that it’s a dbt package (same as any dbt project). It can contain macros that help you write something in SQL in significantly less lines. It could contain models that help you model your SaaS dataset in a manner of minutes (I’m looking at you, Fivetran Salesforce package). But in dbt land, you could literally take one project (say Jaffle shop) and install it as a package to your project, regardless of whether it's from the Hub or not.

Packages are a way to share code in dbt without ever having to copy and paste (or *email* :screaming face:).

Let’s break down the [dateadd macro](https://github.com/dbt-labs/dbt-utils/blob/0.1.20/macros/cross_db_utils/dateadd.sql) from the dbt_utils macro to show you the process that created this fantastic macro.

The problem: Analysts often need to add an interval to a timestamp/date. To make this cross-database and standardized across a project, a macro is needed.

```sql

{% macro dateadd(datepart, interval, from_date_or_timestamp) %}

  {{ return(adapter.dispatch('dateadd', 'dbt_utils')(datepart, interval, from_date_or_timestamp)) }}

{% endmacro %}

```

In this section, we are using the [dispatch](/reference/dbt-jinja-functions/dispatch) Jinja reference to enable the right macro from the rest of the file is called (since they are specific to the adapter) when a user called the macro. This means the user doesn’t have to think about what to call based on the adapter, they just need to call one macro, dbt handles it all behind the scene.

```sql

{% macro default__dateadd(datepart, interval, from_date_or_timestamp) %}

    dateadd(

        {{ datepart }},

        {{ interval }},

        {{ from_date_or_timestamp }}

        )

{% endmacro %}

```

In this macro, we are providing a default way to create a dateadd. This is the first macro to be used unless an adapter specific one is needed.

```sql

{% macro bigquery__dateadd(datepart, interval, from_date_or_timestamp) %}

        datetime_add(

            cast( {{ from_date_or_timestamp }} as datetime),

        interval {{ interval }} {{ datepart }}

        )

{% endmacro %}

{% macro postgres__dateadd(datepart, interval, from_date_or_timestamp) %}

    {{ from_date_or_timestamp }} + ((interval '1 {{ datepart }}') * ({{ interval }}))

{% endmacro %}

{# redshift should use default instead of postgres #}

{% macro redshift__dateadd(datepart, interval, from_date_or_timestamp) %}

    {{ return(dbt_utils.default__dateadd(datepart, interval, from_date_or_timestamp)) }}

{% endmacro %}

```

Here we have macros that are adapter specific. The dispatch function that we called in our first macro will help dbt know which one to point to.

Now, that wasn’t so bad, right?

**Intentions**

Before embarking on any great adventure, you should always have an idea of why you’re going on this journey. For package creation, intentions generally fall into two categories: **technical and social. **

Technically, you have something reusable that you want to share. Awesome things that fit in that bucket can look like:

* Macros that you use very often for your projects: [dbt_utils](https://github.com/dbt-labs/dbt-utils/blob/0.7.3/macros/cross_db_utils/dateadd.sql)

* Tests that you find valuable: [dbt_expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest)

* Methods to expand on dbt’s core functionality: [dbt_artifacts](https://hub.getdbt.com/tailsdotcom/dbt_artifacts/latest)

* Ways to push dbt transformations outside of the box: [dbt_ml](https://hub.getdbt.com/kristeligt-dagblad/dbt_ml/latest)

* Standard methods of modeling a SaaS data source: [Salesforce](https://hub.getdbt.com/fivetran/salesforce/latest)

I’ve even written a macro that alters the union_relations macro to a specific use case (unioning two massive tables in an incremental manner). Analytics often means that there is a lot of reusable code, across organizations and verticals.

Socially, you want to contribute to dbt. By using dbt, you are inherently part of our open source community. This means you are benefiting from the community contributions made from those prior to you and those after. So what better way to show your appreciation than contributing your knowledge, to help dbt continuously improve. Contributions help you validate your dbt expertise, both to yourself and the greater community. Creating a dbt package is a great vehicle to provide an opinionated way to use dbt. You can help define industry standards across projects, for yourself and the community. And all of this done without requiring python knowledge.

**Requirements:**

But Amy, you just said that anyone with SQL and dbt knowledge can create a package.

I didn’t lie but I want to be specific about what skillsets you want to be comfortable with or expect to hone in as you develop your package:

* High level of SQL knowledge

* Understanding of git, especially with semantic versioning and git maintenance

* Knowledge of dbt (think 300s levels where you have fully built out a dbt project)

* Proficient with Jinja

* Have used dbt packages in the past

* If you’re making a public package, an high-level understanding of how open source works

**Flavors of Packages**

dbt Packages can come in a variety of flavors; let’s break down your options:

* **Public vs Private**

Now, generally speaking, we encourage contributions to our open source community so we always want to recommend sharing your package publicly. You can host your package on our[ Packages Hub](https://hub.getdbt.com/) to showcase alongside your fellow experts. But we understand sometimes there is the knowledge that you might want to share in a more controlled manner. You can make your package private in git so only those you have granted access to it can install the package in their dbt project. This often means including additional credentials during installation via using env_vars.

* **Content**

    * We have found that our most popular packages are configurable so keep in mind how customizable you want to be. Packages containing macros are by far the leading packages installed but modeling SaaS datasets has a very specific and still helpful space. So what is your package solving for? Is it going to be usable across different platforms or just Snowflake specific?

* **Documentation **

This is basically pineapple on pizza. It’s an alternative use case where you might be installing another project on your own to gain access to the documentation and potentially internal team models. I reference this approach in my ([repo discourse post](https://discourse.getdbt.com/t/how-to-configure-your-dbt-repository-one-or-many/2121)). This will likely not be a public package but you will treat the project just like a package in this use case.

**How to create a package**

**
**Now let’s get to the fun part. Starting out high level, what does the workflow look like?

**The workflow **

Here is a diagram that shows the workflow. You might notice that this looks a lot like how you might work on a dbt project and you would be absolutely right. Once again, you just need to know dbt and SQL to create a package :)

![image alt text](/img/blog/how_to_build_a_package_image_0.png)

Now let’s deep dive into what happens in this flow.

**Develop**

This is where you create the foundation.

1. Start out with creating a dbt Project in Github (you can use other git providers if you plan to make a private package). All it needs to include is a `dbt_project.yml` to be installed as a package.

2. Add in your package contents. This means your models and macros. Don’t forget to declare the vars in your dbt_project.yml file if you have any specific configurations.

As you’re going through these steps, keep in mind how configurable you want your code to be. Does your code follow [dbt best practices](https://discourse.getdbt.com/t/your-essential-dbt-project-checklist/1377)? If it’s cross-platform, have you taken into account the various SQL dialects? Also if your package relies on any existing dbt packages, are you tying it to a specific version? [For more information on developing your package, check out our docs site. ](https://docs.getdbt.com/docs/guides/building-packages#3-develop-your-package)If you want assistance from the community, the [#packages-ecosystem](https://getdbt.slack.com/archives/CU4MRJ7QB) channel is a fantastic place to start.

**Testing **

After you have developed your core code, it’s time to [add integration tests](https://docs.getdbt.com/docs/guides/building-packages#4-add-integration-tests). This is a great thing to do because this confirms your assumptions and gives you and any contributors to your package a baseline of how the package should work. Our [audit-helper](https://github.com/dbt-labs/dbt-audit-helper/tree/master/integration_tests) package has some fantastic cross-platform integrations tests. Be sure to also install your package into an existing dbt project to validate that it works.

**Document**

We, at dbt Labs, have a strongly held belief that good code is documented so make sure to document any models or macros. Update the Readme with the package’s use cases, how to use it, and specifics on what it contains. Take a look at the [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) package as an example of exemplary documentation. You want to make sure to cover what a user might need to know to use this package and debug any errors.

**Community Contribution **

If you plan to create a public package, I highly recommend implementing a contribution process. This will help users contribute to your code and continue to expand its usage (yay open source!). To create a trusted process, be sure to include the following elements:

* [Pull Request](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository) and [Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) to help users contribute with guidance. This prevents unnecessary back and forth and helps set up productive conversations. It will help you help users debug issues and encourage folks to contribute to your package.

* Declare a reasonable SLA. Be transparent with how quickly you can respond to pull requests and issues.

* Define your [code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) if you have multiple maintainers to automate reviewers

A mindset to have here is setting up a framework that encourages people to join in. This will make it a lot easier for you and your users to reap the benefits of collective knowledge.

**Publish**

Now that all the work is done, it’s time to take the stage. This is the part of the workflow where you will make the repo public if necessary and [add to have it added to our Hub site](https://docs.getdbt.com/docs/guides/building-packages#7-add-the-package-to-hubgetdbtcom). Be sure to tell folks what you have done in dbt Slack in the #i-made-this channel or social media.

**Maintain **

Now, this is actually the section that package maintainers tell me is the hardest. You want to make sure to keep up with dbt core versions as well as make sure to respond to open pull requests and issues with transparency. You also might have users who are asking questions about your packages in a part of the slack community that you don’t see. This is why it’s so key to have a good process for contribution during the community contribution section of the workflow. One package maintainer told me he just regularly keyword searches in dbt Slack to catch stray questions about his package. So be clear on communication and this will make life so much easier in terms of the community element. In terms of keeping dbt core versions up to date, luckily for you, v1 is coming out and this means the end of breaking changes. That being said, it would be good to keep in mind a maintenance schedule, say every 2 months to keep your package updated to date with the latest and greatest.

**My challenge to you**

Share your knowledge. There are never too many voices in an open-source community. Join the [#packages-ecoystem](https://getdbt.slack.com/archives/CU4MRJ7QB) channel to speak with maintainers of packages.

Check out the hub for ideas on gaps you might see. Maybe there’s an [existing package with an issue you have a solution for](https://github.com/dbt-labs/dbt-utils/issues). Contributing to an existing package is a great way to get started.

 I’m excited to see what you create.

**Thank yous!**

Many thanks to our package creators and maintainers that allow me to interview them and pick their brain about packages best practices: Anders, Joe Markiewicz, Claus Herther, Mateusz Klimek, Jeremy Cohen
