---
title: "Redshift"
description: "Profile configuration instructions for Redshift"
---
# Set up a Redshift target

Redshift targets should be set up using the following configuration in your `profiles.yml` file.

# Authentication Methods

## Password-based authentication
[block:code]
{
  "codes": [
    {
      "code": "company-name:\n  target: dev\n  outputs:\n    dev:\n      type: redshift\n      host: [hostname]\n      user: [username]\n      pass: [password]\n      port: [port]\n      dbname: [database name]\n      schema: [dbt schema]\n      threads: [1 or more]\n      keepalives_idle: 0 # default 0, indicating the system default\n      search_path: [optional, override the default Redshift search_path]",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## IAM Authentication

To set up a Redshift profile using IAM Authentication, set the `method` parameter to `iam` as shown below. Note that a password is not required when using IAM Authentication. For more information on this type of authentication, consult the [Redshift Documentation](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) on generating user credentials with IAM Auth.

If you receive the "You must specify a region" error when using IAM Authentication, then your aws credentials are likely misconfigured. Try running `aws configure` to set up AWS access keys, and pick a default region.
[block:code]
{
  "codes": [
    {
      "code": "my-redshift-db:\n  target: dev\n  outputs:\n    dev:\n      type: redshift\n      method: iam\n      cluster_id: [cluster_id]\n      host: [hostname]\n      user: [username]\n      port: [port]\n      dbname: [database name]\n      schema: [dbt schema]\n      threads: [1 or more]\n      keepalives_idle: 0 # default 0, indicating the system default\n      search_path: [optional, override the default Redshift search_path]\n",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
# Redshift notes

Where possible, dbt enables the use of `sort` and `dist` keys. See the section on [Redshift specific configurations](doc:redshift-configs).
