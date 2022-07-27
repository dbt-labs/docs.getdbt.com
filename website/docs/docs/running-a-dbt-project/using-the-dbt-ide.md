---
title: "Using the dbt IDE"
id: "using-the-dbt-ide"
---

The dbt Integrated Development Environment (IDE) is a single interface for building, testing, running, and version controlling dbt projects.

### Requirements

- The dbt IDE is powered by the [dbt-rpc](rpc) which has been overhauled in dbt v0.15.0. In order to use the IDE, your dbt project must be compatible with dbt v0.15.0.
- To use the IDE, you must have a [Developer License](cloud-seats-and-users). 
- Write access must be enabled for your dbt repository in dbt Cloud. See [Connecting your GitHub Account](cloud-installing-the-github-application) and [Importing a project by git URL](cloud-import-a-project-by-git-url) for detailed setup instructions.

### Creating a development environment
New dbt Cloud accounts will automatically be created with a Development Environment for the project created during setup. If you have an existing dbt Cloud account, you may need to create a Development Environment manually to use the dbt IDE.

To create a Development Environment, navigate to the Environments page for your Project and click the "New Environment" button.

<Lightbox src="/img/docs/running-a-dbt-project/using-the-dbt-ide/empty-env-page.png" title="Creating a new environment for the Analytics project"/>

To create a Development Environment, change the environment `Environment Type` to `Development`. Enter a name like "Dev" for the environment to help identify it amongst your other environments. During this step, you can also use a dbt Version. We recommend you selecting the same dbt Version that you're planning to use in `Deployment` environment. Finally, click "Save" to finish creating your Development Environment.

<Lightbox src="/img/docs/running-a-dbt-project/using-the-dbt-ide/create-dev-env.png" title="Creating a development environment"/>

### Setting up developer credentials

The IDE uses *developer credentials* to connect to your database. These developer credentials should be specific to your user. They should *not* be super user credentials, or the same credentials that you use for your production deployment of dbt.

New dbt Cloud accounts should have developer credentials created automatically as a part of Project creation in the initial application setup.

<Lightbox src="/img/docs/running-a-dbt-project/using-the-dbt-ide/dev-cred-project-setup.png" title="Developer credentials are created during project setup"/>

New users on existing accounts *might not* have their development credentials already configured. To manage your development credentials, go to the [Credentials](https://cloud.getdbt.com/next/settings/profile#credentials) section. Select the relevant project in the list. After entering your developer credentials, you'll be able to access the dbt IDE.

<Lightbox src="/img/docs/running-a-dbt-project/using-the-dbt-ide/dev-cred-edit-proj.png" title="Configure developer credentials in your Profile."/>

### Compiling and running SQL

This video explores entering the IDE and compiling and running SQL for a dbt project.


<LoomVideo id="a4a1695e0f2445ffbbef8a2ccf514877" />

### Running dbt projects

This video explores running dbt projects in the dbt IDE. For a full list of the commands that can be run in the IDE, consult the [dbt Command reference](dbt-commands).

<LoomVideo id="3f247c8ee0c7414b88eb64ac75b8918d" />

### Version control

This video explores version controlling changes to dbt projects with git in the dbt IDE.

<LoomVideo id="efa64fa9db6346c4b0f4c64999146445" />
