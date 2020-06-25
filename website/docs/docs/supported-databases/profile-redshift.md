---
title: "Redshift"
id: "profile-redshift"
---



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
      pass: password1
      port: 5439
      dbname: analytics
      schema: analytics
      threads: 4
      keepalives_idle: 0 # default 0, indicating the system default
      # search_path: public # optional, not recommended
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
`aws configure` to set up AWS access keys, and pick a default region.

<File name='~/.dbt/profiles.yml'>

```yaml
my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      method: iam
      cluster_id: [cluster_id]
      host: hostname.region.redshift.amazonaws.com
      user: alice
      iam_profile: data_engineer # optional
      iam_duration_seconds: 900  # optional
      autocreate: true           # optional
      db_groups: ['analysts']    # optional

      # Other Redshift configs:
      port: 5439
      dbname: analytics
      schema: analytics
      threads: 4
      keepalives_idle: 0 # default 0, indicating the system default
      # search_path: public # optional, but not recommended
```

</File>

Ideally, the region and access keys should be configured in the usual `~/.aws` folder,
via profiles you can then specify using the `iam_profile` option.

A sample `~/.aws/config` file would be:
<File name='~/.aws/config.yml'>

```
[profile data_engineer]
role_arn=arn:aws:iam::<you-account-id>:role/Data_Engineer
region = eu-west-1
source_profile = default
```

</File>
where the `source_profile` would be the profile that holds the access credentials, set in the `~/.aws/credentials` file

<File name='~/.aws/config.yml'>

```
[default]  # 'default' profile
aws_access_key_id=<access-key>
aws_secret_access_key=<secret-access-key>
```
</File>

## Redshift notes

Where possible, dbt enables the use of `sort` and `dist` keys. See the section on [Redshift specific configurations](redshift-configs).
