---
title: "Coalesce: Quickstart for dbt Cloud CLI"
id: "cloud_cli"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'bigquery'
hide_table_of_contents: true
tags: ['Cloud CLI', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to configure and use dbt Cloud CLI as part of the Coalesce 24 Workshop. 

It will show you how to: 

- Setup a dbt Cloud sandbox.
- Install dbt Cloud CLI and connect to dbt Cloud.
- Run commands locally through dbt Cloud CLI.
- Defer to different production environments.
- Leverage cross project ref.
- Install dbt Power User.
- Use dbt Power User to super charge development.

### Prerequisites​

- Familiarity with dbt project and common commands (e.g. `dbt build`)
- Git installed
- VSCode (preferred) or other code editor of choice

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)

## Installing Git and VS Code (Prerequisites)

You will need to have git installed locally and a code editor (preferably VS Code).

### Check your installation status

Run `git --version` in your terminal to check if git is installed.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/terminal-git-check.png" title="Verifying git installation" />
</div>

Check your installed applications for VSCode or another editor.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/finder-vscode-check.png" title="Verifying git installation" />
</div>

### Install git and VSCode

Navigate to the following git installation page and install git for your operating system.

https://git-scm.com/downloads

Navigate to the following git installation page and install git for your operating system.

https://code.visualstudio.com/download

## dbt Cloud Setup (Coalesce Workshop Only)

Let's get setup with a dbt Cloud sandbox already connected to a Snowflake account for the workshop.

1. Go to [bit.ly/coalesce-24-sandboxes](https://bit.ly/coalesce-24-sandboxes) to create an account (make sure you log out of any other dbt Cloud accounts)
    
    a. Type in **first name** and **last name**
    
    b. Select workshop **“Test driving dbt Cloud CLI and dbt power user”**
    
    c. **Password** will be provided by your facilitators
    
    d. Accept terms and click complete registration

2. Navigate to the **platform project** by selecting project on the left hand navigation and choosing platform

3. Select **Deploy >> Runs** to find the created jobs.  For each job, click on the job and click **run**.

4. Now repeat for the **analytics project**. Toggle into the analytics project.

5. Select **Deploy >> Runs** to find the created jobs.  For the one job, click on the job and click **run**.

6. Select **Explore** from the navigation and choose XX. Now you can visualize your dbt Mesh. Click into each project to see project level lineage.

You've now successfully run your project in deployment environments to use cross project ref and deferral later in the workshop. 

## Configuring dbt Cloud CLI

Now we'll clone the project repository and configure dbt Cloud CLI to connect to your sandbox.

### Clone the repo

1. Navigate to a folder on your computer to clone the repository.

2. In your terminal, run the following command to clone the downstream (analytics) project.

    `git clone https://github.com/dbt-labs/c24-workshops-analytics.git`

### Install Cloud CLI

3. In dbt Cloud, select Platform Analytics and choose Develop >> Configure Cloud CLI

4. Based on your current local setup, use the following guidance to determine your installation approach

    a. Check if you have dbt in your path by running `dbt --version`

    b. If you don't have dbt in your path, we recommend the macOS or Windows installation method.

    c. If you do have dbt in your path (or a virtual environment) we recommend a) uninstalling dbt globally and b) installing dbt Cloud CLI with a python virtual environment.

5. Download the CLI configuration file from the dbt Cloud UI.  Store this in your `.dbt` folder.

6. Navigate to the dbt project folder that you cloned earlier and open the `dbt_project.yml` file with your project_id.

### Confirm installation

7. Run `dbt compile` to verify your installation

There you go! You've installed the dbt Cloud CLI! Let's dive in!

## Leveraging dbt Cloud CLI

Let's run a few commands together to get comfortable with dbt Cloud CLI:
* `dbt debug` - Shows you your connection details and information
* `dbt compile --select stg_campaigns` - Compiles your dbt project
* `dbt run --select stg_campaigns` - Materialized your dbt models
* `dbt run --select stg_campaigns` - Preview the results of a model
* `dbt test --select stg_campaigns` - Execute tests against your materialized models

Now let's dive into some more advanced components of dbt Cloud CLI.

### Deferral

!!!!! need to complete this section !!!!!

### dbt Mesh

You have access to cross-project ref's powered by the metadata of dbt Cloud.

1. Open the `agg_campaign_customer_contacts` model.
2. Find the reference called `{{ ref('platform', 'dim_customers', v=1) }}`
3. Run the command `dbt run --select agg_campaign_customer_contacts`
4. Navigate to dbt Cloud explorer and find a public model. Let's use the `fct_order_items` model.
5. Create a new model in your project with the following code
```
insert some code here
```

### Linting and Fixing with sqlfluff

With sqlfluff built-in, you can check your code against a style guide and automatically make fixes.

1. Run `dbt sqlfluff lint models/core/???`. This will identify tweaks to make in the model.
2. Run `dbt sqlfluff fix models/core/???`. This will proactively try to make direct fixes in the model.

### Change branches

You can quickly change branches without fully pushing to your git provider (i.e. Github)

`git checkout -b my-new-branch`

`git checkout main`

Now you've taken a tour of what you can do with dbt Cloud CLI. Let's dive into dbt Power User next.

## Installing dbt Power User

Let's get dbt Power User installed to super charge our workflow.

1. Within VS Code, click on extensions and search for Power User for dbt.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/setup-poweruser-01.png" title="Find the VS Code Extension for dbt Power User" />
</div>

2. Click on install.
3. Choose switch to dbt Cloud (you might need to refresh).

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/setup-poweruser-02.png" title="Switch to dbt Cloud" />
</div>

4. Complete the setup steps. (click on welcome in VSCode and choose dbt Poweruser)

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/setup-poweruser-03.png" title="Complete the setup flow" />
</div>

5. Go make an account to sign up and get an API Key: https://app.myaltimate.com/register

6. Copy your API key and enter this into the dbt Power User extension settings.

Now let's dive in!

## Leveraging dbt Power User

There is a ton you can do to super charge your workflow with dbt Cloud. Let's cover some highlights.

### Preview your upstream/downstream changes

Open the Power User extension on the left hand side. You can see the upstream and downstream projects

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-01.png" title="See upstream and downstream dependencies" />
</div>

### Preview Results

Hit cmd+enter (or ctrl+enter on PC) and instantly see the results of your model below.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-02.png" title="Preview results" />
</div>

### SQL Visualization

While looking at a model file, click the Altimate logo in the top right and click Visualize SQL to see a break down of your SQL model.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-03.png" title="Visualize SQL processing" />
</div>

### Generate test and documentation YML with user friendly UX and AI

At the top of your model file, click on generate documentation for a UI to rapidly create documentation and tests with AI

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-04.png" title="Generate tests and documentation" />
</div>

There is a whole lot more too! Check out the dbt Power User docs here: https://docs.myaltimate.com/

## Conclusion

You've successfully installed dbt Cloud CLI and dbt Power User! Now you can get the benefits of local development AND dbt Cloud working together.

Be on the look out for the following enhancements to dbt Cloud CLI:
- Deeper integration with dbt Explorer for visual interaction
- Support for invoking production jobs directly from the CLI
- Continued optimization for performance and scalability improvements

</div>


