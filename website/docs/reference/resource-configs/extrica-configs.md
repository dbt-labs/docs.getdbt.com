---
title: "Extrica configurations"
id: "extrica-configs"
---
## Configuring Extrica 

#### Install dbt-extrica adapter

```sh
 pip install  dbt-extrica
```
#### Initialize dbt project 
```sh
dbt init
```
* <b> Select Adapters </b> : After running the `dbt init` command, you'll be prompted to select adapters from a list of available adapters. Choose the appropriate adapter for your project.
* <b> Modify Profiles.yml </b> : The dbt init command will create a project structure in current dir and a .dbt folder inside users of your system. Inside .dbt folder, you'll find a profiles.yml file.

#### Configure Profiles.yml
* Open the profiles.yml file in a text editor.
* Locate the section for your selected adapter and project (e.g., extrica).
* Add the necessary connection details such as host, port, user, password, etc.
* Save and close the profiles.yml file.

#### Example profiles.yml 
Here is a  example of a dbt-extrica profile parameters. At a minimum, you need to specify `type`, `method`, `username`, `password` `host`, `port`, `schema`, `catalog` and `threads`.
<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  outputs:
    dev:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]

    prod:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]
  target: dev

```
</File>

#### Check connection is successful 
```sh
dbt debug
```
#### To run all models use below command
```sh
dbt run
```
## Model Example: 
This dbt model demonstrates a basic transformation workflow, starting with the selection of relevant columns from 
the table. The SELECT statement combines the results to present the final transformed data.
<File name='hive_partition_by.sql'>

```sql
{{ config(materialized='table') }}

with customer_insurance_data as (

SELECT
    hospital_sales.sale_id_en,
    hospital_sales.sales_date,
    hospital_sales.hospital_id_en,
    hospital_sales.product_id_en,
    customer_insurance.customerid,
    customer_insurance.gender,
    customer_insurance.annual_premium_cost
FROM
    orarcle112.annuity.hospital_product_sales_encrypt_csv hospital_sales
INNER JOIN
    orarcle112.annuity.insurance_customer_encrypt_csv customer_insurance
ON
    hospital_sales.hospital_id_en = customer_insurance.hospital_id_en
)

select *
from customer_insurance_data
```

</File>


