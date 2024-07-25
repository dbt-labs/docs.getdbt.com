---
title: "Practitioner Q&A: How Cityblock Health adopted dbt Cloud's Merge Jobs to deploy new code faster"
description: "Cityblock Health swapped their GitHub Actions for native dbt Cloud functionality to streamline their project deployments and avoid redundant resouce consumption."
slug: cityblock-merge-jobs
authors: [nathaniel_burren, joel_labes]
tags: [dbt Cloud]
hide_table_of_contents: false
date: 2024-07-30
is_featured: true
---

dbt Labs recently added support for a new type of job in dbt Cloud, called a **[Merge Job](/docs/deploy/merge-jobs)**. Just like a Continuous Integration job is triggered based on a new Pull Request being opened in your git repository, the Merge Job triggers once code is merged into your environment’s configured branch (e.g. `main` for the Production environment, or `uat` for the Staging environment).

Triggering a run when code is merged enables your team to practice Continuous Deployment, getting changed models deployed as quickly as possible and reducing resource consumption from unnecessary overbuilding. Alternatively, just kick off a `dbt compile` to update your project’s state for Slim CI comparisons. Check out the [Trigger on Merge docs](/docs/deploy/merge-jobs) for full details on enabling this in your project.

The Cityblock Health team were one of the first companies to use Merge Jobs during the beta period, and I (Joel) caught up with Analytics Engineer Nathaniel Burren to hear how they did it and what benefits they’ve seen.

<!-- truncate -->

## How long have you been using dbt at Cityblock?

Cityblock chose dbt in 2019 as the tool to make all of our SQL based analysis version controlled, composable, and reusable. However, over the years our monolithic project turned into a jungle of over 2,200 models. This made us rethink our approach and move to dbt Cloud while also adapting a [multi-project methodology](/best-practices/how-we-mesh/mesh-1-intro). We presented [our migration story at Coalesce last year](https://www.youtube.com/watch?v=oO7whNtd9Jg) and go into more details there.

Our hope is to create core assets maintained by our Analytics Engineers that our downstream teams can use in their own projects. This also allows us to retain control of these core assets as our single sources of truth while the downstream projects can create their own assets based on their subject matter expertise (that in turn other projects can use, instead of having a mess of duplicate models).

## What made you excited enough about Merge Jobs to sign up for the beta?

Our goal when adopting Merge Jobs was to get model changes in our Staging and Production environments deployed as fast as possible. We also like to have fresh Explorer data as we have many eyes from downstream users looking at the core models in our data platform. Keeping the environments up to date with our git repo means that when we fix something the resolution is immediately deployed, not languishing waiting for our overnight build.

## What were you doing to achieve these goals before?

We used to use a GitHub Action to trigger a production run on a merge to main. However most of our Analytics Engineerss don’t understand GHAs and we would have to get our DevOps friends to help us whenever configuration changes were needed. In turn that would cause us to have to wait on them or an AE that knows GHAs to help change/maintain the code.  

## And what are you doing now? How did you configure your Merge Job?

Because we have so many dbt projects split across different domains, one of my colleagues built a Terraform module which builds new dbt Cloud projects, including environments, jobs, and permissions. We added the Merge Job to that definition and deployed it everywhere in one go.

The job itself only has one step, `dbt build --select state:modified+`. It defers to itself, so every time a commit is merged to main the only things that get built are models that changed compared to that last run.

## How has switching to the native functionality improved things for you?

The biggest place this has helped us is no longer having to babysit deploy jobs. With the fast pace we’re working at right now, it really helps us keep working on other things and not worry about manually triggering jobs.

## What advice would you give to other teams who are implementing Merge Jobs?

Make sure you’ve got your [branch protection rules in GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#creating-a-branch-protection-rule) locked down. We noticed that some downstream project users were merging PRs even though their [dbt-project-evaluator checks](/blog/align-with-dbt-project-evaluator) were failing. Since failed jobs aren’t eligible for deferral, this caused some weird behavior for us until we sorted it out.
