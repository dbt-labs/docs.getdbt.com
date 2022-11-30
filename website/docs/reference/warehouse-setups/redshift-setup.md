---
title: "Redshift setup"
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-redshift'
  pypi_package: 'dbt-redshift'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-redshift'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Redshift'
  config_page: 'redshift-configs'
---

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Authentication Methods

### Password-based authentication

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: redshift
      host: hostname.region.redshift.amazonaws.com
      user: username
      password: password1
      port: 5439
      dbname: analytics
      schema: analytics
      threads: 4
      keepalives_idle: 240 # default 240 seconds
      connect_timeout: 10 # default 10 seconds
      # search_path: public # optional, not recommended
      sslmode: [optional, set the sslmode used to connect to the database (in case this parameter is set, will look for ca in ~/.postgresql/root.crt)]
      ra3_node: true # enables cross-database sources
```

</File>

### IAM Authentication

To set up a Redshift profile using IAM Authentication, set the `method`
parameter to `iam` as shown below. Note that a password is not required when
using IAM Authentication. For more information on this type of authentication,
consult the [Redshift Documentation](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html)
and [boto3
docs](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/redshift.html#Redshift.Client.get_cluster_credentials)
on generating user credentials with IAM Auth.

If you receive the "You must specify a region" error when using IAM
Authentication, then your aws credentials are likely misconfigured. Try running
`aws configure` to set up AWS access keys, and pick a default region. If you have any questions,
please refer to the official AWS documentation on [Configuration and credential file settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

<File name='~/.dbt/profiles.yml'>

```yaml
my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      method: iam
      cluster_id: CLUSTER_ID
      host: hostname.region.redshift.amazonaws.com
      user: alice
      iam_profile: data_engineer # optional
      iam_duration_seconds: 900  # optional
      autocreate: true           # optional
      db_groups: ['ANALYSTS']    # optional

      # Other Redshift configs:
      port: 5439
      dbname: analytics
      schema: analytics
      threads: 4
      [keepalives_idle](#keepalives_idle): 240 # default 240 seconds
      connect_timeout: 10 # default 10 seconds
      [retries](#retries): 1 # default 1 retry on error/timeout when opening connections
      # search_path: public # optional, but not recommended
      sslmode: [optional, set the sslmode used to connect to the database (in case this parameter is set, will look for ca in ~/.postgresql/root.crt)]
      ra3_node: true # enables cross-database sources

```

</File>

### Specifying an IAM Profile

:::info New in dbt v0.18.0
The `iam_profile` config option for Redshift profiles is new in dbt v0.18.0
:::

When the `iam_profile` configuration is set, dbt will use the specified profile from your `~/.aws/config` file instead of using the profile name `default`
## Redshift notes
### `sort` and `dist` keys
Where possible, dbt enables the use of `sort` and `dist` keys. See the section on [Redshift specific configurations](redshift-configs).

### `keepalives_idle`
If the database closes its connection while dbt is waiting for data, you may see the error `SSL SYSCALL error: EOF detected`. Lowering the [`keepalives_idle` value](https://www.postgresql.org/docs/9.3/libpq-connect.html) may prevent this, because the server will send a ping to keep the connection active more frequently. 

[dbt's default setting](https://github.com/dbt-labs/dbt-redshift/blob/main/dbt/adapters/redshift/connections.py#L51) is 240 (seconds), but can be configured lower (perhaps 120 or 60), at the cost of a chattier network connection.

<VersionBlock firstVersion="1.2">

#### retries

If `dbt-redshift` encounters an operational error or timeout when opening a new connection, it will retry up to the number of times configured by `retries`. If set to 2+ retries, dbt will wait 1 second before retrying. The default value is 1 retry. If set to 0, dbt will not retry at all.

</VersionBlock>
