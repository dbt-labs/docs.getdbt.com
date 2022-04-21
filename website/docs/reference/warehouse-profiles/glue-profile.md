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
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/todo)     


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

To enjoy all features of **`dbt-glue`** adapter, you will need to attach to the Service role the 3 AWS managed policies below:

| Service  | managed policy required  |
|---|---|
| Amazon S3 | AmazonS3FullAccess |
| AWS Glue | AWSGlueConsoleFullAccess |
| AWS Lake formation | AWSLakeFormationDataAdmin |

### Configuration of the local environment

Because **`dbt`** and **`dbt-glue`** adapter are compatible with Python versions 3.7, 3.8, and 3.9, check the version of Python:

```bash
$ python3 --version
```

Configure a Python virtual environment to isolate package version and code dependencies:

```bash
$ sudo yum install git
$ python3 -m pip install --upgrade pip
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