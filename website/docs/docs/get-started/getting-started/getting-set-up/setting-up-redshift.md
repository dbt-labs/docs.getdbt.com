---
title: "Set up and connect Redshift"
id: setting-up-redshift
description: "Set up Redshift with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect Redshift"
pagination_prev: docs/get-started/getting-started/set-up-dbt-cloud
pagination_next: docs/get-started/getting-started/building-your-first-project/build-your-first-models
---

## Introduction

For the Redshift project in the getting started guide, you'll learn how to set up Redshift and connect it to dbt Cloud.

This guide will walk you through:

- Setting up a Redshift cluster
- Loading training data into your Redshift account
- Connecting dbt Cloud and Redshift

## Prerequisites

Before beginning this tutorial you will need access to an **existing AWS account** with permissions to execute a CloudFormation template to create appropriate roles and a Redshift cluster.  If you do not have an AWS account, head over to [Sign up for AWS](https://portal.aws.amazon.com/billing/signup#/start/email).

## Setting up

Let’s get started by accessing your AWS account and setting up Redshift.

1. Sign into your AWS account on the [AWS sign in page](https://signin.aws.amazon.com/console) as a root user or IAM user depending on your level of access.
2. We will be using a CloudFormation template to quickly set up a Redshift instance. A CloudFormation template is a configuration file that will automatically spin up the necessary resources in AWS.  Use the link below to start this process. (source: [cloudformation json file](https://github.com/aws-samples/aws-modernization-with-dbtlabs/blob/main/resources/cloudformation/create-dbtworkshop-infr))

**[Start CloudFormation Stack](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=dbt-workshop&templateURL=https://tpch-sample-data.s3.amazonaws.com/create-dbtworkshop-infr)**

3. Choose next for each page until you reach the `Select acknowledgement checkbox`. Check the box for "I acknowledge that AWS CloudFormation might create IAM resources with custom names" and click `Create Stack`.  You should land on the stack page with a `CREATE_IN_PROGRESS` status.

    <Lightbox src="/img/redshift_tutorial/images/cloud_formation_in_progress.png" title="Cloud Formation in Progress" />

4. When the stack status changes to “CREATE_COMPLETE”, click on the `Outputs` tab on the top to view information that you will use throughout the rest of this guide. Save those credentials for later by keeping this open in a tab.

5. Type in `Redshift` to the search bar on the top and click on `Amazon Redshift`

    <Lightbox src="/img/redshift_tutorial/images/go_to_redshift.png" title="Click on Redshift" />

6. Confirm that your new Redshift Cluster is listed under Cluster overview. Click on the cluster name.

<Lightbox src="/img/redshift_tutorial/images/cluster_overview.png" title="Available Redshift Cluster" />

7. Click on `Query Data`. You can choose the classic query editor or v2. We will be using the v2 version for the purpose of this guide.

8. You may be asked to Configure account.  For the purpose of this sandbox environment, we recommend selecting “Configure account”.

9. Click on your cluster name in the list and fill out the credentials from the output of the stack.
- Database: `dbtworkshop`
- User Name: `dbtadmin`
- Password: *choose your own password and save it for later*

<Lightbox src="/img/redshift_tutorial/images/redshift_query_editor.png" title="Redshift Query Editor v2" />

<Lightbox src="/img/redshift_tutorial/images/connect_to_redshift_cluster.png" title="Connect to Redshift Cluster" />

10. Click on `Create Connection`.

Congrats! You have your Redshift cluster.

## Loading data

Now we are going to load our sample data into the S3 bucket that our Cloudformation template created. S3 buckets are a cheap and simple way to store data outside of Redshift.

1. The data used in this course is stored as CSVs in a public S3 bucket. You can use the following URLs to download these files. Download these to your computer to use in the following steps.
- [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
- [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
- [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. Now we are going to use the S3 bucket that you created via CloudFormation and upload the files. Go to the search bar at the top and type in `S3` and click on S3. There will be sample data in the file already, feel free to ignore it or use it for other modeling exploration.

<Lightbox src="/img/redshift_tutorial/images/go_to_s3.png" title="Go to S3" />


3. Click on the `name of the bucket` S3 bucket.  If you have multiple S3 buckets, this will be the bucket that was listed under “Workshopbucket” on the Outputs page. The bucket will be prefixed with `dbt-data-lake`.

<Lightbox src="/img/redshift_tutorial/images/s3_bucket.png" title="Go to your S3 Bucket" />

4. Click on `Upload`, drag the three files into the UI, and click on `Upload` on the button.

<Lightbox src="/img/redshift_tutorial/images/upload_csv.png" title="Upload your CSVs" />

5. Save the name of the S3 bucket. It should look like this: `s3://dbt-data-lake-xxxx`. You will need it for the next section.
6. Now let’s go back to the Redshift query editor. Search for Redshift in the search bar, choose your cluster, and select Query data.
7. In your query editor, execute this query below to create the schemas that we will be placing your raw data into. You can highlight the statement and then click on Run to run them individually. If you are on the Classic Query Editor, you might need to input them separately into the UI.  You should see these schemas listed under `dbtworkshop`.

```sql
create schema if not exists jaffle_shop;
create schema if not exists stripe;
```

8. Now create the tables in your schema with these queries using the statements below.  These will be populated as tables in the respective schemas.

```sql
create table jaffle_shop.customers(
  id integer,
  first_name varchar(50),
  last_name varchar(50)
);

create table jaffle_shop.orders(
  id integer,
  user_id integer,
  order_date date,
  status varchar(50),
  _etl_loaded_at timestamp default current_timestamp
);

create table stripe.payment(
  id integer,
  orderid integer,
  paymentmethod varchar(50),
  status varchar(50),
  amount integer,
  created date,
  _batched_at timestamp default current_timestamp
);
```

9. Now we need to copy the data from S3. **Be sure to update the S3 location, iam role, and region.** You can find the S3 and iam role in your outputs from the Cloudformation stack.

```sql
copy jaffle_shop.customers( id, first_name, last_name)
from 's3://dbt-data-lake-xxxx/jaffle_shop_customers.csv'
iam_role 'arn:aws:iam::XXXXXXXXXX:role/RoleName'
region 'us-east-1'
delimiter ','
ignoreheader 1
acceptinvchars;
       
copy jaffle_shop.orders(id, user_id, order_date, status)
from 's3://dbt-data-lake-xxxx/jaffle_shop_orders.csv'
iam_role 'arn:aws:iam::XXXXXXXXXX:role/RoleName'
region 'us-east-1'
delimiter ','
ignoreheader 1
acceptinvchars;

copy stripe.payment(id, orderid, paymentmethod, status, amount, created)
from 's3://dbt-data-lake-xxxx/stripe_payments.csv'
iam_role 'arn:aws:iam::XXXXXXXXXX:role/RoleName'
region 'us-east-1'
delimiter ','
ignoreheader 1
Acceptinvchars;
```

Ensure that you can run a select * from each of the tables with the following code snippets.

```sql 
select * from jaffle_shop.customers;
select * from jaffle_shop.orders;
select * from stripe.payment;
```

Congratulations! At this point, you have created a Redshift instance and loaded training data.  In the next section, we will walk through the next steps to connect dbt Cloud and Redshift.

## Connecting to dbt Cloud

#### Create a dbt Cloud account

<Snippet src="tutorial-create-new-dbt-cloud-account" />

#### Connect dbt Cloud to Redshift

Now let's set up the connection between dbt Cloud and Redshift

1. Click **Redshift** to set up your connection.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_setup_redshift_connection_start.png" title="dbt Cloud - Choose Redshift Connection" />
    </div>

2. For the name, write `Redshift` or another simple title.    

3. Enter your Redshift settings. Reference your credentials you saved from the CloudFormation template.
    - Your hostname is the entire hostname. Make sure to drop the http:// at the beginning and any trailing slashes at the end.
    - The port is `5439`
    - The database is `dbtworkshop`.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_redshift_account_settings.png" title="dbt Cloud - Redshift Cluster Settings" />
    </div>

4. Set your development credentials. These credentials will be used by dbt Cloud to connect to Redshift. Those credentials (as provided in your cloudformation output) will be:
    - Username: `dbtadmin`
    - password: *this was the password that you set earlier in the guide*
    - Schema: You’ll notice that the schema name has been auto created for you. By convention, this is `dbt_<first-initial><last-name>`. This is the schema connected directly to your development environment, and it's where your models will be built when running dbt within the Cloud IDE.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_redshift_development_credentials.png" title="dbt Cloud - Redshift Development Credentials" />
    </div>

4. Click **Test Connection** at the bottom. This verifies that dbt Cloud can access your Redshift cluster.
5. If the connection test succeeds, click **Next**. If it fails, you may need to check your Redshift settings and credentials.

## Initialize your repository and start development

### Setting up a managed repository

<Snippet src="tutorial-managed-repo" />

### Initialize your dbt project

<Snippet src="tutorial-initiate-project" />

Congratulations! You have successfully completed the following:

- Set up a Redshift cluster
- Loaded training data into your Redshift account
- Connected dbt Cloud and Redshift

## Next steps

<Snippet src="tutorial-next-steps-setting-up" />
