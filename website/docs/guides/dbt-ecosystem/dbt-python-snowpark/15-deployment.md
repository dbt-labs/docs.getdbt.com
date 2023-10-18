---
title: "Deployment" 
id: "15-deployment"
description: "Deployment"
---

Before we jump into deploying our code, let's have a quick primer on environments. Up to this point, all of the work we've done in the dbt Cloud IDE has been in our development environment, with code committed to a feature branch and the models we've built created in our development schema in Snowflake as defined in our Development environment connection. Doing this work on a feature branch, allows us to separate our code from what other coworkers are building and code that is already deemed production ready. Building models in a development schema in Snowflake allows us to separate the database objects we might still be modifying and testing from the database objects running production dashboards or other downstream dependencies. Together, the combination of a Git branch and Snowflake database objects form our environment.

Now that we've completed testing and documenting our work, we're ready to deploy our code from our development environment to our production environment and this involves two steps:

- Promoting code from our feature branch to the production branch in our repository.
    - Generally, the production branch is going to be named your main branch and there's a review process to go through before merging code to the main branch of a repository. Here we are going to merge without review for ease of this workshop.
- Deploying code to our production environment.
    - Once our code is merged to the main branch, we'll need to run dbt in our production environment to build all of our models and run all of our tests. This will allow us to build production-ready objects into our production environment in Snowflake. Luckily for us, the Partner Connect flow has already created our deployment environment and job to facilitate this step.

1. Before getting started, let's make sure that we've committed all of our work to our feature branch. If you still have work to commit, you'll be able to select the **Commit and push**, provide a message, and then select **Commit** again.
2. Once all of your work is committed, the git workflow button will now appear as **Merge to main**. Select **Merge to main** and the merge process will automatically run in the background.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/1-merge-to-main-branch.png" title="Merge into main"/>

3. When it's completed, you should see the git button read **Create branch** and the branch you're currently looking at will become **main**.
4. Now that all of our development work has been merged to the main branch, we can build our deployment job. Given that our production environment and production job were created automatically for us through Partner Connect, all we need to do here is update some default configurations to meet our needs.
5. In the menu, select **Deploy** **> Environments**
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/2-ui-select-environments.png" title="Navigate to environments within the UI"/>

6. You should see two environments listed and you'll want to select the **Deployment** environment then **Settings** to modify it.
7. Before making any changes, let's touch on what is defined within this environment. The Snowflake connection shows the credentials that dbt Cloud is using for this environment and in our case they are the same as what was created for us through Partner Connect. Our deployment job will build in our `PC_DBT_DB` database and use the default Partner Connect role and warehouse to do so. The deployment credentials section also uses the info that was created in our Partner Connect job to create the credential connection. However, it is using the same default schema that we've been using as the schema for our development environment.
8. Let's update the schema to create a new schema specifically for our production environment. Click **Edit** to allow you to modify the existing field values. Navigate to **Deployment Credentials >** **schema.**
9. Update the schema name to **production**. Remember to select **Save** after you've made the change.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/3-update-deployment-credentials-production.png" title="Update the deployment credentials schema to production"/>
10. By updating the schema for our production environment to **production**, it ensures that our deployment job for this environment will build our dbt models in the **production** schema within the `PC_DBT_DB` database as defined in the Snowflake Connection section.
11. Now let's switch over to our production job. Click on the deploy tab again and then select **Jobs**. You should see an existing and preconfigured **Partner Connect Trial Job**. Similar to the environment, click on the job, then select **Settings** to modify it. Let's take a look at the job to understand it before making changes.

    - The Environment section is what connects this job with the environment we want it to run in. This job is already defaulted to use the Deployment environment that we just updated and the rest of the settings we can keep as is. 
    - The Execution settings section gives us the option to generate docs, run source freshness, and defer to a previous run state. For the purposes of our lab, we're going to keep these settings as is as well and stick with just generating docs.
    - The Commands section is where we specify exactly which commands we want to run during this job, and we also want to keep this as is. We want our seed to be uploaded first, then run our models, and finally test them. The order of this is important as well, considering that we need our seed to be created before we can run our incremental model, and we need our models to be created before we can test them.
    - Finally, we have the Triggers section, where we have a number of different options for scheduling our job. Given that our data isn't updating regularly here and we're running this job manually for now, we're also going to leave this section alone. 
  
  So, what are we changing then? Just the name! Click **Edit** to allow you to make changes. Then update the name of the job to **Production Job** to denote this as our production deployment job. After that's done, click **Save**.
12. Now let's go to run our job. Clicking on the job name in the path at the top of the screen will take you back to the job run history page where you'll be able to click **Run run** to kick off the job. If you encounter any job failures, try running the job again before further troubleshooting.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/4-run-production-job.png" title="Run production job"/>
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/5-job-details.png" title="View production job details"/>

13. Let's go over to Snowflake to confirm that everything built as expected in our production schema. Refresh the database objects in your Snowflake account and you should see the production schema now within our default Partner Connect database. If you click into the schema and everything ran successfully, you should be able to see all of the models we developed. 
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/15-deployment/6-all-models-generated.png" title="Check all our models in our pipeline are in Snowflake"/>

## Conclusion

Fantastic! You’ve finished the workshop! We hope you feel empowered in using both SQL and Python in your dbt Cloud workflows with Snowflake. Having a reliable pipeline to surface both analytics and machine learning is crucial to creating tangible business value from your data. 

For more help and information join our [dbt community Slack](https://www.getdbt.com/community/) which contains more than 50,000 data practitioners today. We have a dedicated slack channel #db-snowflake to Snowflake related content. Happy dbt'ing!