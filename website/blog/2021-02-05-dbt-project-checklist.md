---
title: "Your Essential dbt Project Checklist"
description: "A checklist created to guide our internal work, which you can use to clean up your own dbt project."
slug: essential-dbt-project-checklist
canonical_url: https://discourse.getdbt.com/t/your-essential-dbt-project-checklist/1377

authors: [amy_chen, dave_connors]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2020-06-20
is_featured: true
---

If you’ve been using dbt for over a year, your project is out-of-date. This is natural.  

New functionalities have been released. Warehouses change. Best practices are updated. Over the last year, I and others on the Fishtown Analytics (now dbt Labs!) team have conducted seven audits for clients who have been using dbt for a minimum of 2 months.

<!--truncate-->

In every single audit, we found opportunities to:

1.  Improve performance
2.  Improve maintainability
3.  Make it easier for new people to get up-to-speed on the project

This post is the checklist I created to guide our internal work, and I’m sharing it here so you can use it to clean up your own dbt project. Think of this checklist like a `Where's Waldo?` book: you’ll still have to go out and find him, but with this in hand, you’ll at least know what you’re looking for.

## ✅ dbt\_project.yml
--------------------------------------------------------------------------------------------------------------------------------------------------

*   Project naming conventions
    *   What is the name of your project?
        *   Did you keep it as ‘my\_new\_project’ per the init project or renamed it to make sense?
        *   Our recommendation is to name it after your company such as ‘fishtown\_analytics’.
        *   If you have multiple dbt projects, something like ‘fishtown\_analytics\_marketing’ might make more sense.
*   Do you have unnecessary configurations like materialized: <Term id="view" />?
    *   By default, dbt models are materialized as “views”. This removes the need to declare any models as views.
    *   If all of your models in a folder are <Term id="table">tables</Term>, define the <Term id="materialization" /> on the dbt\_project.yml file rather than on the model file. This removes clutter from the model file.
*   Do you have a ton of placeholder comments from the init command?
    *   This creates unnecessary clutter.
*   Do you use post-hooks to grant permissions to other transformers and BI users?
    *   If no, you should! This will ensure that any changes made will be accessible to your collaborators and be utilized on the BI layer.
        ![on run end](/img/blog/checklist-on-run-end.png)
*   Are you utilizing tags in your project?
    *   The majority of your project’s models should be untagged. Use tags for models and tests that fall out of the norm with how you want to interact with them. For example, tagging ‘nightly’ models makes sense, but _also_ tagging all your non-nightly models as ‘hourly’ is unnecessary - you can simply exclude the nightly models!
    *   Check to see if a node selector is a good option here instead of tags.
    *   Are you tagging individual models in config blocks?
        *   You can use folder selectors in many cases to eliminate over tagging of every model in a folder.
*   Are you using YAML selectors?
    *   These enable intricate, layered model selection and can eliminate complicated tagging mechanisms and improve the legibility of the project configuration

**Useful links**:

* [.yml files](/docs/build/sources#testing-and-documenting-sources)
*   [Materializations](/docs/build/materializations/#configuring-materializations)
*   [YAML selectors](/reference/node-selection/yaml-selectors/)

## ✅ Package Management
--------------------------------------------------------------------------------------------------------------------------------------------------------

*   How up to date are the versions of your dbt Packages?
    *   You can check this by looking at your packages.yml file and comparing it to the packages hub page.
*   Do you have the dbt\_utils package installed?
    *   This is by far our most popular and essential package. The package contains clever macros to improve your dbt Project. Once implemented, you have access to the macros (no need to copy them over to your project).

**Useful links**

*   [Packages Docs](/docs/build/packages/)
*   [Package Hub](https://hub.getdbt.com/)
*   [dbt utils package](https://github.com/dbt-labs/dbt-utils)

## ✅ Code style
----------------------------------------------------------------------------------------------------------------------------------------

*   Do you have a clearly defined code style?
*   Are you following it strictly?
*   Are you optimizing your SQL?
    *   Are you using window functions and aggregations?

**Useful links**

*   [dbt Labs' code style](https://github.com/dbt-labs/corp/blob/master/dbt_style_guide.md)
*   [Leveling up SQL](https://blog.getdbt.com/one-analysts-guide-for-going-from-good-to-great/)

## ✅ Project structure
------------------------------------------------------------------------------------------------------------------------------------------------------

*   If you are using <Term id="dimensional-modeling" /> techniques, do you have staging and marts models?
    *   Do they use table prefixes like ‘fct\_’ and ‘dim\_’?
*   Is the code modular? Is it one transformation per one model?
*   Are you filtering as early as possible?
    *   One of the most common mistakes we have found is not filtering or transforming early enough. This causes multiple models downstream to have the same repeated logic (i.e., wet code) and makes updating business logic more cumbersome.
*   Are the <Term id="cte">CTEs</Term> modular with one transformation per CTE?
*   If you have macro files, are you naming them in a way that clearly represent the macro(s) contained in the file?

**Useful links**

*   [How Fishtown Structures our dbt Project](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355)
*   [Why the Fishtown SQL style guide uses so many CTEs](https://discourse.getdbt.com/t/why-the-fishtown-sql-style-guide-uses-so-many-ctes/1091)

## ✅ dbt
--------------------------------------------------------------------------------------------------------------------------

*   What version of dbt are you on?
    *   The further you get away from the latest release, the more likely you are to keep around old bugs and make updating that much harder.
*   What happens when you `dbt run`?
    *   What are your longest-running models?
        *   Is it time to reevaluate your modeling strategy?
        *   Should the model be incremental?
            *   If it’s already incremental, should you adjust your incremental strategy?
    *   How long does it take to run the entire dbt project?
    *   Does every model run? (This is not a joke.)
        *   If not, why?
    *   Do you have circular model references?
*   Do you use sources?
    *   If so, do you use source freshness tests?
*   Do you use refs and sources for everything?
    *   Make sure nothing is querying off of raw tables, etc.
        ![no querying raw tables](/img/blog/checklist-8ddc2f76de24c98690ef986dcc7974bff09adb59.png)

*   Do you regularly run `dbt test` as part of your workflow and production jobs?
*   Do you use Jinja & Macros for repeated code?
    *   If you do, is the balance met where it’s not being overused to the point code is not readable?
    *   Is your Jinja easy to read?
        *   Did you place all of your `set` statements at the top of the model files?
        *   Did you format the code for Jinja-readability or just for the compiled SQL?
        *   Do you alter your whitespace?
            *   Example: `{{ this }}` and not `{{this}}`
    *   Did you make complex macros as approachable as possible?
        *   Way to do this are providing argument names and in-line documentation using `{# <insert text> #}`
*   If you have incremental models, are they using unique keys and is\_incremental() macro?
*   If you have tags, do they make sense? Do they get utilized?

**Useful links**

*   [dbt release version](https://github.com/dbt-labs/dbt/releases)
*   [Sources](/docs/build/sources/)
*   [Refs](/reference/dbt-jinja-functions/ref/)
*   [tags](/reference/resource-configs/tags/)
* [Jinja docs](/guides/advanced/using-jinja)

## ✅ Testing & Continuous Integration
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*   Do your models have tests?
    *   The ideal project has 100% test coverage on all of its models. While there are cases where this doesn’t make sense, our rule of thumb is models should have at least a not\_null/unique test on the <Term id="primary-key" />.
*   What are you testing for? Does it make sense?
*   What are the assumptions you should be testing for?
    *   Think about your core business logic as well as your understanding of your sources.
*   Are you using pull requests/other forms of version control?
    *   How easy is it to understand what the code change and intention behind the code change do?
*   Do you have mandatory PR reviews before merging code to your dbt project or BI layer?
    *   Do you use a PR template?

**Useful links**

* [Version control](/best-practices/best-practices#version-control-your-dbt-project)
*   [dbt Labs' PR Template](/blog/analytics-pull-request-template)

## ✅ Documentation
----------------------------------------------------------------------------------------------------------------------------------------------

*   Do you use documentation?
*   Are there descriptions for each model?
*   Are complex transformations and business logic explained in an easily accessible place?
*   Are your stakeholders using your documentation?
    *   If not, why?
*   Do you have a readme and regularly update it?
*   How easy would it be to onboard someone to your project?
*   If you have column-level descriptions, are you using doc blocks?

Useful Links

*   [FAQs for documentation](/docs/collaborate/documentation#faqs)
*   [Doc blocks](/docs/collaborate/documentation#using-docs-blocks)

## ✅ dbt Cloud specifics
----------------------------------------------------------------------------------------------------------------------------------------------------------

*   What dbt version are the jobs?
    *   Are the majority of them inheriting from the environment to make upgrading easier?
*   What do your jobs look like? Do they make sense?
*   How are your dbt cloud projects organized?
    *   Do you have any unused projects?
*   Have you chosen the most appropriate job for your account level documentation?
*   Are the number of runs syncing up with how often your raw data updates and are viewed?
    *   If your data isn’t updating as often as the runs are happening, this is just not doing anything.
*   Do you have a full refresh of the production data?
*   Do you run tests on a periodic basis?
*   What are the longest-running jobs?
*   Do you have a Continuous Integration job? (Github only)

Are you using the IDE and if so, how well?

*   We found that the IDE has assisted in alleviating issues of maintaining the upgraded dbt version.
*   Does dbt cloud have its own user in their warehouse? What is the default warehouse/role?
*   Are you getting notifications for failed jobs? Have you set up the slack notifications?

**Useful links**

*   [dbt Cloud as a CI tool](/docs/deploy/continuous-integration)


## ✅ DAG Auditing
-------------------------------------------------------------------------------------------------------------------------

_Note: diagrams in this section show what NOT to do!_

*   Does your DAG have any common modeling pitfalls?
    *   Are there any direct joins from sources into an intermediate model?

        *   All sources should have a corresponding staging model to clean and standardize the data structure. They should not look like the image below.  

            ![bad dag](/img/blog/checklist-28c75101367e272fbc2db2ebb1a1ec030517bb5e_2_517x250.jpeg)

    *   Do sources join directly together?

        *   All sources should have a corresponding staging model to clean and standardize the data structure. They should not look like the image below.  

            ![bad dag 2](/img/blog/checklist-5d8ad45deb695eb6771003e010b242c0a3c122b9_2_517x220.jpeg)

    *   Are there any rejoining of upstream concepts?

        *   This may indicate:
            *   a model may need to be expanded so all the necessary data is available downstream
            *   a new intermediate model is necessary to join the concepts for use in both places  

                ![bad dag 2](/img/blog/checklist-acd57c0e781b1eaf75a65b5063f97ac3ddc5c493_2_517x136.jpeg)

    *   Are there any “bending connections”?

        *   Are models in the same layer dependent on each other?
        *   This may indicate a change in naming is necessary, or the model should reference further upstream models  

            ![bad dag 3](/img/blog/checklist-0532fd13a7d63e3e5df71d025700c4d9c158a7ff_2_517x155.jpeg)

    *   Are there model fan outs of intermediate/dimension/fact models?

        *   This might indicate some transformations should move to the BI layer, or transformations should be moved upstream
        *   Your dbt project needs a defined end point!  

            [![bad dag 4](/img/blog/checklist-33fcd7c4922233412d1364b39227c876d0cb8215_2_517x111.jpeg)

    *   Is there repeated logic found in multiple models?

        *   This indicates an opportunity to move logic into upstream models or create specific intermediate models to make that logic reusable
        *   One common place to look for this is complex join logic. For example, if you’re checking multiple fields for certain specific values in a join, these can likely be condensed into a single field in an upstream model to create a clean, simple join.

Thanks to Christine Berger for her DAG diagrams!

**Useful links**

*   [How we structure our dbt Project](/guides/best-practices/how-we-structure/1-guide-overview)
*   [Coalesce DAG Audit Talk](https://www.youtube.com/watch?v=5W6VrnHVkCA&t=2s)
*   [Modular Data Modeling Technique](https://getdbt.com/analytics-engineering/modular-data-modeling-technique/)
*   [Understanding Threads](/docs/running-a-dbt-project/using-threads)

This is a quick overview of things to think about in your project.  We’ll keep this post updated as we continue to refine our best practices! Happy modeling!
