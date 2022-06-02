---
title: "AWS Glue Profile"
id: "glue-profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-glue

**Maintained by:** Community  
**Author:** Benjamin Menuet, Moshir Mikael, Armando Segnini and Amine El Mallem
**Source:** [Github](https://github.com/aws-samples/dbt-glue)    
**Core version:** v0.24.0 and newer  
**dbt Cloud:** Not Supported      
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C02R4HSMBAT)     


![dbt-glue stars](https://img.shields.io/github/stars/aws-samples/dbt-glue?style=for-the-badg)

The package can be installed from PyPI with:

```bash
$ pip install dbt-glue
```
For further (and more likely up-to-date) info, see the [README](https://github.com/aws-samples/dbt-glue#readme)


## Connection Methods


### Configuring your AWS profile for Glue Interactive Session
There are two IAM principals used with interactive sessions.
- Client principal: The princpal (either user or role) calling the AWS APIs (Glue, Lake Formation, Interactive Sessions)
from the local client. This is the principal configured in the AWS CLI and likely the same.
- Service role: The IAM role that AWS Glue uses to execute your session. This is the same as AWS Glue
ETL.

Read [this documentation](https://docs.aws.amazon.com/glue/latest/dg/glue-is-security.html) to configure these principals.


You will find bellow a least privileged policy to enjoy all features of **`dbt-glue`** adapter.

Please to update variables between **`<>`**, here are explanations of these arguments:

|Args	|Description	| 
|---|---|
|region|The region where you're Glue database is stored |
|AWS Account|The AWS account where you run your pipeline|
|dbt output database|The database updated by dbt (this is the database configured in the profile.yml of your dbt environment)|
|dbt source database|All databases used as source|
|dbt output bucket|The bucket name where the data will be generate dbt (the location configured in the profile.yml of your dbt environment)|
|dbt source bucket|The bucket name of source databases (if they are not managed by Lake Formation)|

<File name='sample_IAM_Policy.yml'>

```yml
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Read_and_write_databases",
            "Action": [
                "glue:SearchTables",
                "glue:BatchCreatePartition",
                "glue:CreatePartitionIndex",
                "glue:DeleteDatabase",
                "glue:GetTableVersions",
                "glue:GetPartitions",
                "glue:DeleteTableVersion",
                "glue:UpdateTable",
                "glue:DeleteTable",
                "glue:DeletePartitionIndex",
                "glue:GetTableVersion",
                "glue:UpdateColumnStatisticsForTable",
                "glue:CreatePartition",
                "glue:UpdateDatabase",
                "glue:CreateTable",
                "glue:GetTables",
                "glue:GetDatabases",
                "glue:GetTable",
                "glue:GetDatabase",
                "glue:GetPartition",
                "glue:UpdateColumnStatisticsForPartition",
                "glue:CreateDatabase",
                "glue:BatchDeleteTableVersion",
                "glue:BatchDeleteTable",
                "glue:DeletePartition",
                "lakeformation:ListResources",
                "lakeformation:BatchGrantPermissions",
                "lakeformation:ListPermissions"
            ],
            "Resource": [
                "arn:aws:glue:<region>:<AWS Account>:catalog",
                "arn:aws:glue:<region>:<AWS Account>:table/<dbt output database>/*",
                "arn:aws:glue:<region>:<AWS Account>:database/<dbt output database>"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Read_only_databases",
            "Action": [
                "glue:SearchTables",
                "glue:GetTableVersions",
                "glue:GetPartitions",
                "glue:GetTableVersion",
                "glue:GetTables",
                "glue:GetDatabases",
                "glue:GetTable",
                "glue:GetDatabase",
                "glue:GetPartition",
                "lakeformation:ListResources",
                "lakeformation:ListPermissions"
            ],
            "Resource": [
                "arn:aws:glue:<region>:<AWS Account>:table/<dbt source database>/*",
                "arn:aws:glue:<region>:<AWS Account>:database/<dbt source database>",
                "arn:aws:glue:<region>:<AWS Account>:database/default",
                "arn:aws:glue:<region>:<AWS Account>:database/global_temp"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Storage_all_buckets",
            "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<dbt output bucket>",
                "arn:aws:s3:::<dbt source bucket>"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Read_and_write_buckets",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::<dbt output bucket>"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Read_only_buckets",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::<dbt source bucket>"
            ],
            "Effect": "Allow"
        }
    ]
}
```
</File>

### Configuration of the local environment

Because **`dbt`** and **`dbt-glue`** adapter are compatible with Python versions 3.7, 3.8, and 3.9, check the version of Python:

```bash
$ python3 --version
```

Configure a Python virtual environment to isolate package version and code dependencies:

```bash
$ sudo yum install git
$ python3 -m venv dbt_venv
$ source dbt_venv/bin/activate
$ python3 -m pip install --upgrade pip
```

Configure the last version of AWS CLI

```bash
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install
```

Configure the aws-glue-session package

```bash
$ sudo yum install gcc krb5-devel.x86_64 python3-devel.x86_64 -y
$ pip3 install —upgrade boto3
$ pip3 install —upgrade aws-glue-sessions
```

### Example config
<File name='profiles.yml'>

```yml
type: glue
query-comment: This is a glue dbt example
role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
region: us-east-1
workers: 2
worker_type: G.1X
idle_timeout: 10
schema: "dbt_demo"
database: "dbt_demo"
session_provisioning_timeout_in_seconds: 120
location: "s3://dbt_demo_bucket/dbt_demo_data"
```

</File>

The table below describes all the options.

|Option	|Description	| Mandatory |
|---|---|---|
|project_name	|The dbt project name. This must be the same as the one configured in the dbt project.	|yes|
|type	|The driver to use.	|yes|
|query-comment	|A string to inject as a comment in each query that dbt runs. 	|no|
|role_arn	|The ARN of the interactive session role created as part of the CloudFormation template.	|yes|
|region	|The AWS Region were you run the data pipeline.	|yes|
|workers	|The number of workers of a defined workerType that are allocated when a job runs.	|yes|
|worker_type	|The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.	|yes|
|schema	|The schema used to organize data stored in Amazon S3.	|yes|
|database	|The database in Lake Formation. The database stores metadata tables in the Data Catalog.	|yes|
|session_provisioning_timeout_in_seconds |The timeout in seconds for AWS Glue interactive session provisioning.	|yes|
|location	|The Amazon S3 location of your target data.	|yes|
|idle_timeout	|The AWS Glue session idle timeout in minutes. (The session stops after being idle for the specified amount of time.)	|no|
|glue_version	|The version of AWS Glue for this session to use. Currently, the only valid options are 2.0 and 3.0. The default value is 2.0.	|no|
|security_configuration	|The security configuration to use with this session.	|no|
|connections	|A comma-separated list of connections to use in the session.	|no|


## Caveats

### Supported Functionality

Most dbt Core functionality is supported, but some features are only available with Apache Hudi.

Apache Hudi-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](glue-configs#the-merge-strategy))

Some dbt features, available on the core adapters, are not yet supported on Glue:
1. [Persisting](persist_docs) column-level descriptions as database comments
2. [Snapshots](snapshots)
