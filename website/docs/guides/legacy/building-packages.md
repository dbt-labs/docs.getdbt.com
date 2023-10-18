---
title: "Building a dbt package" # to do: update this to creating
id: "building-packages"
---

## Assumed knowledge
This article assumes you are familiar with:
- [packages](/docs/build/packages)
- administering a repository on GitHub
- [semantic versioning](https://semver.org/)

Heads up — developing a package is an **advanced use of dbt**. If you're new to the tool, we recommend that you first use the product for your own company's analytics before attempting to create a package.

## 1. Assess whether a package is the right solution
Packages typically contain either:
- macros that solve a particular analytics engineering problem — for example, [auditing the results of a query](https://hub.getdbt.com/dbt-labs/audit_helper/latest/), [generating code](https://hub.getdbt.com/dbt-labs/codegen/latest/), or [adding additional schema tests to a dbt project](https://hub.getdbt.com/calogica/dbt_expectations/latest/).
- models for a common dataset — for example a dataset for software products like [MailChimp](https://hub.getdbt.com/fivetran/mailchimp/latest/) or [Snowplow](https://hub.getdbt.com/dbt-labs/snowplow/latest/), or even models for metadata about your data stack like [Snowflake query spend](https://hub.getdbt.com/gitlabhq/snowflake_spend/latest/) and [the artifacts produced by `dbt run`](https://hub.getdbt.com/tailsdotcom/dbt_artifacts/latest/). In general, there should be a shared set of industry-standard metrics that you can model (e.g. email open rate).

Packages are _not_ a good fit for sharing models that contain business-specific logic, for example, writing code for marketing attribution, or monthly recurring revenue. Instead, consider sharing a blog post and a link to a sample repo, rather than bundling this code as a package (here's our blog post on [marketing attribution](https://blog.getdbt.com/modeling-marketing-attribution/) as an example).

## 2. Create your new project
:::note Using the CLI for package development
We tend to use the CLI for package development. The development workflow often involves installing a local copy of your package in another dbt project — at present dbt Cloud is not designed for this workflow.
:::

1. Use the [dbt init](/reference/commands/init) command to create a new dbt project, which will be your package:
```shell
$ dbt init [package_name]
```
2. Create a public GitHub¹ repo, named `dbt-<package-name>`, e.g. `dbt-mailchimp`. Follow the GitHub instructions to link this to the dbt project you just created.
3. Update the `name:` of the project in `dbt_project.yml` to your package name, e.g. `mailchimp`.
4. Define the allowed dbt versions by using the [`require-dbt-version` config](/reference/project-configs/require-dbt-version).

¹Currently, our package registry only supports packages that are hosted in GitHub.

## 3. Develop your package
We recommend that first-time package authors first develop macros and models for use in their own dbt project. Once your new package is created, you can get to work on moving them across, implementing some additional package-specific design patterns along the way.

When working on your package, we often find it useful to install a local copy of the package in another dbt project — this workflow is described [here](https://discourse.getdbt.com/t/contributing-to-an-external-dbt-package/657).

### Follow our best practices
_Modeling packages only_

Use our [dbt coding conventions](https://github.com/dbt-labs/corp/blob/main/dbt_style_guide.md), our article on [how we structure our dbt projects](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview), and our [best practices](best-practices) for all of our advice on how to build your dbt project.

This is where it comes in especially handy to have worked on your own dbt project previously.

### Make the location of raw data configurable
_Modeling packages only_

Not every user of your package is going to store their Mailchimp data in a schema named `mailchimp`. As such, you'll need to make the location of raw data configurable.

We recommend using [sources](/docs/build/sources) and [variables](/docs/build/project-variables) to achieve this. Check out [this package](https://github.com/fivetran/dbt_facebook_ads_source/blob/main/models/src_facebook_ads.yml#L5-L6) for an example — notably, the README [includes instructions](https://github.com/fivetran/dbt_facebook_ads_source#configuration) on how to override the default schema from a `dbt_project.yml` file.

### Install upstream packages from hub.getdbt.com

If your package relies on another package (for example, you use some of the cross-database macros from [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/)), we recommend you install the package from [hub.getdbt.com](https://hub.getdbt.com), specifying a version range like so:

<File name='packages.yml'>

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: [">0.6.5", "0.7.0"]
```

</File>

When packages are installed from hub.getdbt.com, dbt is able to handle duplicate dependencies.

### Implement cross-database compatibility

Many SQL functions are specific to a particular database. For example, the function name and order of arguments to calculate the difference between two dates varies between Redshift, Snowflake and BigQuery, and no similar function exists on Postgres!

If you wish to support multiple warehouses, we have a number of tricks up our sleeve:
- We've written a number of macros that compile to valid SQL snippets on each of the original four adapters. Where possible, leverage these macros.
- If you need to implement cross-database compatibility for one of your macros, use the [`adapter.dispatch` macro](/reference/dbt-jinja-functions/dispatch) to achieve this. Check out the cross-database macros in dbt-utils for examples.
- If you're working on a modeling package, you may notice that you need write different models for each warehouse (for example, if the EL tool you are working with stores data differently on each warehouse). In this case, you can write different versions of each model, and use the [`enabled` config](/reference/resource-configs/enabled), in combination with [`target.type`](/reference/dbt-jinja-functions/target) to enable the correct models — check out [this package](https://github.com/fivetran/dbt_facebook_ads_creative_history/blob/main/dbt_project.yml#L11-L16) as an example.


If your package has only been written to work for one <Term id="data-warehouse" />, make sure you document this in your package README.

### Use specific model names
_Modeling packages only_

Many datasets have a concept of a "user" or "account" or "session". To make sure things are unambiguous in dbt, prefix all of your models with `[package_name]_`. For example, `mailchimp_campaigns.sql` is a good name for a model, whereas `campaigns.sql` is not.

### Default to views
_Modeling packages only_

dbt makes it possible for users of your package to override your model <Term id="materialization" /> settings. In general, default to materializing models as `view`s instead of `table`s.

The major exception to this is when working with data sources that benefit from incremental modeling (for example, web page views). Implementing incremental logic on behalf of your end users is likely to be helpful in this case.
### Test and document your package
It's critical that you [test](/docs/build/tests) your models and sources. This will give your end users confidence that your package is actually working on top of their dataset as intended.

Further, adding [documentation](/docs/collaborate/documentation) via descriptions will help communicate your package to end users, and benefit their stakeholders that use the outputs of this package.
### Include useful GitHub artifacts
Over time, we've developed a set of useful GitHub artifacts that make administering our packages easier for us. In particular, we ensure that we include:
- A useful README, that has:
    - installation instructions that refer to the latest version of the package on hub.getdbt.com, and includes any configurations requires ([example](https://github.com/dbt-labs/segment))
    - Usage examples for any macros ([example](https://github.com/dbt-labs/dbt-audit-helper#macros))
    - Descriptions of the main models included in the package ([example](https://github.com/dbt-labs/snowplow))
- GitHub templates, including PR templates and issue templates ([example](https://github.com/dbt-labs/dbt-audit-helper/tree/master/.github))

## 4. Add integration tests
_Optional_

We recommend that you implement integration tests to confirm that the package works as expected — this is an even _more_ advanced step, so you may find that you build up to this.

This pattern can be seen most packages, including  the [`audit-helper`](https://github.com/dbt-labs/dbt-audit-helper/tree/master/integration_tests) and [`snowplow`](https://github.com/dbt-labs/snowplow/tree/master/integration_tests) packages.

As a rough guide:

1. Create a subdirectory named `integration_tests`
2. In this subdirectory, create a new dbt project — you can use the `dbt init` command to do this. However, our preferred method is to copy the files from an existing `integration_tests` project, like the ones [here](https://github.com/dbt-labs/dbt-codegen/tree/HEAD/integration_tests) (removing the contents of the `macros`, `models` and `tests` folders since they are project-specific)
2. Install the package in the `integration_tests` subdirectory by using the `local` syntax, and then running `dbt deps`

<File name='packages.yml'>

```yml
packages:
    - local: ../ # this means "one directory above the current directory"
```

</File>

4. Add resources to the package (seeds, models, tests) so that you can successfully run your project, and compare the output with what you expect. The exact appraoch here will vary depending on your packages. In general you will find that you need to:
    - Add mock data via a [seed](/docs/build/seeds) with a few sample (anonymized) records. Configure the `integration_tests` project to point to the seeds instead of raw data tables.
    - Add more seeds that represent the expected output of your models, and use the [dbt_utils.equality](https://github.com/dbt-labs/dbt-utils#equality-source) test to confirm the output of your package, and the expected output matches.


5. Confirm that you can run `dbt run` and `dbt test` from your command line successfully.

5. (Optional) Use a CI tool, like CircleCI or GitHub Actions, to automate running your dbt project when you open a new Pull Request. For inspiration, check out one of our [CircleCI configs](https://github.com/dbt-labs/snowplow/blob/main/.circleci/config.yml), which runs tests against our four main warehouses. Note: this is an advanced step — if you are going down this path, you may find it useful to say hi on [dbt Slack](https://community.getdbt.com/).

## 5. Deploy the docs for your package
_Optional_

A dbt docs site can help a prospective user of your package understand the code you've written. As such, we recommend that you deploy the site generated by `dbt docs generate` and link to the deployed site from your package.

The easiest way we've found to do this is to use [GitHub Pages](https://pages.github.com/).

1. On a new git branch, run `dbt docs generate`. If you have integration tests set up (above), use the integration-test project to do this.
2. Move the following files into a directory named `docs` ([example](https://github.com/fivetran/dbt_ad_reporting/tree/HEAD/docs)): `catalog.json`, `index.html`, `manifest.json`, `run_results.json`.
3. Merge these changes into the main branch
4. Enable GitHub pages on the repo in the settings tab, and point it to the “docs” subdirectory
4. GitHub should then deploy the docs at `<org-name>.github.io/<repo-name>`, like so: [fivetran.github.io/dbt_ad_reporting](https://fivetran.github.io/dbt_ad_reporting/)

## 6. Release your package
Create a new [release](https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository) once you are ready for others to use your work! Be sure to use [semantic versioning](https://semver.org/) when naming your release.

In particular, if new changes will cause errors for users of earlier versions of the package, be sure to use _at least_ a minor release (e.g. go from `0.1.1` to `0.2.0`).

The release notes should contain an overview of the changes introduced in the new version. Be sure to call out any changes that break the existing interface!

## 7. Add the package to hub.getdbt.com
Our package registry, [hub.getdbt.com](https://hub.getdbt.com/), gets updated by the [hubcap script](https://github.com/dbt-labs/hubcap). To add your package to hub.getdbt.com, create a PR on the [hubcap repository](https://github.com/dbt-labs/hubcap) to include it in the `hub.json` file.
