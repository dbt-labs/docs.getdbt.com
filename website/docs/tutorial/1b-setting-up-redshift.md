---
title: "Set up and connect Redshift"
id: setting-up-redshift
description: "Set up Redshift with sample data and connect to dbt Cloud or dbt Core."
sidebar_label: "Set up and connect Redshift"
---

In this tutorial, you will learn how to set up Redshift and connecting it to dbt Cloud.

## Prerequisites

- Existing AWS account
- Permissions to execute a CloudFormation stack to create appropriate roles and a Redshift instance.

## Setting up Redshift

Let’s get started by accessing your AWS account and setting up Redshift.

1. Sign into your AWS account on the AWS sign in page as a root user or IAM user depending on your level of access.
2. We will be using a CloudFormation stack to quickly set up a Redshift instance. Use the link below to start this process. (source: [cloudformation json file](https://github.com/aws-samples/aws-modernization-with-dbtlabs/blob/main/resources/cloudformation/create-dbtworkshop-infr))

**[Start CloudFormation Stack](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=dbt-workshop&templateURL=https://tpch-sample-data.s3.amazonaws.com/create-dbtworkshop-infr)**

3. Choose next for each page until you reach the `Select acknowledgement checkbox`. Check the box for "I acknowledge that AWS CloudFormation might create IAM resources with custom names" and click `Create Stack`.  You should land on the stack page with a `CREATE_IN_PROGRESS` status.

    <Lightbox src="/img/redshift_tutorial/images/cloud_formation_in_progress.png" title="Cloud Formation in Progress" />

4. When the stack status changes to “CREATE_COMPLETE”, click on the `Outputs` tab on the top to view information that you will use throughout the rest of this tutorial. Save those credentials for later by keeping this open in a tab.

5. Type in `Redshift` to the search bar on the top and click on `Amazon Redshift`

    <Lightbox src="/img/redshift_tutorial/images/go_to_redshift.png" title="Click on Redshift" />

6. Confirm that your new Redshift Cluster is listed under Cluster overview. Click on the cluster name.

<Lightbox src="/img/redshift_tutorial/images/cluster_overview.png" title="Available Redshift Cluster" />

7. Click on `Query Data`. You can choose the classic query editor or v2. We will be using the v2 version for the purpose of this tutorial.

8. You may be asked to Configure account.  For the purpose of this sandbox environment, we recommend selecting “Configure account”.

9. Click on your cluster name in the list and fill out the credentials from the output of the stack.
- Database: `dbtworkshop`
- User Name: `dbtadmin`
- Password: `Dbtadmin108!`

<Lightbox src="/img/redshift_tutorial/images/redshift_query_editor.png" title="Redshift Query Editor v2" />

<Lightbox src="/img/redshift_tutorial/images/connect_to_redshift_cluster.png" title="Connect to Redshift Cluster" />

10. Click on `Create Connection`.

Congrats! You have your Redshift cluster.

## How to load sample data into Redshift
Now we are going to load our sample data into the S3 bucket that our Cloudformation stack created. S3 buckets are a cheap and simple way to store data outside of Redshift.

1. The data used in this course is stored as CSVs in a public S3 bucket. You can use the following URLs to download these files. Download these to your computer to use in the following steps.
- [jaffle_shop_customers.csv](https://www.google.com/url?q=http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv&sa=D&source=editors&ust=1644864530119236&usg=AOvVaw3IVEW44ZbyLKJ5x0GZc_y_)
- [jaffle_shop_orders.csv](https://www.google.com/url?q=http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv&sa=D&source=editors&ust=1644864530119746&usg=AOvVaw0CjkjBeGxTipTjfbxvmN-_)
- [stripe_payments.csv](https://www.google.com/url?q=http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv&sa=D&source=editors&ust=1644864530120240&usg=AOvVaw1nwPSDg9fp-pnzepudMSLm)

2. Now we are going to use the S3 bucket that you created via CloudFormation and upload the files. Go to the search bar at the top and type in `S3` and click on S3. There will be sample data in the file already, feel free to ignore it or use it for other modeling exploration.

<Lightbox src="/img/redshift_tutorial/images/go_to_s3.png" title="Go to S3" />


3. Click on the `name of the bucket` S3 bucket.  If you have multiple S3 buckets, this will be the bucket that was listed under “Workshopbucket” on the Outputs page. The bucket will be prefixed with `dbt-data-lake`.a

<Lightbox src="/img/redshift_tutorial/images/s3_bucket.png" title="Go to your S3 Bucket" />

4. Click on `Upload`
5. Drag the three files into the UI.
6. Click on `Upload` on the button.

<Lightbox src="/img/redshift_tutorial/images/upload_csv.png" title="Upload your CSVs" />

7. Save the name of the S3 bucket. It should look like this: `s3://dbt-data-lake-xxxx`. You will need it for the next section.
8. Now let’s go back to the Redshift query editor. Search for Redshift in the search bar, choose your cluster, and select Query data.
9. In your query editor, execute this query below to create the schemas that we will be placing your raw data into. You can highlight the statement and then click on Run to run them individually. If you are on the Classic Query Editor, you might need to input them separately into the UI.  You should see these schemas listed under `dbtworkshop`.

```sql
create schema if not exists jaffle_shop;

create schema if not exists stripe;

<Lightbox src="/img/redshift_tutorial/images/create_schemas.png" title="Create Schemas" />

10. Now create the tables in your schema with these queries using the statements below.  These will be populated as tables in the respective schemas.

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

11. Now we need to copy the data from S3. **Be sure to update the S3 location, iam role, and region.** You can find the S3 and iam role in your outputs from the Cloudformation stack.

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

<Lightbox src="/img/redshift_tutorial/images/copy_data.png" title="Copy Your Data Query" />


Ensure that you can run a select * from each of the tables with the following code snippets.

```sql 
select * from jaffle_shop.customers;
```

```sql
select * from jaffle_shop.orders;
``` 

```sql
select * from stripe.payment;
```

<Lightbox src="/img/redshift_tutorial/images/select_jaffle_redshift.png" title="Select Jaffle Shop in Redshift Query Editor" />

Congratulations! At this point, you have created a Redshift instance and loaded training data.  In the next section, we will walk through the next steps to connect dbt Cloud and Redshift.


## How to set up a project for connect dbt Cloud to Redshift

Now it’s time to connect to dbt Cloud to Redshift in order to develop your dbt Project.


1. If you haven’t already, navigate to [dbt Cloud](cloud.getdbt.com) and create a new account. If you already have a dbt Cloud account, you can create a new project in your existing account.  In this tutorial, we will be using the Set Up project workflow for new users.  This can easily be adapted for additional projects to an existing account by navigating to accounts settings and selecting “Create new project”

2. Let’s go over to dbt Cloud. Once you have logged into your new account and validated your email, you will see our Project Setup Flow with the page Set up “Analytics”.  Click `Continue`.

<Lightbox src="/img/redshift_tutorial/images/setup_project.png" title="Setup dbt Cloud project" />


For Set up a Database Connection, choose Redshift.

<Lightbox src="/img/redshift_tutorial/images/choose_redshift.png" title="Choose Redshift" />


4. Here we will configure our connection to Redshift.  
- For the name, simply choose Redshift or another simple title
- For Redshift settings, reference your credentials you saved from the CloudFormation.
    - Your hostname is the entire hostname. Make sure to drop the http:// at the beginning and any trailing slashes at the end.
    - The port is `5439`
    - The database is `dbtworkshop`.
- When you setup your Redshift connection, you will be asked for your development credentials. Those credentials (as provided in your cloudformation output) will be:
    - Username: `dbtadmin`
    - password: `Dbtadmin108!`
    - schema: This is your sandbox schema where you will build all of your development objects into. We generally use the `dbt_<first_initial><lastname>` naming convention.

<Lightbox src="/img/redshift_tutorial/images/setup_redshift_connect.png" title="Setup Redshift Connection" />

5. Click on `Test` and then `Continue` when the test passes.  

6. On the next page, we will “Set up a Repository”.  For training purposes, we recommend selecting a managed repo and entering your first initial, last name for the repository name.  “Create” your repository and select “Continue”.
7. Now you can start developing!  Open the left hand menu in dbt Cloud and choose `Develop`.  This will load up the dbt Cloud IDE.  
9. In the upper left hand corner, select `initialize your project`.  This will set up the folder structure for your dbt Project.  Then select “commit” to initialize your repo with the commit message ‘Initial Commit’.  Create a new branch with the title ‘start-dbt-fundamentals’.  Your UI in the top left should look like this.

<Lightbox src="/img/redshift_tutorial/images/ide_initialize_project.png" title="Setup IDE" />

10. Finally, let’s make sure everything is connected correctly.  In the “Statement 1” tab, type the following code. Click on `Preview` to execute the query.

```sql
select * from jaffle_shop.customers

You should see the same results as you saw earlier when you queried the table directly in Redshift SQL editor.

<Lightbox src="/img/redshift_tutorial/images/review_jaffle_shop.png" title="Preview Jaffle Shop" />


Success!  You are all set to leverage the power of dbt Cloud and Redshift together.  As a recap, we just completed the following:

- Set up a Redshift cluster
- Loaded training data into your Redshift account
- Configured a SQL endpoint in Redshift
- Connected dbt Cloud and Redshift

