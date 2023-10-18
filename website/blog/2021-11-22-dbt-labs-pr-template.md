---
title: "The Exact GitHub Pull Request Template We Use at dbt Labs"
description: "Having a GitHub PR template is one of the most important and frequently overlooked aspects of creating an efficient and scalable dbt-centric analytics workflow."
slug: analytics-pull-request-template

authors: [jess_williams]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2021-11-29
is_featured: false
---

Having a GitHub pull request template is one of the most important and frequently overlooked aspects of creating an efficient and scalable dbt-centric analytics workflow. Opening a pull request is the final step of your modeling process - a process which typically involves a lot of complex work! 

For you, the dbt developer, the pull request (PR for short) serves as a final checkpoint in your modeling process, ensuring that no key elements are missing from your code or project. 

<!--truncate-->

For the reviewer, it lets them know what it is they are reviewing before laying eyes on any code. Most importantly, the PR template sets a standard for your team so that PRs can be both submitted and reviewed with ease.

On dbt Labs’ Professional Services team, our [analytics engineers](https://getdbt.com/what-is-analytics-engineering/) frequently work in pairs on client projects, meaning two AEs are writing and reviewing PRs against the same repo. 

Now imagine you are paired with 2-3 different people on 2-3 projects. Absent some structure, the chances of everyone following thorough and repeatable PR writing/review processes is extremely slim. 

Let’s jump into the exact PR template we use internally at dbt Labs. 


## The GitHub PR template we use

<WistiaVideo id="r3u04isgxf" />

Our PR template ([view markdown file in GitHub](https://github.com/dbt-labs/dbt-init/blob/master/starter-project/.github/pull_request_template.md)) is composed of 6 sections: 

* Description & motivation
* To-do before merge (optional)
* Screenshots
* Validation of models
* Changes to existing models
* Checklist

### How and why this GitHub PR template works

Having each of these sections written down significantly limits the communication overhead on our team, and limits the chances of us shipping low-quality analytics code. Let's explore how to use each section and its benefits.

#### Description & motivation:

This is the intro to your PR and should allow the reviewer to quickly be able to understand the reason for opening this PR. If your actual code is the “how”, the description is the “what” and “why.”  As an example from a recent project:

> Example: This PR updates the channel mapping for Google Adwords data based on this Google Sheet. This mimics the mapping used for sessions and will be used in our final attribution modeling to look at ROAS.  

> This PR also adds a stg table for the `final_url_report` from Adwords. This is currently only being used to map `utm_medium` and `utm_source` to `campaign_id` and `ad_group_id` to then derive a channel. This is not yet being used as an input to the Adwords package due to limitations in the data that is configured and available via Adwords. We may choose to incorporate that later.  

> The main purpose of this PR was to update the channel mapping for an attribution model. I could have quickly written “updated channel mapping” and called it a day. But, knowing that I would likely need to reference this mapping again at some point in the future, I added this link to the google sheet where we initially built the mapping.

Remember, you know more about this PR **right now** than you will in a couple of months. If you or your team ships 30+ PRs and need to go back to one of those early ones to reference something, you’re going to be bummed when your description says “added a model”. 


#### Screenshots:

This is where we add the relevant sections from our DAG! This is one of my favorite features of dbt, as I’m a very visual learner. So when I open a PR, I take a quick look at the relevant sections of the DAG (aka dependency graph) to help me conceptualize the modeling.

![dbt dag check](/img/blog/pr-template-dag-check.png "dbt DAG check")

Checking for things like modularity and 1:1 relationships between sources and staging models is much easier done visually via the DAG than trying to look at code and visualize the relationships. 

> Note: my colleagues Christine Berger + Randy Pitcher published an excellent walkthrough of [modular data modeling technique](https://www.getdbt.com/analytics-engineering/modular-data-modeling-technique/) if you’re interested in learning more.


#### Validation of models:

This section should show something to confirm that your model is doing what you intended it to do. This could be a [dbt test](/docs/build/tests) like uniqueness or not null, or could be an ad-hoc query that you wrote to validate your data. Here is a screenshot from a test run on a local development branch:

![test validation](/img/blog/pr-template-test-validation.png "dbt test validation")

Adding uniqueness tests shows that you have put thought into the <Term id="grain" /> of each of your models, and then ensures that those assumptions hold true over time. 

By including a screenshot of your dbt test run here, you are confirming that you have done the work.

#### Changes to existing models:

This is a place to leave post-merge instructions. Maybe you updated your existing [incremental model](https://docs.getdbt.com/docs/build/incremental-models) with an additional column and need to run a [full refresh](https://docs.getdbt.com/docs/build/incremental-models#how-do-i-rebuild-an-incremental-model). 

Or, maybe you have a corresponding PR for your BI tool that needs to be merged to accommodate your dbt modeling changes.


#### Checklist:

The launch checklist is probably the most important piece of the PR template—it ensures that you’ve followed the QC steps required to push your PR into production.

**My pull request represents one logical piece of work:**

Each PR should represent a cohesive body of work—a specific fct model, or staging a particular data source. If you’re having trouble narrowing down and describing **_the thing_** your PR does, it may be too broad. 

This also makes things much easier on your reviewer. Reviewing a PR with multiple, unrelated concepts is extremely challenging and time consuming. 

**My commits are related to the pull request and look clean.**

Think of yourself! What if you need to roll back a change, but in a moment of post-coding fogginess, you made a massive commit of unrelated concepts that “updated all the things”. Woof.

![woof](/img/blog/pr-template-woof.gif "woof")

**My SQL follows the [dbt Labs style guide](https://github.com/dbt-labs/corp/blob/master/dbt_style_guide.md).**

By standardizing the way your team writes code, your reviewer is able to spend less time picking apart each team member’s individual styling nuances and more time reviewing the actual code. 

**I have added appropriate tests and documentation to any new models.**

By default, all new models should have _at least_ unique and not null tests on the <Term id="primary-key" />. 

Documentation follows the same reasoning as the PR description. You will know more **right now** about the intricacies of these models than you will after you’ve developed 50 more models in the coming months.

**I have [materialized my models](https://docs.getdbt.com/docs/build/materializations) appropriately.**

This is all about performance. Our ultimate goal is to model data such that end users can easily and efficiently query the resulting database objects.

![choose your materializations wisely](/img/blog/pr-template-fct-meme.jpeg "choose your materializations wisely")


**I have updated the README file.**  
Last but not least, the README. This doesn’t need to be updated with every single PR. 

In general, your README contains information about things such as how to get going with contributing to your dbt project, who to go to for database access, additional development resources, etc. If any of this changes as a result of your PR, make sure to update the README!


## Adding the full GitHub PR template to your repository

If you haven’t already picked it up from GitHub, the full markdown code of the dbt Labs PR template is below. After copying the PR template to your clipboard, let's walk through how to add it to your repository.

```

&lt;!---

Provide a short summary in the Title above. Examples of good PR titles:

* "Feature: add so-and-so models"

* "Fix: deduplicate such-and-such"

* "Update: dbt version 0.13.0"

-->

## Description & motivation

&lt;!---

Describe your changes, and why you're making them. Is this linked to an open

issue, a Trello card, or another pull request? Link it here.

-->

## To-do before merge

&lt;!---

(Optional -- remove this section if not needed)

Include any notes about things that need to happen before this PR is merged, e.g.:

- [ ] Change the base branch

- [ ] Update dbt Cloud jobs

- [ ] Ensure PR #56 is merged

-->

## Screenshots:

&lt;!---

Include a screenshot of the relevant section of the updated DAG. You can access

your version of the DAG by running `dbt docs generate && dbt docs serve`.

-->

## Validation of models:

&lt;!---

Include any output that confirms that the models do what is expected. This might

be a link to an in-development dashboard in your BI tool, or a query that

compares an existing model with a new one.

-->

## Changes to existing models:

&lt;!---

Include this section if you are changing any existing models. Link any related

pull requests on your BI tool, or instructions for merge (e.g. whether old

models should be dropped after merge, or whether a full-refresh run is required)

-->

## Checklist:

&lt;!---

This checklist is mostly useful as a reminder of small things that can easily be

forgotten – it is meant as a helpful tool rather than hoops to jump through.

Put an `x` in all the items that apply, make notes next to any that haven't been

addressed, and remove any items that are not relevant to this PR.

-->

- [ ] My pull request represents one logical piece of work.

- [ ] My commits are related to the pull request and look clean.

- [ ] My SQL follows the style guide.

- [ ] I have materialized my models appropriately.

- [ ] I have added appropriate tests and documentation to any new models.

- [ ] I have updated the README file.

{%- if project.warehouse == 'redshift' %}

- [ ] I have added sort and dist keys to models materialized as tables.

- [ ] I have validated the SQL in any late-binding views.

{% endif %}

```

### Create a markdown file

Copy the full PR template text above and copy it into your favorite text editor. Once you’ve done that, export the document as an `.md` file.

### Add the `.md` file to your GitHub repository

Now that you have your pull request template markdown file, navigate to the main page of your repository on GitHub. Above the list of files, using the **Add file** dropdown, click on **Create new file**. 

Once the file is added, name it whatever you want to make it clear that it’s your pull request template. A good name for the file might be `pull_request_template.md`.

### And that’s it!

With that, you now have a pull request template in your GitHub repository that can help your team follow analytics engineering best practices.

To dive deeper into how we use it as part of the analytics engineering workflow, check out the free [dbt Fundamentals on-demand course](https://courses.getdbt.com/courses/fundamentals).
