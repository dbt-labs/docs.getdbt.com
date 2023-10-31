---
title: Run a dbt Cloud job on merge 
id: 3-dbt-cloud-job-on-merge
---

This job will take a bit more to setup, but is a good example of how to call the dbt Cloud API from a CI/CD pipeline. The concepts presented here can be generalized and used in whatever way best suits your use case.

The setup below shows how to call the dbt Cloud API to run a job every time there's a push to your main branch (The branch where pull requests are typically merged. Commonly referred to as the main, primary, or master branch, but can be named differently).


### 1. Get your dbt Cloud API key

When running a CI/CD pipeline you’ll want to use a service token instead of any individual’s API key. There are [detailed docs](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens) available on this, but below is a quick rundown (this must be performed by an Account Admin):

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

### 2. Put your dbt Cloud API key into your repo

This next part will happen in you code hosting platform. We need to save your API key from above into a repository secret so the job we create can access it. It is **not** recommended to ever save passwords or API keys in your code, so this step ensures that your key stays secure, but is still usable for your pipelines. 

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Azure DevOps', value: 'ado', },  
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

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
</TabItem>

<TabItem value="gitlab">

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
    
</TabItem>
<TabItem value="ado">

In Azure:

- Open up your Azure DevOps project where you want to run the pipeline (the same one that houses your dbt project)
- Click on *Pipelines* and then *Create Pipeline*
- Select where your git code is located. It should be *Azure Repos Git*
  - Select your git repository from the list
- Select *Starter pipeline* (this will be updated later in Step 4)
- Click on *Variables* and then *New variable*
- In the *Name* field, enter the `DBT_API_KEY`
    - **It’s very important that you copy/paste this name exactly because it’s used in the scripts below.**
- In the *Value* section, paste in the key you copied from dbt Cloud
- Make sure the check box next to *Keep this value secret* is checked. This will mask the value in logs, and you won't be able to see the value for the variable in the UI.
- Click *OK* and then *Save* to save the variable
- Save your new Azure pipeline

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-api-key-azure.png" title="View of the Azure pipelines window for entering DBT_API_KEY"/>

</TabItem> 
<TabItem value="bitbucket">

In Bitbucket:

- Open up your repository where you want to run the pipeline (the same one that houses your dbt project)
- In the left menu, click *Repository Settings*
- Scroll to the bottom of the left menu, and select *Repository variables*
- In the *Name* field, input `DBT_API_KEY`
    - **It’s very important that you copy/paste this name exactly because it’s used in the scripts below.**
- In the *Value* section, paste in the key you copied from dbt Cloud
- Make sure the check box next to *Secured* is checked. This will mask the value in logs, and you won't be able to see the value for the variable in the UI.
- Click *Add* to save the variable
    
    ![View of the Bitbucket window for entering DBT_API_KEY](/img/guides/orchestration/custom-cicd-pipelines/dbt-api-key-bitbucket.png)
    
    Here’s a video showing these steps:
    <WistiaVideo id="1fddpsqpfv" />
    
</TabItem>
</Tabs>

### 3. Create script to trigger dbt Cloud job via an API call

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

### 4. Update your project to include the new API call

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Azure DevOps', value: 'ado', },
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

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

The YAML file will look pretty similar to our earlier job, but there is a new section called `env` that we’ll use to pass in the required variables. Update the variables below to match your setup based on the comments in the file.

It’s worth noting that we changed the `on:` section to now run **only** when there are pushes to a branch named `main` (i.e. a PR is merge). Have a look through [GitHub’s docs](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) on these filters for additional use cases.

```yaml
name: run dbt Cloud job on push

# This filter says only run this job when there is a push to the main branch
# This works off the assumption that you've restricted this branch to only all PRs to push to the default branch
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
      - uses: "actions/setup-python@v4"
        with:
          python-version: "3.9"
      - name: Run dbt Cloud job
        run: "python python/run_and_monitor_dbt_job.py"
```

</TabItem>
<TabItem value="gitlab">

For this job, we'll set it up using the `gitlab-ci.yml` file as in the prior step (see Step 1 of the linting setup for more info). The YAML file will look pretty similar to our earlier job, but there is a new section called `variables` that we’ll use to pass in the required variables to the Python script. Update this section to match your setup based on the comments in the file.

Please note that the `rules:` section now says to run **only** when there are pushes to a branch named `main`, such as a PR being merged. Have a look through [GitLab’s docs](https://docs.gitlab.com/ee/ci/yaml/#rules) on these filters for additional use cases.

<Tabs
  defaultValue="single-job"
  values={[
    { label: 'Only dbt Cloud job', value: 'single-job', },
    {label: 'Lint and dbt Cloud job', value: 'multi-job', },
  ]
}>
<TabItem value="single-job">

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
  - build

# this job calls the dbt Cloud API to run a job
run-dbt-cloud-job:
  stage: build
  rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH == 'main'
  script:
    - python python/run_and_monitor_dbt_job.py
```

</TabItem>
<TabItem value="multi-job">

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

# this job calls the dbt Cloud API to run a job
run-dbt-cloud-job:
  stage: build
  rules:
    - if: $CI_PIPELINE_SOURCE == "push" && $CI_COMMIT_BRANCH == 'main'
  script:
    - python python/run_and_monitor_dbt_job.py
```

</TabItem>
</Tabs>


</TabItem>
<TabItem value="ado">

For this new job, open the existing Azure pipeline you created above and select the *Edit* button. We'll want to edit the corresponding Azure pipeline YAML file with the appropriate configuration, instead of the starter code, along with including a `variables` section to pass in the required variables.

Copy the below YAML file into your Azure pipeline and update the variables below to match your setup based on the comments in the file. It's worth noting that we changed the `trigger` section so that it will run **only** when there are pushes to a branch named `main` (like a PR merged to your main branch). 

Read through [Azure's docs](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/triggers?view=azure-devops) on these filters for additional use cases.

```yaml
name: Run dbt Cloud Job

trigger: [ main ] # runs on pushes to main

variables:
  DBT_URL:                 https://cloud.getdbt.com # no trailing backslash, adjust this accordingly for single-tenant deployments
  DBT_JOB_CAUSE:           'Azure Pipeline CI Job' # provide a descriptive job cause here for easier debugging down the road
  DBT_ACCOUNT_ID:          00000 # enter your account id
  DBT_PROJECT_ID:          00000 # enter your project id
  DBT_PR_JOB_ID:           00000 # enter your job id

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.7'
    displayName: 'Use Python 3.7'

  - script: |
      pip install requests
    displayName: 'Install python dependencies'

  - script: |
      python -u ./python/run_and_monitor_dbt_job.py
    displayName: 'Run dbt job '
    env:
      DBT_API_KEY: $(DBT_API_KEY) # Set these values as secrets in the Azure pipelines Web UI
```

</TabItem>
<TabItem value="bitbucket">

For this job, we'll set it up using the `bitbucket-pipelines.yml` file as in the prior step (see Step 1 of the linting setup for more info). The YAML file will look pretty similar to our earlier job, but we’ll pass in the required variables to the Python script using `export` statements. Update this section to match your setup based on the comments in the file.

<Tabs
  defaultValue="single-job"
  values={[
    { label: 'Only dbt Cloud job', value: 'single-job', },
    {label: 'Lint and dbt Cloud job', value: 'multi-job', },
  ]
}>
<TabItem value="single-job">

```yaml
image: python:3.11.1


pipelines:
  branches:
    'main': # override if your default branch doesn't run on a branch named "main"
      - step:
          name: 'Run dbt Cloud Job'
          script:
            - export DBT_URL="https://cloud.getdbt.com" # if you have a single-tenant deployment, adjust this accordingly
            - export DBT_JOB_CAUSE="Bitbucket Pipeline CI Job"
            - export DBT_ACCOUNT_ID=00000 # enter your account id here
            - export DBT_PROJECT_ID=00000 # enter your project id here
            - export DBT_PR_JOB_ID=00000 # enter your job id here
            - python python/run_and_monitor_dbt_job.py
```

</TabItem>
<TabItem value="multi-job">

```yaml
image: python:3.11.1


pipelines:
  branches:
    '**': # this sets a wildcard to run on every branch unless specified by name below
      - step:
          name: Lint dbt project
          script:
            - pip install sqlfluff==0.13.1
            - sqlfluff lint models --dialect snowflake --rules L019,L020,L021,L022

    'main': # override if your default branch doesn't run on a branch named "main"
      - step:
          name: 'Run dbt Cloud Job'
          script:
            - export DBT_URL="https://cloud.getdbt.com" # if you have a single-tenant deployment, adjust this accordingly
            - export DBT_JOB_CAUSE="Bitbucket Pipeline CI Job"
            - export DBT_ACCOUNT_ID=00000 # enter your account id here
            - export DBT_PROJECT_ID=00000 # enter your project id here
            - export DBT_PR_JOB_ID=00000 # enter your job id here
            - python python/run_and_monitor_dbt_job.py
```

</TabItem>
</Tabs>


</TabItem>
</Tabs>

### 5. Test your new action

Now that you have a shiny new action, it’s time to test it out! Since this change is setup to only run on merges to your default branch, you’ll need to create and merge this change into your main branch. Once you do that, you’ll see a new pipeline job has been triggered to run the dbt Cloud job you assigned in the variables section. 

Additionally, you’ll see the job in the run history of dbt Cloud. It should be fairly easy to spot because it will say it was triggered by the API, and the *INFO* section will have the branch you used for this guide.

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    {label: 'GitLab', value: 'gitlab', },
    {label: 'Azure DevOps', value: 'ado', },
    {label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
<TabItem value="github">

![dbt run on merge job in GitHub](/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-github.png)

![dbt Cloud job showing it was triggered by GitHub](/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-github-triggered.png)

</TabItem>
<TabItem value="gitlab">

![dbt run on merge job in GitLab](/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-gitlab.png)

![dbt Cloud job showing it was triggered by GitLab](/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-gitlab-triggered.png)

</TabItem>
<TabItem value="ado">

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-azure.png" width="85%" title="dbt run on merge job in ADO"/>

<Lightbox src="/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-azure-triggered.png" width="100%" title="ADO-triggered job in dbt Cloud"/>

</TabItem>
<TabItem value="bitbucket">

![dbt run on merge job in Bitbucket](/img/guides/orchestration/custom-cicd-pipelines/dbt-run-on-merge-bitbucket.png)

![dbt Cloud job showing it was triggered by Bitbucket](/img/guides/orchestration/custom-cicd-pipelines/dbt-cloud-job-bitbucket-triggered.png)

</TabItem>
</Tabs>
