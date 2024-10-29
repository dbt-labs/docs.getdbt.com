---
title: "Advanced CI"
id: "advanced-ci"
sidebar_label: "Advanced CI"
description: "Advanced CI enables developers to compare changes by demonstrating the changes the code produces."
---

# Advanced CI <Lifecycle status="enterprise"/>

[Continuous integration workflows](/docs/deploy/continuous-integration) help increase the governance and improve the quality of the data. Additionally for these CI jobs, you can use Advanced CI features, such as [compare changes](#compare-changes), that provide details about the changes between what's currently in your production environment and the pull request's latest commit, giving you observability into how data changes are affected by your code changes. By analyzing the data changes that code changes produce, you can ensure you're always shipping trustworthy data products as you're developing. 

:::info How to enable this feature

You can opt into Advanced CI in dbt Cloud. Please refer to [Account access to Advance CI features](/docs/cloud/account-settings#account-access-to-advanced-ci-features) to learn how enable it in your dbt Cloud account.

:::

:::tip More features
dbt Labs plans to provide additional Advanced CI features in the near future. More info coming soon.

:::

## Compare changes feature {#compare-changes}

For [CI jobs](/docs/deploy/ci-jobs) that have the **dbt compare** option enabled, dbt Cloud compares the changes between the last applied state of the production environment (defaulting to deferral for lower compute costs) and the latest changes from the pull request, whenever a pull request is opened or new commits are pushed.  

dbt reports the comparison differences in:

- **dbt Cloud** &mdash; Shows the changes (if any) to the data's primary keys, rows, and columns in the [Compare tab](/docs/deploy/run-visibility#compare-tab) from the [Job run details](/docs/deploy/run-visibility#job-run-details) page. 
- **The pull request from your Git provider** &mdash; Shows a summary of the changes as a Git comment.

<Lightbox src="/img/docs/dbt-cloud/example-ci-compare-changes-tab.png" width="85%" title="Example of the Compare tab" />

## About the cached data

After [comparing changes](#compare-changes), dbt Cloud stores a cache of no more than 100 records for each modified model for preview purposes. By caching this data, you can view the examples of changed data without rerunning the comparison against the data warehouse every time (optimizing for lower compute costs). To display the changes, dbt Cloud uses a cached version of a sample of the data records. These data records are queried from the database using the connection configuration (such as user, role, service account, and so on) that's set in the CI job's environment. 

You control what data to use. This may include synthetic data if pre-production or development data is heavily regulated or sensitive. 

- The selected data is cached on dbt Labs' systems for up to 30 days. No data is retained on dbt Labs' systems beyond this period.
- The cache is encrypted and stored in an Amazon S3 or Azure blob storage in your account’s region. 
- dbt Labs will not access cached data from Advanced CI for its benefit and the data is only used to provide services as directed by you. 
- Third-party subcontractors, other than storage subcontractors, will not have access to the cached data.

If you access a CI job run that's more than 30 days old, you will not be able to see the comparison results. Instead, a message will appear indicating that the data has expired.

<Lightbox src="/img/docs/deploy/compare-expired.png" width="60%" title="Example of message about expired data in the Compare tab" />

## Connection permissions

The compare changes feature uses the same credentials as the CI job, as defined in the CI job’s environment. The dbt Cloud administrator must ensure that client CI credentials are appropriately restricted since all customer's account users will be able to view the comparison results and the cached data.

If using dynamic data masking in the data warehouse, the cached data will no longer be dynamically masked in the Advanced CI output, depending on the permissions of the users who view it. dbt Labs recommends limiting user access to unmasked data or considering using synthetic data for the Advanced CI testing functionality.

<Lightbox src="/img/docs/deploy/compare-credentials.png" width="60%" title="Example of credentials in the user settings" />
