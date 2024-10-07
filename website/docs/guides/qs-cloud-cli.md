---
title: "Coalesce: Quickstart for dbt Cloud CLI"
id: "dbt-cloud-cli"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'guides'
hide_table_of_contents: true
tags: ['Cloud CLI', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to configure and use dbt Cloud CLI as part of the Coalesce 24 Workshop. 

It will show you how to: 

- Set up a dbt Cloud sandbox.
- Install the dbt Cloud CLI and connect to dbt Cloud.
- Run commands locally using the dbt Cloud CLI.
- Defer to different production environments.
- Leverage cross-project ref.
- Install dbt Power User.
- Use dbt Power User to supercharge development.

### Prerequisites​

- Familiarity with dbt projects and common commands (for example, `dbt build`)
- Git is installed
- An editor, such as Visual Studio Code (preferred), is installed

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)

## Install Git and Visual Studio Code (Prerequisites)

You will need to have Git installed locally and a code editor (preferably Visual Studio Code).

### Check your installation status

Run `git --version` in your terminal to check if it's installed. For example:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/terminal-git-check.png" title="Example of verifying installation of Git" />
</div>

Check your installed applications for Visual Studio Code (vscode) or another editor. For example:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/finder-vscode-check.png" title="Example of verifying installation of Visual Studio Code on macOS" />
</div>

### Install Git and Visual Studio Code

Navigate to the following Git installation page and install it for your operating system:

https://git-scm.com/downloads

Navigate to the following Visual Studio Code installation page and install it for your operating system.

https://code.visualstudio.com/download

## Set up dbt Cloud (Coalesce Workshop Only)

Let's get set up with a dbt Cloud sandbox that's already connected to a Snowflake account for the workshop.

1. Go to [bit.ly/coalesce-24-sandboxes](https://bit.ly/coalesce-24-sandboxes) to create an account. Make sure you log out of any other dbt Cloud accounts.
    
    a. Enter your **First Name** and **Last Name**
    
    b. For **Workshop**, choose **Test driving dbt Cloud CLI and dbt power user** from the dropdown
    
    c. The **Passcode** will be provided by your facilitators
    
    d. Accept the terms and click **Complete Registration**

1. Navigate to the platform project by selecting **Project** form the left sidebar and choosing **Platform Analytics**.

1. Select **Deploy >> Runs** to find the created jobs. For each job, click on the job and click **run**.

1. Now repeat for the **Analytics project**. Toggle into the Analytics project.

1. Select **Deploy >> Runs** to find the created jobs. For the one job, click on the job and click **run**.

1. Select **Explore** from the navigation and choose XX. Now you can visualize your dbt Mesh. Click into each project to see project level lineage.

You've now successfully run your project in deployment environments so you can use cross project ref and deferral later in the workshop. 

## Configure dbt Cloud CLI

Now we'll clone the project repository and configure dbt Cloud CLI to connect to your sandbox.

### Clone the repo

1. Navigate to a folder on your computer to clone the repository.

1. In your terminal, run the following command to clone the downstream (analytics) project:

    ```shell
    git clone https://github.com/dbt-labs/c24-workshops-analytics.git
    ```

### Install Cloud CLI

1. In dbt Cloud, select Platform Analytics and choose **Develop >> Configure Cloud CLI**.

1. Based on your current local setup, use the following guidance to determine your installation approach:

    a. Check if you have dbt in your PATH by running `dbt --version`

    b. If you don't have dbt in your PATH, we recommend the macOS or Windows installation method.

    c. If you do have dbt in your PATH (global environment), we recommend:
        1. Uninstalling dbt globally
        2. Installing dbt Cloud CLI with a Python virtual environment

    d. If you have dbt in a virtual environment, install dbt Cloud CLI with a separate Python virtual environment. Be sure to activate it with `source <path to env>/bin/activate`.

1. Download the CLI configuration file from the dbt Cloud UI. Save it in your `.dbt` folder.

1. Navigate to the dbt project folder that you cloned earlier and open the `dbt_project.yml` file with your `project_id`.

### Confirm the installation

Run `dbt compile` to verify your installation.

There you go! You've installed the dbt Cloud CLI! Let's dive in!

### Additional resources
Consult the following docs if you run into problems when trying to install the dbt Cloud CLI:
- [Install dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/cloud-cli-installation)
- [Configure and use dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/configure-cloud-cli)

## Leverage dbt Cloud CLI

Let's run a few commands together to get comfortable with the dbt Cloud CLI:
* `dbt debug` &mdash; Displays your connection details and information
* `dbt compile --select stg_campaigns` &mdash; Compiles your dbt project
* `dbt run --select stg_campaigns` &mdash; Materialized your dbt models
* `dbt run --select stg_campaigns` &mdash; Preview the results of a model
* `dbt test --select stg_campaigns` &mdash; Execute tests against your materialized models

Now let's dive into some more advanced components of dbt Cloud CLI.

### Deferral

Deferral is a powerful functionality, allowing you to leverage upstream assets that exist outside of your personal development environment. As a result, you can speed up your development workflows and save on warehouse compute costs. Let's run a few commands using deferral:

1. Run `dbt compile -s stg_campaigns`. Notice how we're able to resolve dependencies in the compiled SQL without seeding `campaigns.csv`.
1. Now let's modify the `stg_campaigns` model by adding a timestamp:
    ```sql
    current_timestamp() as updated_at
    ```

    Let's build that model with the next command.
1. Run `dbt build --select stg_campaigns`. We're utilizing deferral and the concept of "statefulness" to check with objects that have been modified and resolve dependencies of upstream assets if they exist.

    By default, the dbt Cloud CLI defers to a [Staging](https://docs.getdbt.com/docs/deploy/deploy-environments#staging-environment) environment if one exists. If not, dbt uses the assets from the Production environment.

    To override which environment the dbt Cloud CLI defers to, you can set a `defer-env-id` key in either your `dbt_project.yml` or `dbt_cloud.yml` file. For example:

    ```yml
    dbt-cloud:
        defer-env-id: '123456'
    ```

### dbt Mesh

You have access to cross-project ref's that's powered by the metadata of dbt Cloud.

1. Open the `agg_campaign_customer_contacts` model.
1. Find the reference called `{{ ref('platform', 'dim_customers', v=1) }}`.
1. Run the command:

    ```shell
    dbt run --select agg_campaign_customer_contacts
    ```

1. Navigate to dbt Cloud Explorer and find a public model. Let's use the `fct_order_items` model.
1. Create a new model called `agg_orders` in your project with the following code:

    ```sql
    with orders as (
    
        select * from {{ ref('platform', 'fct_order_items') }}

    ),

    final as (
    
        select
            customer_key as customer_id,
            is_return as return_status,
            count(*) as count_orders

        from
            orders
        group by
            customer_key,
            is_return
    )

    select * from final
    ```

### Linting and fixing SQL files

With SQLFluff built in, you can check your code against a style guide and automatically make fixes.

1. Run the SQLFluff command `lint`:

    ```shell
    dbt sqlfluff lint models/staging/campaigns/stg_campaigns.sql --dialect snowflake
    ```

    This identifies tweaks to make in the `stg_campaigns` model.
2. Run the SQLFluff command `fix`:

    ```shell
    dbt sqlfluff fix models/staging/campaigns/stg_campaigns.sql --dialect snowflake
    ```

    This attempts to directly make fixes in the `stg_campaigns` model.

### Change branches

You can quickly change branches without fully pushing to your Git provider (such as GitHub):

```shell
git checkout -b my-new-branch

git checkout main
```

Now you've taken a tour of what you can do with dbt Cloud CLI. Let's dive into dbt Power User next.

## Install dbt Power User

Let's get dbt Power User installed to supercharge our workflow.

1. From Visual Studio Code, click on extensions and search for "Power User for dbt".

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-01.png" title="Find the VS Code Extension for dbt Power User" />
    </div>
1. Click on install.
1. Click **Switch to dbt Cloud**. You might need to refresh.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-02.png" title="Switch to dbt Cloud" />
    </div>
1. Complete the setup steps. (click on welcome in VSCode and choose dbt Poweruser)
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/cloud-cli-guide/setup-poweruser-03.png" title="Complete the setup flow" />
    </div>
1. Make an account to sign up and get an API Key: https://app.myaltimate.com/register

1. Copy your API key and enter this into the dbt Power User extension settings.

Now let's dive in!

## Leverage dbt Power User

There is a ton you can do to supercharge your workflow with dbt Cloud. Let's cover some highlights.

### Preview your upstream/downstream changes

Open the Power User extension on the left-hand side. You can see the upstream and downstream projects.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-01.png" title="See upstream and downstream dependencies" />
</div>

### Preview results

Press Command-Enter (or Control-Enter for Windows) and instantly see the results of your model below.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-02.png" title="Preview results" />
</div>

### SQL visualization

While looking at a model file, click the Altimate logo in the top right and click **Visualize SQL** to see a breakdown of your SQL model.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-03.png" title="Visualize SQL processing" />
</div>

### Generate test and documentation YML with user-friendly UX and AI

At the top of your model file, click on generate documentation for a UI to rapidly create documentation and tests with AI

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/cloud-cli-guide/using-poweruser-04.png" title="Generate tests and documentation" />
</div>

There is a whole lot more too! Check out the dbt Power User docs here: https://docs.myaltimate.com/

## Conclusion

You've successfully installed dbt Cloud CLI and dbt Power User! Now you can get the benefits of local development _and_ dbt Cloud working together.

Be on the look out for the following enhancements to dbt Cloud CLI:
- Deeper integration with dbt Explorer for visual interaction
- Support for invoking production jobs directly from the CLI
- Continued optimization for performance and scalability improvements

</div>


