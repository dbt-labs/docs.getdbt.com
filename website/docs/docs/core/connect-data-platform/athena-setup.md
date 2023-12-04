---
title: "Athena setup"
description: "Read this guide to learn about the Athena warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: Community
  github_repo: 'dbt-athena/dbt-athena'
  pypi_package: 'dbt-athena-community'
  min_core_version: 'v1.3.0'
  cloud_support: Not Supported
  min_supported_version: 'engine version 2 and 3'
  slack_channel_name: '#db-athena'
  slack_channel_link: 'https://getdbt.slack.com/archives/C013MLFR7BQ'
  platform_name: 'Athena'
  config_page: '/reference/resource-configs/no-configs'
---

<!--The following code uses a component and the built-in docusaurus markdown partials file, which contains reusable content assigned in the meta frontmatter. For this page, the partial file is _setup-pages-intro.md. You have to include the 'import' code and then assign the component as needed.  -->

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to Athena with dbt-athena

This plugin does not accept any credentials directly. Instead, [credentials are determined automatically](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) based on AWS CLI/boto3 conventions and stored login info. You can configure the AWS profile name to use via aws_profile_name. Check out the dbt profile configuration below for details.

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
