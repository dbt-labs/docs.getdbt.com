---
title: How can I set up the right permissions in BigQuery?
description: "Use service account to set up permissions in BigQuery"
sidebar_label: 'Setting up permissions in BigQuery"'
id: bq-impersonate-service-account-setup

---

To use this functionality, first create the service account you want to
impersonate. Then grant users that you want to be able to impersonate
this service account the `roles/iam.serviceAccountTokenCreator` role on
the service account resource. Then, you also need to grant the service
account the same role on itself. This allows it to create short-lived
tokens identifying itself, and allows your human users (or other service
accounts) to do the same. More information on this scenario is available
[here](https://cloud.google.com/iam/docs/understanding-service-accounts#directly_impersonating_a_service_account).

Once you've granted the appropriate permissions, you'll need to enable
the [IAM Service Account Credentials API](https://console.cloud.google.com/apis/library/iamcredentials.googleapis.com).
Enabling the API and granting the role are eventually consistent operations,
taking up to 7 minutes to fully complete, but usually fully propagating within 60
seconds. Give it a few minutes, then add the `impersonate_service_account`
option to your BigQuery profile configuration.
