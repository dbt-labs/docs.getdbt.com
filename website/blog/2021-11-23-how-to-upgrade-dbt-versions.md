---
title: "How to Upgrade dbt Versions (Mostly) Without Fear"
description: "Upgrading your dbt project can be daunting – you rely on dbt to power your analytics workflow and can’t afford to change things just to discover that your daily run doesn’t work anymore. I’ve been there. This is the checklist I wish I had when I owned my last company’s dbt project."
slug: upgrade-dbt-without-fear

authors: [joel_labes]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2021-11-29
is_featured: true
---

:::tip February 2024 Update

It's been a few years since dbt-core turned 1.0! Since then, we've committed to releasing zero breaking changes whenever possible and it's become much easier to upgrade dbt Core versions.

In 2024, we're taking this promise further by:
- Stabilizing interfaces for everyone — adapter maintainers, metadata consumers, and (of course) people writing dbt code everywhere — as discussed in [our November 2023 roadmap update](https://github.com/dbt-labs/dbt-core/blob/main/docs/roadmap/2023-11-dbt-tng.md).
- Introducing **Latest** release track in dbt Cloud. No more manual upgrades and no more need for _a second sandbox project_ just to try out new features in development. For more details, refer to [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

We're leaving the rest of this post as is, so we can all remember how it used to be. Enjoy a stroll down memory lane.

:::

As we get closer to dbt v1.0 shipping in December, it's a perfect time to get your installation up to scratch. dbt 1.0 represents the culmination of over five years of development and refinement to the analytics engineering experience - smoothing off sharp edges, speeding up workflows and enabling whole new classes of work.

Even with all the new shinies on offer, upgrading can be daunting – you rely on dbt to power your analytics workflow and can’t afford to change things just to discover that your daily run doesn’t work anymore. I’ve been there. This is the checklist I wish I had when I owned my last company’s dbt project.

<!--truncate-->

This guide covers the steps to safely upgrade, using a hypothetical project as a case study. The project uses dbt v0.16.0 and is relatively mature. It contains a couple of hundred models and uses a wide swathe of dbt functionality - custom tests, macros from dbt-utils, and snapshots to capture changes in critical business data.

We’ll walk through the steps to upgrade from 0.16.0 to 0.17.2, but the same principles apply regardless of the migration you’re making. The steps of the process boil down to:

1. Decide which version you are upgrading to

2. Add `require-dbt-version` to your `dbt_project.yml` file

3. Upgrade dbt

4. Try to run `dbt compile`

5. Handle any deprecations

    1. Update your packages

    2. Fix errors, then warnings

    3. Rinse and repeat until all errors and warnings are resolved

6. Test and review

7. Merge and communicate

>ℹ️ If you're not clear on the difference between major, minor and patch versions, it'd be useful to [read Jeremy's blog post](https://blog.getdbt.com/getting-ready-for-v1-0/) first which includes a primer on semantic versioning.

## Step 1: Decide which version you are upgrading to

Key principles:

* Only move up one or two minor versions at a time.

* Update to the most recent patch version of a given minor version.

* Read the migration guide in advance.

As noted above, the project is on 0.16.0 right now. 0.17.2 is the final patch release of the next minor version, so we’ll be upgrading to that.

>❓ Why not an earlier patch? 0.17.0 introduced a breaking change that was reverted in a later release; let's jump straight to the most stable version of 0.17 instead of stepping through each bugfix release
>
> If that's the logic for patch versions, why not leap all the way to dbt 0.21 or 1.0 in one hit? In short: **reduced risk**. Dealing with deprecations and behaviour changes one at a time makes it easier to pinpoint the cause of an issue.
>
> Practically, it also lets you lock in "checkpoints" of known-stable setups. If you need to pause your migration work to deal with an urgent request, you can safely deploy what you've finished so far instead of having a bunch of unrelated half-finished changes.

Review the migration guides to get an initial indication of what changes you might need to make. For example, in [the migration guide for 0.17.0](/docs/dbt-versions/core-upgrade), there are several significant changes to dbt's functionality, but it's unlikely that all of them will apply to your project. We'll cover this more later.

## Step 2: `Add require-dbt-version` to your `dbt_project.yml` file.

Key principles:

* Stop your colleagues from accidentally staying on an old version.

Your `dbt_project.yml` file lets you prevent users from running your dbt project with an unsupported version of dbt Core. If your project already has this configuration, update it. If not, add it in like this:

```yml
#/dbt_project.yml

name: 'your_company_project'

version: '0.1.0'

require-dbt-version: ">=0.17.2"

...
```

You can add an upper bound of supported versions like this: `[">=0.20.0", "<=1.0.0"]`, but for an internal analytics project it's probably overkill. Fun fact: this upper bound is how package vendors stop users from accidentally using an old version of a package like dbt-utils - more on this in a bit!

## Step 3: Upgrade dbt

If you use dbt Cloud, you can upgrade [as described here](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version). We recommend that you [create a second "sandbox" project](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions#testing-your-changes-before-upgrading), so that your experimentation doesn’t impact the rest of the team. For dbt Core, upgrade instructions will vary based on your [original installation method](https://docs.getdbt.com/dbt-cli/installation).

## Step 4: Try to run `dbt compile`

Key principles:

* Check that your version has increased as you expect.

* Quickly identify backwards incompatible changes which need to be resolved.

`dbt compile` is the quickest way to validate that the upgrade succeeded. If you are still on 0.16.0, your `require-dbt-version` constraint will reject the command.

Compiling your project will also validate that your project is valid while interacting with the database as little as possible, so you don't need to wait for queries' results.

## Step 5: Handle any deprecations

Key principles:

* Update packages first - there's no point in worrying about code that someone else has already fixed.

* Fix errors, then warnings.

* Stay focused: don't try to refactor logic "while you're there".

* Repeat until there are no errors left.

### Step 5a. Update your packages

The easiest migrations are those that someone else did for you. By installing an updated package, you'll get rid of a host of errors immediately.

>ℹ️ As hinted at above, most packages have an upper bound of dbt version compatibility as well as a lower bound. Treating future versions of dbt Core as incompatible with a package until proven otherwise is a defensive approach common prior to dbt Core v1.0's release. Once the API stabilises in v1.0, the upper boundaries will be able to loosen, making upgrades easier.

In this case, our example project probably has dbt 0.3.0 installed. By reviewing the [dbt-utils x dbt-core compatibility matrix](https://docs.google.com/spreadsheets/d/1RoDdC69auAtrwiqmkRsgcFdZ3MdNpeKcJrWkmEpXVIs/edit#gid=0), we see that both 0.4.1 and 0.5.1 are compatible with dbt Core v.0.17.2. The same principles apply for packages as dbt Core versions - install the latest patch release, and don't jump too far ahead in one go. Since there are no breaking changes in 0.4.x, we can safely move to 0.5.1.

>⚠️ Remember to run [`dbt clean`](https://docs.getdbt.com/reference/commands/clean) and [`dbt deps`](https://docs.getdbt.com/reference/commands/deps) after updating your `packages.yml` file!

### Step 5b. Fix errors, then warnings

Obviously, errors that stop you from running your dbt project at all are the most important to deal with. Let's assume that our project used a too-broadly-scoped variable in a macro file, support for which was removed in v0.17. The [migration guide explains what to do instead](/docs/dbt-versions/core-upgrade), and it's a pretty straightforward fix.

Once your errors are out of the way, have a look at warnings. For example, 0.17 introduced `config-version: 2` to `dbt_project.yml`. Although it's backwards compatible for now, we know that support for the old version will be removed in a future version of dbt so we might as well deal with it now. Again, the migration guide explains [what we need to do](/docs/dbt-versions/core-upgrade), and how to take full advantage of the new functionality in the future.

### Stay focused

It might be tempting to update all of your `whatever.yml` files to use the new syntax, or totally rewrite an old macro that depended on a broadly scoped variable "while you're there". Suppress this urge! The primary goal is to get everything upgraded more or less in-place. As you come across things that could be done in a more elegant fashion, make a note to come back to them at the end of your migration journey.

You want to make your code review as easy as possible when the time comes to merge your work back into the main branch. Combining refactors with compatibility updates is a sure-fire way to confuse your reviewer. For more discussion on this topic, check out the Netlify team's writeup of [moving from one warehouse to another](https://www.netlify.com/blog/2021/08/10/how-the-netlify-data-team-migrated-from-databricks-to-snowflake/) which touches on the same principles.

### Step 5c. Rinse and repeat

This part of the process is an iterative loop. As you fix each error, run dbt compile again to identify any new issues. For example, until you upgrade dbt-utils from 0.3.0 to 0.5.1, your project won't even start to compile because of the `require-dbt-version` mismatch. Once that's fixed, new issues might appear.

## Step 6. Test and review

Key principles:

* Complete a full `dbt run` and `dbt test`.

* Update your CI job's dbt version.

* Review your Slim CI configuration.

* Open a PR.

Once your compilation issues are resolved, it's time to run your job for real, to make sure that everything works from end to end. It's unlikely that a dbt version change will cause any runtime errors with your SQL, so you should feel confident going into this stage that the end is near.

After that, make sure that your CI environment in dbt Cloud or your orchestrator is on the right dbt version, then open a PR.

If you're using [Slim CI](https://docs.getdbt.com/docs/best-practices#run-only-modified-models-to-test-changes-slim-ci), keep in mind that artifacts aren't necessarily compatible from one version to another, so you won't be able to use it until the job you defer to has completed a run with the upgraded dbt version. This doesn't impact our example because support for Slim CI didn't come out until 0.18.0.

## Step 7. Merge and communicate

Key principles:

* 🎉 You did it!

* Make sure everyone knows that you did it, or they'll hit an error next time they run.

* Update your production environment's dbt version.

* Move onto the next upgrade while you're on a roll.

Merge your upgrade branch into your main branch, and then make sure your colleagues in turn pull main into their development branches and update their local environments.

>⚠️ Remember to also update your production environment!

>💡 If you're moving through multiple versions, you might like to wait and have your colleagues update their development environments in one go.

Thanks to [Claire](https://twitter.com/clairebcarroll) and [Winnie](https://twitter.com/gwenwindflower) for their help in developing this post 💕
