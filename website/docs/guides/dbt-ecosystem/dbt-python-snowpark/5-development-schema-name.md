---
title: "Development schema name and IDE walkthrough" 
id: "5-development-schema-name"
description: "Development schema name and IDE walkthrough"
---

1. First we are going to change the name of our default schema to where our dbt models will build. By default, the name is `dbt_`. We will change this to `dbt_<YOUR_NAME>` to create your own personal development schema. To do this, select **Profile Settings** from the gear icon in the upper right.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/1-settings-gear-icon.png" title="Settings menu"/>

2. Navigate to the **Credentials** menu and select **Partner Connect Trial**, which will expand the credentials menu.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/2-credentials-edit-schema-name.png" title="Credentials edit schema name"/>
    
3. Click **Edit** and change the name of your schema from `dbt_` to `dbt_YOUR_NAME` replacing `YOUR_NAME` with your initials and name (`hwatson` is used in the lab screenshots). Be sure to click **Save** for your changes!
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/3-save-new-schema-name.png" title="Save new schema name"/>

4. We now have our own personal development schema, amazing! When we run our first dbt models they will build into this schema.
5. Let’s open up dbt Cloud’s Integrated Development Environment (IDE) and familiarize ourselves. Choose **Develop** at the top of the UI.

6. When the IDE is done loading, click **Initialize dbt project**. The initialization process creates a collection of files and folders necessary to run your dbt project.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/4-initialize-dbt-project.png" title="Initialize dbt project"/>

7. After the initialization is finished, you can view the files and folders in the file tree menu. As we move through the workshop we'll be sure to touch on a few key files and folders that we'll work with to build out our project.
8. Next click **Commit and push** to commit the new files and folders from the initialize step. We always want our commit messages to be relevant to the work we're committing, so be sure to provide a message like `initialize project` and select **Commit Changes**.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/5-first-commit-and-push.png" title="First commit and push"/>

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/6-initalize-project.png" title="Initialize project"/>

9. [Committing](https://www.atlassian.com/git/tutorials/saving-changes/git-commit) your work here will save it to the managed git repository that was created during the Partner Connect signup. This initial commit is the only commit that will be made directly to our `main` branch and from *here on out we'll be doing all of our work on a development branch*. This allows us to keep our development work separate from our production code.
10. There are a couple of key features to point out about the IDE before we get to work. It is a text editor, an SQL and Python runner, and a CLI with Git version control all baked into one package! This allows you to focus on editing your SQL and Python files, previewing the results with the SQL runner (it even runs Jinja!), and building models at the command line without having to move between different applications. The Git workflow in dbt Cloud allows both Git beginners and experts alike to be able to easily version control all of their work with a couple clicks.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/7-IDE-overview.png" title="IDE overview"/>

11. Let's run our first dbt models! Two example models are included in your dbt project in the `models/examples` folder that we can use to illustrate how to run dbt at the command line. Type `dbt run` into the command line and click **Enter** on your keyboard. When the run bar expands you'll be able to see the results of the run, where you should see the run complete successfully.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/8-dbt-run-example-models.png" title="dbt run example models"/>

12. The run results allow you to see the code that dbt compiles and sends to Snowflake for execution. To view the logs for this run, select one of the model tabs using the  **>** icon and then **Details**. If you scroll down a bit you'll be able to see the compiled code and how dbt interacts with Snowflake. Given that this run took place in our development environment, the models were created in your development schema.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/9-second-model-details.png" title="Details about the second model"/>


13. Now let's switch over to Snowflake to confirm that the objects were actually created. Click on the three dots **…** above your database objects and then **Refresh**. Expand the **PC_DBT_DB** database and you should see your development schema. Select the schema, then **Tables**  and **Views**. Now you should be able to see `MY_FIRST_DBT_MODEL` as a table and `MY_SECOND_DBT_MODEL` as a view.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/10-confirm-example-models-built-in-snowflake.png" title="Confirm example models are built in Snowflake"/>