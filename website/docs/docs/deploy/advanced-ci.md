---
title: "Advanced CI"
id: "advanced-ci"
sidebar_label: "Advanced CI"
description: "Advanced CI enables developers to compare changes by demonstrating the changes the code produces."
---

Advanced CI helps developers answer the question, “Will this PR build the correct changes in production?” By demonstrating the data changes that code changes produce, users can ensure they always ship trusted data products as they develop.

Customers control what data to use and may implement synthetic data if pre-production or development data is heavily regulated or sensitive. The data clients choose only persists on dbt Labs systems for up to 30 days. dbt Labs does not access Advanced CI cached data for its benefit, and the data is only used to provide services to clients as they direct. This caching optimizes compute usage so that the entire comparison is not rerun against the data warehouse each time the **Compare** tab is viewed.

## Data caching

When you run Advanced CI (by enabling **Compare Changes**), dbt Cloud stores a cache of no more than 100 records for each modified model. By caching this data, users can view the examples of changed data without rerunning the comparison against the data warehouse every time. To display the changes, dbt Cloud uses a cached version of a sample of data records. These data records are queried from the database using the connection configuration (user, role, service account, etc.) set in the CI job's environment.

<Lightbox src="/img/docs/deploy/compare-changes.png" width="60%" title="The compare tab of the CI job in dbt Cloud" />

The cache is encrypted, stored in Amazon S3 or Azure blob storage in your account’s region, and automatically deleted after 30 days. No data is retained on dbt Labs’s systems beyond this period. Users accessing a CI run that is more than 30 days old will not be able to see the comparison; instead, they will see a message that the data has expired (no other third-party subcontractor(s), aside from the storage subcontractor(s), has access to the cached data).

<Lightbox src="/img/docs/deploy/compare-expired.png" width="60%" title="The compare tab once the results have expired" />

## Connection permissions

The **Compare changes** feature uses the same credentials as your CI job, which is defined in your CI job’s environment. Because all users will be able to view the comparison results and the cached data, the account administrator must ensure that client CI credentials are appropriately restricted.

In particular, if you use dynamic data masking in your data warehouse, the cached data will no longer be dynamically masked in the Advanced CI output, depending on the permissions of the users who view it. We recommend limiting your users' access to unmasked data or considering using synthetic data for the Advanced CI testing functionality.

<Lightbox src="/img/docs/deploy/compare-credentials.png" width="60%" title="The credentials in the user settings" />
