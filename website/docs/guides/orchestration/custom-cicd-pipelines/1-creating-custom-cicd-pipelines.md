---
title: Creating Custom CI/CD Pipelines
id: 1-creating-custom-cicd-pipelines
---

# Creating Custom CI/CD Pipelines

## Background

One of the core tenants of dbt is that analytic code should be version controlled. This provides a ton of benefit to your organization in terms of collaboration, code consistency, stability, and the ability to roll back to a prior version. There’s an additional benefit that is provided with your code hosting platform that is often overlooked or underutilized. Some of you may have experience using dbt Cloud’s [webhook functionality](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) to run a job when a PR is created. This is a fantastic capability, and meets most use cases for testing your code before merging to production. However, there are circumstances when an organization wants to add a bit to this, like running workflows on every commit (linting), or running workflows after a merge is complete. In this article, we will show you how to setup custom pipelines to lint your project, and trigger a dbt Cloud job via the API.

A note on parlance in this article since each code hosting platform uses different terms for similar concepts. From here on out, anytime you see `pipeline` in this article is interchangeable with `action` (GitHub) and `workflow` (GitLab). Additionally, the terms `pull request` (PR) and `merge request` (MR) are also used interchangeably.  

<br> 

## What are pipelines?

Pipelines are a series of pre-defined jobs that are triggered by specific events in your repository (PR created, commit pushed, branch merged, etc). Those jobs can do pretty much anything your heart desires assuming you have the proper security access and coding chops. 

Jobs are executed on [runners](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#runners), which are virtual servers. The runners come pre-configured with Ubuntu Linux, macOS, or Windows. That means the commands you execute are determined by the operating system of your runner. You’ll see how this comes into play later in the setup, but for now just remember that your code is executed on virtual servers that are, typically, hosted by the code hosting platform.

![Diagram of how pipelines work](/img/guides/orchestration/custom-cicd-pipelines/pipeline-diagram.png)

Please note, runners hosted by your code hosting platform provide a certain amount of free time. After that, billing charges may apply depending on how your account is setup. You also have the ability to host your own runners. That is beyond the scope of this article, but checkout the links below for more information if you’re interested in setting that up:

- Repo-hosted runner billing information:
  - [GitHub](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
  - [GitLab](https://docs.gitlab.com/ee/ci/pipelines/cicd_minutes.html)
- Self-hosted runner information:
  - [GitHub](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
  - [GitLab](https://docs.gitlab.com/runner/)

Additionally, if you’re using the free tier of GitLab you can still follow this guide, but it may ask you to provide a credit card to verify your account. You’ll see something like this the first time you try to run a pipeline:

![Warning from GitLab showing payment information is required](/img/guides/orchestration/custom-cicd-pipelines/gitlab-cicd-payment-warning.png)

<br>

## How to setup pipelines

This guide provides details for multiple code hosting platforms. Where steps are unique, they are presented without a selection option. If code is specific to a platform (i.e. GitHub, GitLab) you will see a selection option for each.

Pipelines can be triggered by various events. The [dbt Cloud webhook](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) process already triggers a run if you want to run your jobs on a merge request, so this guide focuses on running pipelines for every push and when PRs are merged. Since pushes happen frequently in a project, we’ll keep this job super simple and fast by linting with SQLFluff. The pipeline that runs on merge requests will run less frequently, and can be used to call the dbt Cloud API to trigger a specific job. This can be helpful if you have specific requirements that need to happen when code is updated in production, like running a `--full-refresh` on all impacted incremental models. 

Here’s a quick look at what this pipeline will accomplish:

![Diagram showing the pipelines to be created and the programs involved](/img/guides/orchestration/custom-cicd-pipelines/pipeline-programs-diagram.png)

<br>

## Setting up lint on push

This section shows a very basic example of linting a project every time a commit is pushed to the repo. While it is simple, it shows the power of CI and can be expanded on to meet the needs of your organization. 

<br>

### 1. Create a yaml file to define your pipeline

The yaml files defined below are what tell your code hosting platform the steps to run. In this setup, you’re telling the platform to run a SQLFluff lint job every time a commit is pushed.

<details>
<summary> GitHub </summary>
    
In order for GitHub to know that you want to run an action, you need to have a few specific folders in your project. Add a new folder named `.github`, and within that folder add a new one named `workflows`. Your final folder structure will look like this: 
    
```yaml
my_awesome_project
├── .github
│   ├── workflows
│   │   └── lint_on_push.yml
```

To define the job for our action, let’s add a new file named `lint_on_push.yml` under the `workflows` folder. This file is how we tell the GitHub runner what to execute when the job is triggered.

Below I touch on the important pieces for running a dbt Cloud job, but if you want a full run-down of all the components of this yaml file checkout [this GitHub article](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file) on actions.

**Key pieces:**

- `on:` - this is used to filter when the pipeline is run. In this example we’re running it on every push except for pushes to branches named `main`. For more filters, checkout [GitHub’s docs](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
- `runs-on: ubuntu-latest` - this defines the operating system we’re using to run the job
- `uses:` - remember the virtual servers we coved in the background section? They’re just empty operating systems, so there are two pieces of setup that are needed in order to access the code in your repo, and setup Python correctly on the virtual server. These two actions are called from other repos in GitHub to provide those services. For more information on them, checkout their repos: [actions/checkout](https://github.com/actions/checkout#checkout-v3) and [actions/setup-python](https://github.com/actions/setup-python#setup-python-v3).
- `run:` - this is how we’re telling the GitHub runner to execute the Python script we defined above.

```yaml
name: lint dbt project on push

on:
    push:
    branches-ignore:
        - 'main'

jobs:
    # this job runs SQLFluff with a specific set of rules
    # note the dialect is set to Snowflake, so make that specific to your setup
    # details on linter rules: https://docs.sqlfluff.com/en/stable/rules.html
    lint_project:
    name: Run SQLFluff linter
    runs-on: ubuntu-latest

    steps:
        - uses: "actions/checkout@v3"
        - uses: "actions/setup-python@v2"
        with:
            python-version: "3.9"
        - name: Install SQLFluff
        run: "pip install sqlfluff==0.13.1"
        - name: Lint project
        run: "sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022"

```

</details>   

<details>
<summary> GitLab </summary>

Create a `.gitlab-ci.yml` file in your **root directory** to define the triggers for when to execute the script above. You’ll put the code below into this file.

```sql
my_awesome_project
├── dbt_project.yml
├── .gitlab-ci.yml
```

**Key pieces:**

- `image: python:3.9` - this defines the virtual image we’re using to run the job
- `rules:` - this is used to filter when the pipeline runs. In this case we’re telling it to run on every push event except when the branch is named `main`. Filters are very powerful to run commands on specific events, and you can find a full list in [GitLab’s documentation](https://docs.gitlab.com/ee/ci/yaml/#rules).
- `script:` - this is how we’re telling the GitLab runner to execute the Python script we defined above.

```yaml
image: python:3.9

stages:
    - pre-build

# this job runs SQLFluff with a specific set of rules
# note the dialect is set to Snowflake, so make that specific to your setup
# details on linter rules: https://docs.sqlfluff.com/en/stable/rules.html
lint-project:
    stage: pre-build
    rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH != 'main'
    script:
    - pip install sqlfluff==0.13.1
    - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022
```

</details>

<br>

### 2. Commit and push your changes to make sure everything works

After you finish creating the yaml files, commit and push your code. Doing this will trigger your pipeline for the first time! If everything goes well, you should see the pipeline in your code platform. When you click into the job you’ll get a log showing that SQLFluff was run. If your code failed linting you’ll get an error in the job with a description of what needs to be fixed. If everything passed the lint check, you’ll see a successful job run.

<details>
<summary> GitHub </summary>

In your repository, click the *Actions* tab

![Image showing the GitHub action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-github.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in GitHub for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-github.png)
</details>
    
<details>
<summary> GitLab </summary>
    
In the menu option got to *CI/CD > Pipelines*

![Image showing the GitLab action for lint on push](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-gitlab.png)

Sample output from SQLFluff in the `Run SQLFluff linter` job:

![Image showing the logs in GitLab for the SQLFluff run](/img/guides/orchestration/custom-cicd-pipelines/lint-on-push-logs-gitlab.png)
</details>

<br>

## Setting up dbt Cloud run on merge to main

This job will take a bit more to setup, but is a good example of how to call the dbt Cloud API from a CI/CD pipeline. The concepts persented here can be generalized and used in whatever way best suits your use case.

<br>

### 1. Get your dbt Cloud API key

When running a CI/CD pipeline you’ll want to use a service token instead of any individual’s API key. There are [detailed docs](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens) available on this, but below is a quick rundown (this must be performed by an Account Admin):

- Login to your dbt Cloud account
- In the upper left, click the menu button, then *Account Settings*
- Click *Service Tokens* on the left
- Click *New Token* to create a new token specifically for CI/CD API calls
- Name your token something like “CICD Token”
- Click the *+Add* button under *Access,* and grant this token the *Job Admin* permission
- Click *Save* and you’ll see a grey box appear with your token. Copy that and save it somewhere safe (this is a password, and should be treated as such).

![View of the dbt Cloud page where service tokens are created](/img/guides/orchestration/custom-cicd-pipelines/dbt-service-token-page.png)

Here’s a video showing the steps as well:

<WistiaVideo id="iub17te9ir" />

<br>

### 2. Put your dbt Cloud API key into your repo

This next part will happen in you code hosting platform. We need to save your API key from above into a repository secret so the job we create can access it. It is **not** recommended to ever save passwords or API keys in your code, so this step ensures that your key stays secure, but is still usable for your pipelines. 

<details>
<summary> GitHub </summary>
    
In GitHub:

- Open up your repository where you want to run the pipeline (the same one that houses your dbt project)
- Click *Settings* to open up the repository options
- On the left click the *Security* dropdown
- From that list, click on *Actions*
- Towards the middle of the screen, click the *New repository secret* button
- It will ask you for a name, so let’s call ours `DBT_API_KEY`
    - **It’s very important that you copy/paste this name exactly because it’s used in the scripts below.**
- In the *Value* section, paste in the key you copied from dbt Cloud
- Click *Add secret* and you’re all set!

** A quick note on security: while using a repository secret is the most straightforward way to setup this secret, there are other options available to you in GitHub. They’re beyond the scope of this guide, but could be helpful if you need to create a more secure environment for running actions. Checkout GitHub’s documentation on secrets [here](https://docs.github.com/en/actions/security-guides/encrypted-secrets).*

Here’s a video showing these steps:

<WistiaVideo id="u7mo30puql" />

</details>

<details>
<summary> GitLab </summary>
    
In GitLab:

- Open up your repository where you want to run the pipeline (the same one that houses your dbt project)
- Click *Settings* > *CI/CD*
- Under the *Variables* section, click *Expand,* then click *Add variable*
- It will ask you for a name, so let’s call ours `DBT_API_KEY`
    - **It’s very important that you copy/paste this name exactly because it’s used in the scripts below.**
- In the *Value* section, paste in the key you copied from dbt Cloud
- Make sure the check box next to *Protect variable* is unchecked, and the box next to *Mask variable* is selected (see below)
    - “Protected” means that the variable is only available in pipelines that run on protected branches or protected tags - that won’t work for us because we want to run this pipeline on multiple branches. “Masked” means that it will be available to your pipeline runner, but will be masked in the logs.
    
    ![View of the GitLab window for entering DBT_API_KEY](/img/guides/orchestration/custom-cicd-pipelines/dbt-api-key-gitlab.png)
    
    Here’s a video showing these steps:
    
    <WistiaVideo id="rgqs14f816" />

</details>

<br>

### 3. Copy down the Python script that calls dbt Cloud

In your dbt Cloud project, create a new folder at the root level named `python`. In that folder, create a file named `run_and_monitor_dbt_job.py`. You’ll copy/paste the contents from this [gist](https://gist.github.com/b-per/f4942acb8584638e3be363cb87769b48) into that file.

```yaml
my_awesome_project
├── python
│   └── run_and_monitor_dbt_job.py
```

This Python file has everything you need to call the dbt Cloud API, but requires a few inputs (see snip below). Those inputs are fed to this script through environment variables that will be defined in the next step.

```python
#------------------------------------------------------------------------------
# get environment variables
#------------------------------------------------------------------------------
api_base        = os.getenv('DBT_URL', 'https://cloud.getdbt.com/') # default to multitenant url
job_cause       = os.getenv('DBT_JOB_CAUSE', 'API-triggered job') # default to generic message
git_branch      = os.getenv('DBT_JOB_BRANCH', None) # default to None
schema_override = os.getenv('DBT_JOB_SCHEMA_OVERRIDE', None) # default to None
api_key         = os.environ['DBT_API_KEY']  # no default here, just throw an error here if key not provided
account_id      = os.environ['DBT_ACCOUNT_ID'] # no default here, just throw an error here if id not provided
project_id      = os.environ['DBT_PROJECT_ID'] # no default here, just throw an error here if id not provided
job_id          = os.environ['DBT_PR_JOB_ID'] # no default here, just throw an error here if id not provided
```

**Required input:**

In order to call the dbt Cloud API, there are a few pieces of info the script needs. The easiest way to get these values is to open up the job you want to run in dbt Cloud. The URL when you’re inside the job has all the values you need:

- `DBT_ACCOUNT_ID` - this is the number just after `accounts/` in the URL
- `DBT_PROJECT_ID` - this is the number just after `projects/` in the URL
- `DBT_PR_JOB_ID` - this is the number just after `jobs/` in the URL

![Image of a dbt Cloud job URL with the pieces for account, project, and job highlighted](/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-url.png)

<br>

### 4. Update your project to include the new API call

<details>
<summary> GitHub </summary>
    
For this new job, we’ll add a file for the dbt Cloud API call named `dbt_run_on_merge.yml`.

```yaml
my_awesome_project
├── python
│   └── run_and_monitor_dbt_job.py
├── .github
│   ├── workflows
│   │   └── dbt_run_on_merge.yml
│   │   └── lint_on_push.yml
```

The yaml file will look pretty similar to our earlier job, but there is a new section called `env` that we’ll use to pass in the required variables. Update the variables below to match your setup based on the comments in the file.

Since these are so important, it’s worth noting that we changed the `on:` section to now run **only** when there are pushes to a branch named `main` (i.e. a PR is merge). Have a look through [GitHub’s docs](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) on these filters for additional use cases.

```yaml
    
name: run dbt Cloud job on push

# This filter says only run this job when there is a push to the main branch
# This works off the assumption that you've restrictred this branch to only all PRs to push to the deafult branch
# Update the name to match the name of your default branch
on:
    push:
    branches:
        - 'main'

jobs:

    # the job calls the dbt Cloud API to run a job
    run_dbt_cloud_job:
    name: Run dbt Cloud Job
    runs-on: ubuntu-latest

    # Set the environment variables needed for the run
    env:
        DBT_ACCOUNT_ID: 00000 # enter your account id
        DBT_PROJECT_ID: 00000 # enter your project id
        DBT_PR_JOB_ID:  00000 # enter your job id
        DBT_API_KEY: ${{ secrets.DBT_API_KEY }}
        DBT_JOB_CAUSE: 'GitHub Pipeline CI Job' 
        DBT_JOB_BRANCH: ${{ github.ref_name }}

    steps:
        - uses: "actions/checkout@v3"
        - uses: "actions/setup-python@v2"
        with:
            python-version: "3.9"
        - name: Run dbt Cloud job
        run: "python python/run_and_monitor_dbt_job.py"
```

</details>
    
<details>
<summary> GitLab </summary>

For this new job we just need to add some info to the existing `gitlab-ci.yml` file. The yaml file will look pretty similar to our earlier job, but there is a new section called `variables` that we’ll use to pass in the required variables to the Python script. Update this section to match your setup based on the comments in the file.

Since these are so important, it’s worth noting that we changed the `rules:` section to now run **only** when there are pushes to a branch named `main` (i.e. a PR is merge). Have a look through [GitLab’s docs](https://docs.gitlab.com/ee/ci/yaml/#rules) on these filters for additional use cases.

```yaml
image: python:3.9

variables:
    DBT_ACCOUNT_ID: 00000 # enter your account id
    DBT_PROJECT_ID: 00000 # enter your project id
    DBT_PR_JOB_ID:  00000 # enter your job id
    DBT_API_KEY: $DBT_API_KEY # secret variable in gitlab account
    DBT_URL: https://cloud.getdbt.com 
    DBT_JOB_CAUSE: 'GitLab Pipeline CI Job' 
    DBT_JOB_BRANCH: $CI_COMMIT_BRANCH

stages:
    - pre-build
    - build

# this is the job from the earlier step
lint-project:
    stage: pre-build
    rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH != 'main'
    script:
    - pip install sqlfluff==0.13.1
    - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022

# the second job calls the dbt Cloud API to run a job
run-dbt-cloud-job:
    stage: build
    rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH == 'main'
    script:
    - python python/run_and_monitor_dbt_job.py
```

</details>
<br>

### 5. Test your new action

Now that you have a shiny new action, it’s time to test it out! Since this change is setup to only run on merges to your default branch, you’ll need to create and merge this change into your main branch. Once you do that, you’ll see a new pipeline job has been triggered to run the dbt Cloud job you assigned in the variables section. 

Additionally, you’ll see the job in the run history of dbt Cloud. It should be fairly easy to spot because it will say it was triggered by the API, and the *INFO* section will have the branch you used for this guide.

<details>
<summary> GitHub </summary>
    
![dbt run on merge job in GitHub](/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-github.png)

![dbt Cloud job showing it was triggered by GitHub](/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-github.png)
</details>

<details>
<summary> GitLab </summary>
    
![dbt run on merge job in GitLub](/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-gitlab.png)

![dbt Cloud job showing it was triggered by GitLub](/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-gitlab-triggered.png)
</details>

<br>

## Something to Consider

Running dbt Cloud jobs through a CI/CD pipeline is a form of job orchestration. If you also run jobs using dbt Cloud’s built in scheduler, you now have 2 orchestration tools running jobs. The risk with this is that you could run into conflicts - you can imagine a case where you are triggering a pipeline on certain actions and running scheduled jobs in dbt Cloud, you would probably run into job clashes. The more tools you have, the more you have to make sure everything talks to each other. 

That being said, if **the only reason you want to use pipelines is for adding a lint check or run on merge**, you might decide the pros outweigh the cons, and as such you want to go with a hybrid approach. Just keep in mind that if two processes try and run the same job at the same time, dbt Cloud will queue the jobs and run one after the other. It’s a balancing act but can be accomplished with diligence to ensure you’re orchestrating jobs in a manner that does not conflict.