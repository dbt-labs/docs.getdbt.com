---
title: Why would I want to impersonate a service account?
description: "Build models using dedicated service account"
sidebar_label: 'Why impersonate a service account'
id: bq-impersonate-service-account-why

---

You may want your models to be built using a dedicated service account that has
elevated access to read or write data to the specified project or dataset.
Typically, this requires you to create a service account key for running under
development or on your CI server. By specifing the email address of the service
account you want to build models as, you can use [Application Default Credentials](https://cloud.google.com/sdk/gcloud/reference/auth/application-default) or the
service's configured service account (when running in GCP) to assume the identity
of the service account with elevated permissions.

This allows you to reap the advantages of using federated identity for developers
(via ADC) without needing to grant individual access to read and write data
directly, and without needing to create separate service account and keys for
each user. It also allows you to completely eliminate the need for service
account keys in CI as long as your CI is running on GCP (Cloud Build, Jenkins,
GitLab/Github Runners, etc).
