---
title: How to delete a job or environment in dbt Cloud?
description: "How to delete a job or environment"
sidebar_label: 'Delete a job or environment'
id: delete-environment-job
--- 


To delete an environment or job in dbt Cloud, you must have a `developer` [license](/docs/collaborate/manage-access/seats-and-users) and have the necessary [access permissions](/docs/collaborate/manage-access/about-access). 

:::info 📌 Delete a job first before deleting environment

Deleting an environment doesn't automatically delete its associated job(s). If you delete an environment first without deleting the job, you won't be able to delete the job since it's without an environment. 

To completely delete your environment, you _must_:
1. First delete all jobs associated with that environment,
2. Then, delete the environment. 
:::

**Delete a job**

To delete a job or multiple jobs in dbt Cloud:

1. Click **Deploy** on the navigation header.
2. Click **Jobs** and select the job(s) you want to delete. 
3. Click **Settings** on the top right of the page and then click **Edit**.
4. Scroll to the bottom of the page and click **Delete** to delete the job. <br />

<figure>
<img src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/delete-job.jpg"/>
<figcaption align = "center">Delete a job</figcaption>
</figure>

5. Confirm your action in the **Confirm Delete** pop-up by clicking **Confirm Delete** in the bottom right to delete the job immediately. This action cannot be undone. However, you can create a new job with the same information if the deletion was made in error. 

Refresh the page, and the deleted job should now be gone. If you want to delete multiple jobs, you'll need to perform these steps for each individual job. 

**Delete an environment**

To delete an environment in dbt Cloud:

1. Click **Deploy** on the navigation header and then click **Environments** 
2. Select the Environment you want to delete. 
3. Click **Settings** on the top right of the page and then click **Edit**.
4. Scroll to the bottom of the page and click **Delete** to delete the environment. <br />

<figure>
<img src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/delete-environment.jpg"/>
<figcaption align = "center">Delete an environment</figcaption>
</figure>

5. Confirm your action in the **Confirm Delete** pop up by clicking **Confirm Delete** in the bottom right to immediately delete the environment. This action cannot be undone. However, you can create a new job with the same information if the deletion was made in error. <br /><br />


Nice going! Refresh your page and the deleted environment should now be gone. If you want to delete multiple environments, you'll need to perform these steps to delete each one. 

If you're having any issues, feel free to [contact](mailto:support@getdbt.com) us for additional help.