---
title: "Getting Started with git Branching Strategies and dbt"
description: "How to configure dbt Cloud with common git strategies"
slug: git-branching-strategies-with-dbt

authors: [christine_berger, carol_ohms, taylor_dunlap, steve_dowling]

tags: [analytics craft]
hide_table_of_contents: false

date: 2025-03-10
is_featured: true
---

Hi! We’re Christine and Carol, Resident Architects at dbt Labs. Our day-to-day 
work is all about helping teams reach their technical and business-driven goals. 
Collaborating with a broad spectrum of customers ranging from scrappy startups 
to massive enterprises, we’ve gained valuable experience guiding teams to 
implement architecture which addresses their major pain points.

The information we’re about to share isn't just from our experiences - we 
frequently collaborate with other experts like Taylor Dunlap and Steve Dowling 
who have greatly contributed to the amalgamation of this guidance. Their work 
lies in being the critical bridge for teams between 
implementation and business outcomes, ultimately leading teams to align on a 
comprehensive technical vision through identification of problems and solutions.

**Why are we here?**  
We help teams with dbt architecture, which encompasses the tools, processes and 
configurations used to start developing and deploying with dbt. There’s a lot of 
decision making that happens behind the scenes to standardize on these pieces - 
much of which is informed by understanding what we want the development workflow 
to look like. The focus on having the ***perfect*** workflow often gets teams 
stuck in heaps of planning and endless conversations, which slows down or even 
stops momentum on development. If you feel this, we’re hoping our guidance will 
give you a great sense of comfort in taking steps to unblock development - even 
when you don’t have everything figured out yet!

<!-- truncate -->

There are three major tools that play an important role in dbt development\:
- **A repository**  
  Contains the code we want to change or deploy, along with tools for change management processes.
- **A data platform**  
  Contains data for our inputs (loaded from other systems) and databases/schemas for our outputs, as well as permission management for data objects.
- **A dbt project**  
  Helps us manage development and deployment processes of our code to our data platform (and other cool stuff!)

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/1_dbt_eco.png" title="dbt's relationship to git and the data platform" width="85%" />

No matter how you end up **defining** your development workflow, these major steps are always present\:
- **Development**\: How teams make and test changes to code
- **Quality Assurance**\: How teams ensure changes work and produce expected outputs
- **Promotion**\: How teams move changes to the next stage
- **Deployment**\: How teams surface changes to others

This article will be focusing mainly on the topic of git and your repository, how 
code corresponds to populating your data platform, and the common dbt configurations 
we implement to make this happen. We’ll also be pinning ourselves to the steps of 
the development workflow throughout.

## Why we should focus on git
Source control (and git in particular) is foundational to modern development with 
or without dbt. It facilitates collaboration between teams of any size and makes 
it easy to maintain oversight of the code changes in your project. Understanding 
these controlled processes and what code looks like at each step makes 
understanding how we need to configure our data platform and dbt much easier.

## ⭐️ How to “just get started” ⭐️
This article will be talking about git topics in depth — this will be helpful if 
your team is familiar with some of the options and needs help considering 
the tradeoffs. If you’re getting started for the first time and don’t have strong 
opinions, **we recommend starting with Direct Promotion**.

Direct Promotion is the foundation of all git branching strategies, works well 
with basic git knowledge, requires the least amount of provisioning, and can easily 
evolve into another strategy if or when your team needs it. We understand this 
recommendation can invoke some thoughts of “what if?”. **We urge you to think 
about starting with direct promotion like getting a suit tailored**. Your 
developers can wear it while you’re figuring out the adjustments, and this is a much 
more informative step forward because it allows us to see how the suit functions 
*in motion —* our resulting adjustments can be starkly different than what we 
thought we’d need when it was static. 

The best part with ‘just getting started’ 
is that it’s not hard to change configurations in dbt for your git strategy 
later on (and we'll cover this), so don’t think of this as a critical decision that will 
that will result in months of breaking development for re-configuration if you 
don’t get it right immediately. Truly, changing your git strategy can be done in 
a matter of minutes in dbt Cloud.

## Branching strategies
Once a repository has its initial commit, it always starts with one default 
branch which is typically called `main` or `master` — we’ll be calling the 
default branch `main` in our upcoming examples. The `main` branch is *always the 
final destination that we’re aiming to land our changes, and most often 
corresponds to the term "production"* - another term you'll see us use throughout.

***How we want our workflow to look getting our changes from development to 
`main` is the big discussion***. Our process needs to consider all the steps in our 
workflow\: development, quality assurance, promotion, and deployment. 
**Branching Strategies** define what this process looks like. We at dbt are not 
reinventing the wheel - a number of common strategies have already been defined, 
implemented, iterated on, and tested for at least a decade.

There are two major strategies that encompass all forms of branching strategies\: 
**Direct Promotion** and **Indirect Promotion**. We’ll start by laying these two 
out simply\:

- What is the strategy?
- How does the development workflow of the strategy look to a team?
- Which **repository branching rules and helpers** help us in this strategy?
- How do we commonly configure **dbt Cloud** for this strategy?
- How do branches and dbt processes map to our **data platform** with this strategy?

Then, we’ll end by comparing the strategies and covering some frequently asked questions.

:::info[Know before you go]

There are *many* ways to configure each tool (especially dbt) to accomplish what you need. The upcoming 
strategy details were written intently to provide what we think are the minimal standards 
to get teams up and running quickly. These are starter configurations and practices which 
are easy to tweak and adjust later on. Expanding on these configurations is
an exercise left to the reader!

:::

## Direct promotion

**Direct promotion** means we only keep one long-lived branch 
in our repository — in our case, `main`. Here’s the workflow for this strategy\:

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/2_direct_git.png" title="Direct promotion branching strategy" width="85%" />

### How does the development workflow look to a team?

Layout\:

- `feature` is the developer’s unique branch where task-related changes happen
- `main` is the branch that contains our “production” version of code

Workflow\:

- **Development**\: I create a `feature` branch from `main` to make, test, and personally review changes
- **Quality Assurance**\: I open a pull request comparing my `feature` against `main`, which is then reviewed by peers (required), stakeholders, or subject matter experts (SMEs). We highly recommend including stakeholders or SMEs for feedback during PR in this strategy because the next step changes `main`.
- **Promotion**\: After all required approvals and checks, I merge my changes to `main`
- **Deployment**\: Others can see and use my changes in `main` after I merge and `main` is deployed

### Repository branching rules and helpers
At a minimum, we like to set up\:
- **Branch protection** on `main` ([like these settings for GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)), requiring\:
  - a pull request (no direct commits to `main`) 
  - pull requests must have at least 1 reviewer's approval
- **A PR template** ([such as our boiler-plate PR template](https://docs.getdbt.com/blog/analytics-pull-request-template)) for `feature` PRs against `main`

### dbt Cloud processes and environments

Here’s our branching strategy again, but now with the dbt Cloud processes we want to incorporate\:

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/3_direct_dbt_deployment.png" title="Direct Promotion strategy with dbt cloud processes denoted" width="85%" />

In order to create the jobs in our diagram, we need dbt Cloud environments. Here are the common configurations for this setup\: 

| Environment Name | [Environment Type](https://docs.getdbt.com/docs/dbt-cloud-environments#types-of-environments) | [Deployment Type](https://docs.getdbt.com/docs/deploy/deploy-environments#staging-environment) | Base Branch | Will handle… |
| --- | --- | --- | --- | --- |
| Development | development | - | `main` | Operations done in the IDE (including creating feature branches) |
| Continuous Integration | deployment | General | `main` | A continuous integration job |
| Production | deployment | Production | `main` | A deployment job |

### Data platform organization
Now we need to focus on where we want to build things in our data platform. For that, 
we need to set our **database** and **schema** settings on the environments.
Here’s our diagram again, but now mapping how we want our objects to populate
from our branches to our data platform\:

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/4_direct_data_population.png" title="Direct Promotion strategy with branch relations to data platform objects" width="85%" />

Taking the table we created previously for our dbt Cloud environment, let's further
map environment configurations to our data platform\:

| Environment Name | **Database** | **Schema** |
| --- | --- | --- |
| Development | `development` | User-specified in Profile Settings > Credentials |
| Continuous Integration | `development` | Any safe default, like `dev_ci` (it doesn’t even have to exist). The job we intend to set up will override the schema here anyway to denote the unique PR. |
| Production | `production` | `analytics` |

:::note
We are showing environment configurations here, but a default database will be set at the highest level in a **[connection](https://docs.getdbt.com/docs/cloud/connect-data-platform/about-connections)** (which is a required setting of an environment). *Deployment* environments can override a connection's database setting when needed.
:::

### Direct promotion example

*In this example, Steve uses the term “QA” for defining the environment which builds the changed code from feature branch pull requests. This is equivalent to our ‘Continuous Integration’ environment — this is a great example of defining names which make the most sense for your team!*

<LoomVideo id="59c71a9549b5497f99ef86622aad945e" />

## Indirect promotion

:::info[A note about Indirect Promotion]

Indirect Promotion introduces more steps of ownership, so this branching strategy 
works best when you can identify people who have a great understanding of git to 
handle branch management. Additionally, the ***time from development to production 
is lengthier*** due to the workload of these new steps, so it requires good 
project management. We expand more on this later, but it’s an important call out 
as this is where we see unprepared teams struggle most.

:::

**Indirect promotion** adds other long-lived branches that derive from `main`. 
The most simple version of indirect promotion is a two-trunk *hierarchical* structure 
— this is the one we see implemented most commonly in indirect workflows.

*Hierarchical promotion* is promoting changes back the same way we derived the branches. Example\:
- a middle branch is derived from `main`
- feature branches derive from the middle branch
- feature branches merge back to the middle branch
- the middle branch merges back to `main`

Some common names for a middle branch as seen in the wild are\:
- `qa`\: Quality Assurance
- `uat`\: User Acceptance Testing
- `staging` or `preprod`\: Common software development terminology

We’ll be calling our middle branch `qa` from throughout the rest of this article.

Here’s the workflow for this strategy\:
<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/6_indirect_git.png" title="Indirect Promotion branching strategy" width="85%" />

### How does the development workflow look to a developer?
Changes from our direct promotion workflow are highlighted in <mark style={{backgroundColor:"#d6eaf8"}}>blue</mark>.

Layout\:
- `feature` is the developer’s unique branch where task-related changes happen
- <mark style={{backgroundColor:"#d6eaf8"}}><code style={{backgroundColor: "#aed6f1"}}>qa</code> contains approved changes from developers’ <code style={{backgroundColor: "#aed6f1"}}>feature</code> branches, which will be merged to main and enter production together once additional testing is complete.<code style={{backgroundColor: "#aed6f1"}}>qa</code> is always ahead of <code style={{backgroundColor: "#aed6f1"}}>main</code> in changes.</mark>
- `main` is the branch that contains our “production” version of code

Workflow\:

- **Development**\: I create a `feature` branch from <mark style={{backgroundColor:"#d6eaf8"}}>`qa`</mark> to make, test, and personally review changes
- **Quality Assurance\:** I open a pull request comparing my `feature` branch to <mark style={{backgroundColor:"#d6eaf8"}}>`qa`</mark>, which is then reviewed by peers and <mark style={{backgroundColor:"#d6eaf8"}}>*optionally*</mark> subject matter experts or stakeholders
- **Promotion**\: After all required approvals and checks, I can merge my changes to <mark style={{backgroundColor:"#d6eaf8"}}>`qa`</mark>
- <mark style={{backgroundColor:"#d6eaf8"}}>**Quality Assurance**\: SMEs or other stakeholders can review my changes in <code style={{backgroundColor: "#aed6f1"}}>qa</code> when I merge my <code style={{backgroundColor: "#aed6f1"}}>feature</code></mark>
- <mark style={{backgroundColor:"#d6eaf8"}}>**Promotion\:** Once QA specialists give their approval of <code style={{backgroundColor: "#aed6f1"}}>qa</code>’s version of data, a **release manager** opens a pull request using <code style={{backgroundColor: "#aed6f1"}}>qa</code>’s branch targeting <code style={{backgroundColor: "#aed6f1"}}>main</code> (we define this as a **“release”**)</mark>
- **Deployment**\: Others can see and use my changes (<mark style={{backgroundColor:"#d6eaf8"}}>and other’s changes</mark>) in `main` <mark style={{backgroundColor:"#d6eaf8"}}>after <code style={{backgroundColor: "#aed6f1"}}>qa</code> is merged to <code style={{backgroundColor: "#aed6f1"}}>main</code></mark> and `main` is deployed

### Repository branching rules and helpers
At a minimum, we like to set up\:
- **Branch protection** on `main` and `qa` ([like these settings for GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)), requiring\:
  - a pull request (no direct commits to `main` or `qa`) 
  - pull requests must have at least 1 reviewer's approval
- **A PR template** ([such as our boiler-plate PR template](https://docs.getdbt.com/blog/analytics-pull-request-template)) for `feature` PRs against `qa`
- **A PR template** ([such as our boiler-plate PR template for releases](https://github.com/dbt-labs/dbt-proserv/blob/main/.github/release_pull_request_template.md)) for `qa` PRs against `main`

### dbt Cloud processes and environments

Here’s our branching strategy again, but now with the dbt Cloud processes we want to incorporate\:

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/7_indirect_dbt_deployment.png" title="Indirect Promotion strategy with dbt cloud processes denoted" width="85%" />

In order to create the jobs in our diagram, we need dbt Cloud environments. Here are the common configurations for this setup\: 

| Environment Name | [Environment Type](https://docs.getdbt.com/docs/dbt-cloud-environments#types-of-environments) | [Deployment Type](https://docs.getdbt.com/docs/deploy/deploy-environments#staging-environment) | Base Branch | Will handle… |
| --- | --- | --- | --- | --- |
| Development | development | - | `qa` | Operations done in the IDE (including creating feature branches) |
| Feature CI | deployment | General | `qa` | A continuous integration job |
| Quality Assurance | deployment | Staging | `qa` | A deployment job |
| Release CI | deployment | General | `main` | A continuous integration job |
| Production | deployment | Production | `main` | A deployment job |

### Data platform organization
Now we need to focus on where we want to build things in our data platform. For that, 
we need to set our **database** and **schema** settings on the environments.
There are two common setups for mapping code, but before we get in to those 
remember this note from direct promotion\:
:::note
We are showing environment configurations here, but a default database will be set at the highest level in a **[connection](https://docs.getdbt.com/docs/cloud/connect-data-platform/about-connections)** (which is a required setting of an environment). *Deployment* environments can override a connection's database setting when needed.
::: 

- **Configuration 1**\: A 1\:1 of `qa` and `main` assets
    In this pattern, the CI schemas are populated in a database *outside* of Production and QA. This is usually done to keep the databases aligned to what’s been merged on their corresponding branches.
    Here’s our diagram, now mapping to the data platform with this pattern\:
    <Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/8_indirect_data_population.png" title="Indirect Promotion branches and how they relate to 1\:1 organization in the data platform" width="85%" />

    Here are our configurations for this pattern\:
    | Environment Name | **Database** | **Schema** |
    | --- | --- | --- |
    | Development | `development` | User-specified in Profile Settings > Credentials |
    | Feature CI | `development` | Any safe default, like `dev_ci` (it doesn’t even have to exist). The job we intend to set up will override the schema here anyway to denote the unique PR. |
    | Quality Assurance | `qa` | `analytics` |
    | Release CI | `development` | A safe default |
    | Production | `production` | `analytics` |

- **Configuration 2**\: A reflection of the workflow initiative
    
    In this pattern, the CI schemas populate in a `qa` database because it’s a step in quality assurance.
    Here’s our diagram, now mapping to the data platform with this pattern\:
    <Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/9_alt_indirect_data_population.png" title="Indirect Promotion branches and how they relate to workflow initiative organization in the data platform" width="85%" />

    Here are our configurations for this pattern\:    
    | Environment Name | **Database** | **Schema** |
    | --- | --- | --- |
    | Development | `development` | User-specified in Profile Settings > Credentials |
    | Feature CI | `qa` | Any safe default, like `dev_ci` (it doesn’t even have to exist). The job we intend to set up will override the schema here anyway to denote the unique PR. |
    | Quality Assurance | `qa` | `analytics` |
    | Release CI | `qa` | A safe default |
    | Production | `production` | `analytics` |

### Indirect promotion example

*In this example, Steve uses the term “UAT” to define the automatic deployment of the middle branch and “QA” to define what’s built from feature branch pull requests. He also defines a database for each (with four databases total - one for development schemas, one for CI schemas, one for middle branch deployments, and one for production deployments) — we wanted to show you this example as it speaks to how configurable these processes are apart from our standard examples.*

<LoomVideo id="0e03faf9f8f7434fbe01eaf7b818e507" />

## What did indirect promotion change?

You’ve probably noticed there is one overall theme of adding our additional branch, and that’s supporting our *Quality Assurance* initiative. Let’s break it down\:

- **Development**
  
  While no one will be developing in the `qa` branch itself, it does need a level of oversight  just like a `feature` branch needs in order to stay in sync with its base branch. This is because a change now to `main` (like a hotfix or accidental merge) won’t immediately flag our `feature` branches since they are based off of `qa`'s version of code. This branch needs to stay in sync with any change in `main` for this reason.
    
- **Quality Assurance**

  There are now *two places* where quality can be reviewed (`feature` and `qa`) before changes hit production. `qa` is typically leveraged in at least one of these ways for more quality assurance work\:
    - Testing and reviewing how end-to-end changes are performing over time
    - Deploying the full image of the `qa` changes to a centralized location. Some common reasons to deploy `qa` code are\:
        - Leveraging [deferral](https://docs.getdbt.com/reference/node-selection/defer) and [Advanced](https://docs.getdbt.com/docs/deploy/advanced-ci) comparison features in CI
        - Testing builds from environment-specific data sets (dynamic sources)
        - Creating staging versions of workbooks in your BI tool.
        This is most relevant when your BI tool doesn’t do well with changing underlying schemas. For instance, some tools have better controls for grabbing a production workbook for development, switching the underlying schema to a `dbt_cloud_pr_#` schema, and reflecting those changes without breaking things. Other tools will break every column selection you have in your workbook, even if the structure is the same. For this reason, it is sometimes easier to create one “staging” version workbook and always point it to a database built from QA code - the changes then can always be reflected and reviewed from that workbook before the code changes in production.
        - For other folks who want to see or test changes,  but aren’t personas that would be included in the review process.
        For instance, you may have a subject matter expert reviewing and approving alongside developers, who understands the process of looking at `dbt_cloud_pr` schemas. However, if this person now communicates that they have just approved some changes with development to their teammates who will use those changes, the team might ask if there is a way they can also see the changes. Since the CI schema is dropped after merge, they would need to wait see this change in production if there is no process deploying the middle branch.
- **Promotion**

  There are now two places where code needs to be promoted\:
    
  - From `feature` to `qa` by a developer and peer (and optionally SMEs or stakeholders)
  - From `qa` to `main` by a release manager and SMEs or stakeholders
    
  Additionally, approved changes from feature branches are promoted together from `qa`. 
    
- **Deployment**
    
    There are now two major branches code can be deployed from\:
    
    - `qa`\: The “working” version with changes, `features` merge here
    - `main`\: The “production” version
    
    Due to our changes collecting on the `qa` branch, our deployment process 
    changes from continuous deployment (”streaming” changes to `main` in direct 
    promotion) to continuous delivery (”batched” changes to `main`). 
    Julia Schottenstein does a great job explaining the differences [here](https://www.getdbt.com/blog/adopting-ci-cd-with-dbt-cloud).
    
## Comparing branching strategies

Since most teams can make **direct promotion** work, we’ll list some key flags for when we start thinking about **indirect promotion** with a team\:

- They speak about having a dedicated environment for QA, UAT, staging, or pre-production work.
- They ask how they can test changes end-to-end and over time before things hit production.
- Their developers aren’t the same, or the only, folks who are checking data outputs for validity - especially if the other folks are more familiar performing validations from other tools (like from BI dashboards).
- Their different environments aren’t working with identical data. Like software environments, they may have limited or scrubbed versions of production data depending on the environment.
- They have a schedule in mind for making changes “public”, and want to hold features back from being seen or usable until then.
- They have very high-stakes data consumption.

If you fit any of these, you likely fit into an indirect promotion strategy. 

**Strengths and Weaknesses**

We highly recommend that you choose your branching strategy based on which *best supports* *your workflow needs* over any perceived pros and cons — when these are put in the context of your team’s structure and technical skills, you’ll find some aren’t strengths or weaknesses at all!

- **Direct promotion**
    
    Strengths
    
    - Much faster in terms of seeing changes - once the PR is merged and deployed, the changes are “in production”.
    - Changes don’t get stuck in a middle branch that’s pending the acceptance of someone else’s validation on data output.
    - Management is mainly distributed - every developer owns their own branch and ensuring it’s in sync with what’s in `main`.
    - There’s no releases to worry about, so no extra processes to manage.
    
    Weaknesses
    
    - It can present challenges for testing changes end-to-end or over time in an environment that isn't production. Our desire to build only modified and directly impacted models to reduce the amount of models executed in CI goes against the grain of full end-to-end testing, and our CI mechanism (which executes only upon pull request or new commit) won’t help us test over time.
    - It can be more difficult for differing schedules or technical abilities when it comes to review. It’s essential in this strategy to include stakeholders or subject matter experts on pull requests *before merge,* because the next step is production. Additionally, some tools aren’t great at switching databases and schemas even if the shape of the data is the same. Constant breakage of reports for review can be too much overhead.
    - It can be harder to test configurations or job changes before they hit production, especially if things function a bit differently based on environment.
    - It can be harder to share code that works fully but isn’t a full reflection of a complete task. Changes need to be agreed upon to go to production so others can pull them in, otherwise developers need to know how to pull these in from other branches that aren’t `main` (and be aware of staying in sync or risk merge conflicts).

- **Indirect promotion**
    
    Strengths
    
    - There’s a dedicated environment to test end-to-end changes over time.
    - Data outputs can be reviewed either with a developer on PR or once things are in the middle branch.
    - Review from other tools is much easier because we have the option of deploying our middle branch to a centralized location. “Staging” reports can be set up to always refer to this location for reviewing changes, and processes for creating new reports can flow from staging to production.
    - Configurations and job changes can be tested with production-like parameters before they actually hit production.
    - Changes merged to the middle branch for shared development won't be reflected in production. Consumers of `main` will be none-the-wiser about the things that developers do for ease of collaboration.
    
    Weaknesses
    
    - Changes can be slower to get to production due to the extra processes intended for the middle branch. In order to keep things moving, there should be someone (or a group of people) in place who fully own managing the changes, validation status, and release cycle.
    - Changes that are valid can get stuck behind other changes that aren’t - having a good plan in place for how the team should handle this scenario is essential because conundrum can hold up getting things to production.
    - There’s extra management of any new trunks, which will need ownership - without someone (or a group of people) who are knowledgeable, it can be confusing understanding what needs to be done and how to do it when things get out of sync.
    - It can require additional compute in the form of scheduled jobs in the QA environment, as well as an additional CI job from `qa` > `main` for testing releases before they're merged.

# Further enhancements

Once you have your basic configurations in place, you can further tweak your project by considering which other features will be helpful for your needs\:

- Continuous Integration\:
    - [Only running and testing changed models](https://docs.getdbt.com/docs/deploy/ci-jobs#set-up-ci-jobs) and their dependencies
    - Using [dbt clone](https://docs.getdbt.com/reference/commands/clone) to get a copy of large incrementals in CI
- Development and Deployment\:
    - Using [schema configurations](https://docs.getdbt.com/docs/build/custom-schemas) in the project to add more separation in a database
    - Using [database configurations](https://docs.getdbt.com/docs/build/custom-databases) in the project to switch databases for model builds

# Frequently asked git questions

**General**

<details>

<summary>How do you prevent developers from changing specific files?</summary>
<p>

Many git providers have a CODEOWNERS feature which can be leveraged to tag appropriate reviewers when certain files or folders are changed.

</p>
</details>


<details>

<summary>How do you execute other types of checks in the development workflow?</summary>
<p>

Auto-formatting and linting are both [features available in dbt Cloud's IDE](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format#format). You can enable linting [within your CI job](https://docs.getdbt.com/docs/deploy/continuous-integration#sql-linting).

Other types of checks are typically implemented through external pipelines, and usually through the git provider due to the alignment of where these checks are desired in the development workflow. Many git providers have pipeline features available, such as GitHub's Actions or Gitlab's CI/CD Pipelines. Here's an example which [checks that a branch name follows a pattern upon a pull request event](https://medium.com/@durgeshm01722/add-a-branch-naming-pattern-status-check-to-your-github-prs-660c53331b68)).
    
</p>
</details>

<details>

<summary>How do you revert changes?</summary>
<p>

This is an action performed outside of dbt through git operations, but an immediate solution can be implemented using git tags/releases until your code is fixed to your liking\:

- Apply a git tag (a feature on most git platforms) on the commit SHA that you want to roll back to
- Use the tag as your `custom branch` on your production environment in dbt Cloud. Your jobs will now check out the code at this point in time.
- Now you can work as normal. Fix things through the development workflow or have a knowledgeable person revert the changes through git, it doesn’t matter - production is pinned to the previous state until you change the custom branch back to `main`!
 
</p>
</details>

**Indirect promotion-specific**

<details>

<summary>How do you make releases?</summary>
<p>

In our examples, we noted that our definition of a release is a pull request from `qa` to `main`, and this is opened from the git platform. 

**Having the source branch as `qa` on your pull request will also incorporate any new merges to `qa` while your PR stays open, possibly resulting in other features being promoted to `main` unintentionally once you merge.** Because of this, it’s important that the person opening a release stays up to date on merges and last runs to ensure the validity of changes before the release is merged. There are two options we like to implement to make this easier\:
- A CI job for pull requests against `main`: this will run a CI job comparing our middle branch to `main` at release time, and will rerun when there are any new merges to `qa`. Not only that, but the status will show on our pull request and we can leverage other features like [GitHub's required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks) to further ensure we're only merging successful and tested changes.
- An [on-merge job](https://docs.getdbt.com/docs/deploy/merge-jobs) using our `qa` environment. This will run a job any time someone merges. You may opt for this if you’d rather not wait on a CI pipeline to finish when you open a release. However, this will not put a status on a release PR and we wouldn't be able to block anyone on merging a release based on run status. When using this method, the release owner should still be staying up to date with merges and status of latest run before merge.

</p>
</details>

<details>

<summary>Hierarchical promotion introduces changes that may not be ready for production yet, which holds up releases. How do you manage that?</summary>
<p>

The process of choosing specific commits to move to another branch is called **Cherry Picking**. 

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/11_cherry_picking.png" title="Cherry Picking diagram" width="85%" />

You may be tempted to change to a less standard branching strategy to avoid this - our colleague Grace Goheen has [written some thoughts on this](https://docs.getdbt.com/blog/the-case-against-git-cherry-picking) and provided examples - it’s a worthwhile read!

dbt does not perform cherry picking operations and this needs to be done from a command line interface or your git platform’s user interface, if the option is available. We align with Grace on this one — not only does cherry picking require a very good understanding of git operations and the state of the branches, but when it isn’t done with care, it can introduce a host of other issues that can be hard to resolve. What we tend to see is that the CI processes we’ve exemplified instead shift what the definition of the first PR’s approval is - not only can it be approved for coding and syntax by a peer, but it can also be approved for it’s output by selecting from objects built within the CI schema. This eliminates a lot of the issues with encountering code that can’t be merged to production.

We also implement other features that help us in trying times:
- The [`--exclude`](https://docs.getdbt.com/reference/node-selection/exclude) command flag helps us omit building models in a job
- The [`enabled`](https://docs.getdbt.com/reference/resource-configs/enabled) configuration helps us keep models from being executed in any job for a longer-term solution
- Using [contracts](https://docs.getdbt.com/docs/mesh/govern/model-contracts) and [versions](https://docs.getdbt.com/docs/mesh/govern/model-versions) helps alleviate breaking code changes between teams in dbt Mesh
- [Unit tests](https://docs.getdbt.com/docs/build/unit-tests) and [data tests](https://docs.getdbt.com/docs/build/data-tests), along with forming best practices around the minimum requirements for every model, helps us continuously test our expectations (see the [dbt_meta_testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest/) package)
- Using the [dbt audit helper](https://hub.getdbt.com/dbt-labs/audit_helper/latest) package or [enabling advanced CI on our continuous integration jobs](https://docs.getdbt.com/docs/deploy/advanced-ci) helps us understand the impacts our changes make to the original data set

If you are seeing a need to cherry-pick regularly, assessing your review and quality assurance processes and where they are happening in your pipeline can be very helpful in determining how you can avoid it.
    
</p>
</details>

<details>

<summary>What if a bad change made it all the way in to production?</summary>
<p>

The process of fixing `main` directly is called a **hotfix**. This needs to be done with git locally or with your git platform’s user interface because dbt’s IDE is based on the branch you set for your developers to base from (in our case, `qa`).

The pattern for hotfixes in hierarchical promotion looks like this\:

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/12_hotfixes.png" title="Hotfix diagram" width="85%" />

Here’s how it’s typically performed\:

1. Create a branch from `main`, then make the change and test the fix.
2. Open a PR to `main`, get the fix approved, then merged. The fix is now live.
3. Check out `qa`, and `git pull` to ensure it’s up to date with what’s on the remote.
4. Merge `main` into `qa`\: `git merge main`.
5. `git push` the changes back to the remote.
6. At this point in our example, developers will be flagged in dbt Cloud’s IDE that there is a change on their base branch and can ”Pull from remote”. However, if you implement more than one middle branch you will need to continue resolving your branches hierarchically until you update the branch that developers base from.

</p>
</details>

<details>

<summary>What if we want to use more than one middle branch in our strategy?</summary>
<p>

In our experience, using more than one middle branch is rarely needed. The more steps you are away from main, the more hurdles you’ll need to jump through getting back to it. If your team isn’t properly equipped, this ends up putting a lot of overhead on development operations. For this reason, we don’t recommend more branches if you can help it. The teams who are successful with more trunks are built with plenty of folks who can properly dedicate the time and management to these processes. 

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/13_more_branches.png" title="A git strategy with more branches" width="85%" />

This structure is mostly desired when there are requirements for using different versions data (i.e scrubbed data) by different teams, but working with the same code changes. This structure allows each team to have a dedicated environment for deployments. Example\:

1. Developers work off of mocked data for their `feature` branches and merge to `qa` for end-to-end and over-time testing of all merged changes using the mocked data before releasing to `preproduction`.
2. Once `qa` is merged to `preproduction`, the underlying data being used switches to using scrubbed production data and other personas can start looking at and reviewing how this data is functioning before it hits production.
3. Once `preproduction` is merged to `main`, the underlying data being used switches to production data sets. 

To show a comparison, this same use case can be covered with a more simple branching strategy through the use of git tags and [dbt environment variables](https://docs.getdbt.com/docs/build/environment-variables) to switch source data\:

- Indirect Promotion\:
    
    <Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/14_indirect_tagging.png" title="Tagging in Indirect Promotion" width="85%" />

- Direct Promotion\:
    
    <Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/15_direct_tagging.png" title="Tagging in Direct Promotion" width="85%" />

Whichever option you decide depends on how your team would like to manage the changes. No matter the reason for more branches, these points are always relevant to plan out\:

- Can we accurately describe the use case of each branch?
- Who owns the oversight of any new branches?
- Who are the major players in the promotion process between each branch and what are they responsible for?
- Which major branches do we want dbt Cloud deployment jobs for?
- Which PR stages do we want continuous integration jobs on?
- Which major branch rules or PR templates do we need to add?

By answering these questions, you should be able to follow our same guidance from our examples for setting up your additional branches.
    
</p>
</details> 

**Direct promotion-specific** 

<details>

<summary>We need a middle environment and don’t want to change our branching strategy! Is there any way to reflect what’s in development?</summary>
<p>

git releases/tags are a mechanism which help you label a specific commit SHA. *Deployment environments* in dbt Cloud can use these just like they can a custom branch. Teams will leverage this either to pin their environments to code at a certain point in time or to keep as a roll-back option, if needed. 

We can use the pinning method to create our middle environment. Example\:

- We create a release tag, `v2`, from our repository.
- We specify `v2` as our branch in our Production environment’s **custom branch** setting.
Jobs using Production will now check out code at `v2`.
- We set up an environment called “QA”, with the **custom branch** setting as `main`. For the database and schema, we specify the `qa` database and `analytics` schema. Jobs created using this environment will check out code from `main` and build it to `qa.analytics`.

<Lightbox src="/img/blog/2025-01-28-git-branching-strategies-and-dbt/16_direct_tagging_middle_env.png" title="Tagging in Direct Promotion to create a middle environment" width="85%" />

<LoomVideo id="dfe057bf92b2498eb1e653c32fc72e93" />

</p>
</details>

<details>

<summary>How do we change from a direct promotion strategy to an indirect promotion strategy?</summary>
<p>

Here’s the additional setup steps in a nutshell (using the name `qa` for our middle environment) - for more details be sure to read through the indirect promotion section\:

- git Platform
    - Create a new branch called `qa`, which is derived from `main`
    - Protect `qa` with branch protection rules
- dbt Cloud
    - Development\: Switch your environment to use the **custom branch** option and specify `qa`. This will base developers now off of `qa` code.
    - Continous Integration\: If you have an existing job for this, ensure the **custom branch** is changed to `qa`. This will change the CI job’s trigger to occur on pull requests to `qa`.

**At this point, your developers will be following the indirect promotion workflow and you can continue working on things in the background.** You may still need to set up a database, database permissions, environments, deployment jobs, etc. Here is a short checklist to help you out! Refer back to our section on indirect promotion for many more details\:

- **Decide if you want to deploy QA code.** Many folks will deploy so they can make use of deferral and Advanced CI features. If so\:**
    - Create the database where the objects will build
    - Set up a service account for QA and give it all the proper permissions to create and modify the contents within this database. It should also have select-only access to raw data.
    - Set up an environment for QA in dbt Cloud, being sure to connect it to the database and schema you want your deployments to build in.
    - Set up any deployment jobs using the QA environment.
    - If you want to use deferral or advanced features in CI, be sure that you first have a successful run in QA and then set your deferral setting on your CI job to the QA environment.

- **Decide if you want CI on release pull requests (from `qa` to `main`). If so\:**
    - Set up an environment called “Release CI”
    - Set up the continuous integration job using the “Release CI” environment
    - If you want to leverage deferral or advanced CI features, defer to your production environment.

</p>
</details>
