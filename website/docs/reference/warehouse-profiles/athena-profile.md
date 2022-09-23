---
title: "Athena Profile"
---

## Overview of dbt-athena

**Maintained by:** Community
**Author:** Tomme
**Source:** [Github](https://github.com/Tomme/dbt-athena)
**dbt Cloud:** Not Supported  
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C013MLFR7BQ)
**Supported Version:** Athena engine version 2

The easiest way to install is to use pip:

    pip install dbt-athena-adapter

## Connecting to Athena with dbt-athena

This plugin does not accept any credentials directly. Instead, [credentials are determined automatically](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) based on aws cli/boto3 conventions and stored login info. You can configure the AWS profile name to use via aws_profile_name. Checkout dbt profile configuration below for details.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: athena
      s3_staging_dir: [s3_staging_dir]
      region_name: [region_name]
      database: [database name]
      schema: [dev_schema]
      aws_profile_name:
        [optional, profile to use from your AWS shared credentials file.]

  target: dev
```

</File>
