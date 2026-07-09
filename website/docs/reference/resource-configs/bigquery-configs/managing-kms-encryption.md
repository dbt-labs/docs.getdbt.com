---
title: "Managing KMS encryption"
sidebar_label: "KMS encryption"
description: "How to configure customer-managed KMS encryption keys for BigQuery tables using the kms_key_name config."
---

[Customer managed encryption keys](https://cloud.google.com/bigquery/docs/customer-managed-encryption) can be configured for BigQuery tables using the `kms_key_name` model configuration.

### Using KMS encryption

To specify the KMS key name for a model (or a group of models), use the `kms_key_name` model configuration. The following example sets the `kms_key_name` for all of the models in the `encrypted/` directory of your dbt project.

<File name='dbt_project.yml'>

```yaml

name: my_project
version: 1.0.0

...

models:
  my_project:
    encrypted:
      +kms_key_name: 'projects/PROJECT_ID/locations/global/keyRings/test/cryptoKeys/quickstart'
```

</File>
