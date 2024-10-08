---
title: "Snowflake feature store and dbt: A bridge between data pipelines and ML"
description: A deep-dive into the workflow steps you can take to build and deploy ML models within a single platform.
slug: snowflake-feature-store
authors: [randy_pettus, luis_leon]
tags: [snowflake ML]
hide_table_of_contents: false
date: 2024-10-08
is_featured: true
---

Flying home into Detroit this past week working on this blog post on a plane and saw for the first time, the newly connected deck of the Gordie Howe International [bridge](https://www.freep.com/story/news/local/michigan/detroit/2024/07/24/gordie-howe-bridge-deck-complete-work-moves-to-next-phase/74528258007/) spanning the Detroit River and connecting the U.S. and Canada. The image stuck out because, in one sense, a feature store is a bridge between the clean, consistent datasets and the machine learning models that rely upon this data. But, more interesting than the bridge itself is the massive process of coordination needed to build it. This construction effort &mdash; I think &mdash; can teach us more about processes and the need for feature stores in machine learning (ML).

Think of the manufacturing materials needed as our data and the building of the bridge as the building of our ML models. There are thousands of engineers and construction workers taking materials from all over the world, pulling only the specific pieces needed for each part of the project. However, to make this project truly work at this scale, we need the warehousing and logistics to ensure that each load of concrete rebar and steel meets the standards for quality and safety needed and is available to the right people at the right time &mdash; as even a single fault can have catastrophic consequences or cause serious delays in project success. This warehouse and the associated logistics play the role of the feature store, ensuring that data is delivered consistently where and when it is needed to train and run ML models.

## What is a feature? 

A feature is a transformed or enriched data that serves as an input into a machine learning model to make predictions.  In machine learning, a data scientist derives features from various data sources to build a model that makes predictions based on historical data. To capture the value from this model, the enterprise must operationalize the data pipeline, ensuring that the features being used in production at inference time match those being used in training and development.

## What role does dbt play in getting data ready for ML models? 

dbt is the standard for data transformation in the enterprise. Organizations leverage dbt at scale to deliver clean and well-governed datasets wherever and whenever they are needed. Using dbt to manage the data transformation processes to cleanse and prepare datasets used in feature development will ensure consistent datasets of guaranteed data quality &mdash; meaning that feature development will be consistent and reliable.


## Who is going to use this and what benefits will they see?

Snowflake and dbt are already a well-established and trusted combination for delivering data excellence across the enterprise. The ability to register dbt pipelines in the Snowflake Feature Store further extends this combination for ML and AI workloads, while fitting naturally into the data engineering and feature pipelines already present in dbt.  


Some of the key benefits are:

- **Feature collaboration** &mdash; Data scientists, data analysts, data engineers, and machine learning engineers collaborate on features used in machine learning models in both Python and SQL, enabling teams to share and reuse features. As a result, teams can improve the time to value of models while improving the understanding of their components. This is all backed by Snowflake’s role-based access control (RBAC) and governance.
- **Feature consistency** &mdash; Teams are assured that features generated for training sets and those served for model inference are consistent. This can especially be a concern for large organizations where multiple versions of the truth might persist. Much like how dbt and Snowflake help enterprises have a single source of data truth, now they can have a single source of truth for features.
- **Feature visibility and use** &mdash; The Snowflake Feature Store provides an intuitive SDK to work with ML features and their associated metadata. In addition, users can browse and search for features in the Snowflake UI, providing an easy way to identify features
- **Point-in-time correctness** &mdash; Snowflake retrieves point-in-time correct features using ASOF Joins, removing the significant complexity in generating the right feature value for a given time period whether for training or batch prediction retrieval. 
- **Integration with data pipelines** &mdash; Teams that have already built data pipelines in dbt can continue to use these with the Snowflake Feature Store. No additional migration or feature re-creation is necessary as teams plug into the same pipelines.

## Why did we integrate/build this with Snowflake?

How does dbt help with ML workloads today? dbt plays a pivotal role in preparing data for ML models by transforming raw data into a format suitable for feature engineering. It helps orchestrate and automate these transformations, ensuring that data is clean, consistent, and ready for ML applications. The combination of Snowflake’s powerful AI Data Cloud and dbt’s transformation prowess makes it an unbeatable pair for organizations aiming to scale their ML operations efficiently.

## Making it easier for ML/Data Engineers to both build & deploy ML data & models

dbt is a perfect tool to promote collaboration between data engineers, ML engineers, and data scientists. dbt is designed to support collaboration and quality of data pipelines through features including version control, environments and development life cycles, as well as built-in data and pipeline testing. Leveraging dbt means that data engineers and data scientists can collaborate and develop new models and features while maintaining the rigorous governance and high quality that's needed.

Additionally, dbt Mesh makes maintaining domain ownership extremely easy by breaking up portions of our data projects and pipelines into connected projects where critical models can be published for consumption by others with strict data contracts enforcing quality and governance. This paradigm supports rapid development as each project can be kept to a maintainable size for its contributors and developers. Contracting on published models used between these projects ensures the consistency of the integration points between them.

Finally, dbt Cloud also provides [dbt Explorer](/docs/collaborate/explore-projects) &mdash; a perfect tool to catalog and share knowledge about organizational data across disparate teams. dbt Explorer provides a central place for information on data pipelines, including lineage information, data freshness, and quality. Best of all, dbt Explorer updates every time dbt jobs run, ensuring this information is always up-to-date and relevant.

## What tech is at play?

Here’s what you need from dbt. dbt should be used to manage data transformation pipelines and generate the datasets needed by ML engineers and data scientists maintaining the Snowflake Feature Store. dbt Cloud Enterprise users should leverage dbt Mesh to create different projects with clear owners for these different domains of data pipelines. This Mesh design will promote easier collaboration by keeping each dbt project smaller and more manageable for the people building and maintaining it. dbt also supports both SQL and Python-based transformations making it an ideal fit for AI/ML workflows, which commonly leverage both languages.

Using dbt for the data transformation pipelines will also ensure the quality and consistency of data products, which is critical for ensuring successful AI/ML efforts.

## Snowflake ML overview

The Feature Store is one component of [Snowflake ML’s](https://www.snowflake.com/en/data-cloud/snowflake-ml/) integrated suite of machine learning features that powers end-to-end machine learning within a single platform. Data scientists and ML engineers leverage ready-to-use ML functions or build custom ML workflows all without any data movement or without sacrificing governance. Snowflake ML includes scalable feature engineering and model training capabilities. Meanwhile, the Feature Store and Model Registry allow teams to store and use features and models in production, providing an end-to-end suite for operating ML workloads at scale.


## What do you need to do to make it all work?

dbt Cloud offers the fastest and easiest way to run dbt. It offers a Cloud-based IDE, Cloud-attached CLI, and even a low-code visual editor option (currently in beta), meaning it’s perfect for connecting users across different teams with different workflows and tooling preferences, which is very common in AI/ML workflows. This is the tool you will use to prepare and manage data for AI/ML, promote collaboration across the different teams needed for a successful AI/ML workflow, and ensure the quality and consistency of the underlying data that will be used to create features and train models.

Organizations interested in AI/ML workflows through Snowflake should also look at the new dbt Snowflake Native App &mdash; a Snowflake Native Application that extends the functionality of dbt Cloud into Snowflake. Of particular interest is Ask dbt &mdash; a chatbot that integrates directly with Snowflake Cortex and the dbt Semantic Layer to allow natural language questions of Snowflake data.


## How to power ML pipelines with dbt and Snowflake’s Feature Store

Let’s provide a brief example of what this workflow looks like in dbt and Snowflake to build and use the powerful capabilities of a Feature Store. For this example, consider that we have a data pipeline in dbt to process customer transaction data. Various data science teams in the organization need to derive features from these transactions to use in various models, including to predict fraud and perform customer segmentation and personalization. These different use cases all benefit from having related features, such as the count of transactions or purchased amounts over different periods of time (for example, the last day, 7 days, or 30 days) for a given customer. 

Instead of the data scientists building out their own workflows to derive these features, let’s look at the flow of using dbt to manage the feature pipeline and Snowflake’s Feature Store to solve this problem. The following subsections describe the workflow step by step.

### Create feature tables as dbt models

The first step consists of building out a feature table as a dbt model. Data scientists and data engineers plug in to existing dbt pipelines and derive a table that includes the underlying entity (for example, customer id, timestamp and feature values). The feature table aggregates the needed features at the appropriate timestamp for a given entity. Note that Snowflake provides various common feature and query patterns available [here](https://docs.snowflake.com/en/developer-guide/snowflake-ml/feature-store/examples). So, in our example, we would see a given customer, timestamp, and features representing transaction counts and sums over various periods. Data scientists can use SQL or Python directly in dbt to build this table, which will push down the logic into Snowflake, allowing data scientists to use their existing skill set.

Window aggregations play an important role in the creation of features. Because the logic for these aggregations is often complex, let’s see how Snowflake and dbt make this process easier by leveraging Don’t Repeat Yourself (DRY) principles. We’ll create a macro that will allow us to use Snowflake’s `range between` syntax in a repeatable way:

```sql
{% macro rolling_agg(column, partition_by, order_by, interval='30 days', agg_function='sum') %}
   {{ agg_function }}({{ column }}) over (
       partition by {{ partition_by }}
       order by {{ order_by }}
       range between interval '{{ interval }}' preceding and current row
   )
{% endmacro %}

```

Now, we use this macro in our feature table to build out various aggregations of customer transactions over the last day, 7 days, and 30 days. Snowflake has just taken significant complexity away in generating appropriate feature values and dbt has just made the code even more readable and repeatable. While the following example is built in SQL, teams can also build these pipelines using Python directly. 

```sql

select
   tx_datetime,
   customer_id,
   tx_amount,
   {{ rolling_agg("TX_AMOUNT", "CUSTOMER_ID", "TX_DATETIME", "1 days", "sum") }}
   as tx_amount_1d,
   {{ rolling_agg("TX_AMOUNT", "CUSTOMER_ID", "TX_DATETIME", "7 days", "sum") }}
   as tx_amount_7d,
   {{ rolling_agg("TX_AMOUNT", "CUSTOMER_ID", "TX_DATETIME", "30 days", "sum") }}
   as tx_amount_30d,
   {{ rolling_agg("TX_AMOUNT", "CUSTOMER_ID", "TX_DATETIME", "1 days", "avg") }}
   as tx_amount_avg_1d,
   {{ rolling_agg("TX_AMOUNT", "CUSTOMER_ID", "TX_DATETIME", "7 days", "avg") }}
   as tx_amount_avg_7d,
   {{ rolling_agg("TX_AMOUNT", "CUSTOMER_ID", "TX_DATETIME", "30 days", "avg") }}
   as tx_amount_avg_30d,
   {{ rolling_agg("*", "CUSTOMER_ID", "TX_DATETIME", "1 days", "count") }}
   as tx_cnt_1d,
   {{ rolling_agg("*", "CUSTOMER_ID", "TX_DATETIME", "7 days", "count") }}
   as tx_cnt_7d,
   {{ rolling_agg("*", "CUSTOMER_ID", "TX_DATETIME", "30 days", "count") }}
   as tx_cnt_30d
from {{ ref("stg_transactions") }}

```

### Create or connect to a Snowflake Feature Store

Once a feature table is built in dbt, data scientists use Snowflake’s [snowflake-ml-python](https://docs.snowflake.com/en/developer-guide/snowflake-ml/snowpark-ml) package to create or connect to an existing Feature Store in Snowflake. Data scientists can do this all in Python, including in Jupyter Notebooks or directly in Snowflake using [Snowflake Notebooks](https://docs.snowflake.com/en/user-guide/ui-snowsight/notebooks).

Let’s go ahead and create the Feature Store in Snowflake:


```sql
from snowflake.ml.feature_store import (
    FeatureStore,
    FeatureView,
    Entity,
    CreationMode
)

fs = FeatureStore(
    session=session, 
    database=fs_db, 
    name=fs_schema, 
    default_warehouse='WH_DBT',
    creation_mode=CreationMode.CREATE_IF_NOT_EXIST,
)

```

### Create and register feature entities

The next step consists of creating and registering [entities](https://docs.snowflake.com/en/developer-guide/snowflake-ml/feature-store/entities). These represent the underlying objects that features are associated with, forming the join keys used for feature lookups. In our example, the data scientist can register various entities, including for the customer, a transaction id, or other necessary attributes.

Let’s create some example entities.

```python
customer = Entity(name="CUSTOMER", join_keys=["CUSTOMER_ID"])
transaction = Entity(name="TRANSACTION", join_keys=["TRANSACTION_ID"])
fs.register_entity(customer)
fs.register_entity(transaction)

```

### Register feature tables as feature views 

After registering entities, the next step is to register a [feature view](https://docs.snowflake.com/en/developer-guide/snowflake-ml/feature-store/feature-views). This represents a group of related features that stem from the features tables created in the dbt model. In this case, note that the feature logic, refresh, and consistency is managed by the dbt pipeline. The feature view in Snowflake enables versioning of the features while providing discoverability among teams. 

```python
# Create a dataframe from our feature table produced in dbt
customers_transactions_df = session.sql(f"""
    SELECT 
        CUSTOMER_ID,
        TX_DATETIME,
        TX_AMOUNT_1D,
        TX_AMOUNT_7D,
        TX_AMOUNT_30D,
        TX_AMOUNT_AVG_1D,
        TX_AMOUNT_AVG_7D,
        TX_AMOUNT_AVG_30D,
        TX_CNT_1D,
        TX_CNT_7D,
        TX_CNT_30D     
    FROM {fs_db}.{fs_data_schema}.ft_customer_transactions
    """)

# Create a feature view on top of these features
customer_transactions_fv = FeatureView(
    name="customer_transactions_fv", 
    entities=[customer],
    feature_df=customers_transactions_df,
    timestamp_col="TX_DATETIME",
    refresh_freq=None,
    desc="Customer transaction features with window aggregates")

# Register the feature view for use beyond the session
customer_transactions_fv = fs.register_feature_view(
    feature_view=customer_transactions_fv,
    version="1",
    #overwrite=True,
    block=True)

```

### Search and discover features in the Snowflake UI

Now, with features created, teams can view their features directly in the Snowflake UI, as shown below. This enables teams to easily search and browse features, all governed through Snowflake’s role-based access control (RBAC).

<Lightbox src="/img/blog/example-snowflake-ui.png" title="Example of Snowflake UI" />

### Generate training dataset

Now that the feature view is created, data scientists produce a [training dataset](https://docs.snowflake.com/en/developer-guide/snowflake-ml/feature-store/modeling#generating-tables-for-training) that uses the feature view. In our example, whether the data scientist is building a fraud or segmentation model, they will retrieve point-in-time correct features for a customer at a specific point in time using the Feature Store’s `generate_training_set` method. 

To generate the training set, we need to supply a spine dataframe, representing the entities and timestamp values that we will need to retrieve features for. The following example shows this using a few records, although teams can leverage other tables to produce this spine.

```python
spine_df = session.create_dataframe(
    [
        ('1', '3937', "2019-05-01 00:00"), 
        ('2', '2', "2019-05-01 00:00"),
        ('3', '927', "2019-05-01 00:00"),
    ], 
    schema=["INSTANCE_ID", "CUSTOMER_ID", "EVENT_TIMESTAMP"])

train_dataset = fs.generate_dataset(
    name= "customers_fv",
    version= "1_0",
    spine_df=spine_df,
    features=[customer_transactions_fv],
    spine_timestamp_col= "EVENT_TIMESTAMP",
    spine_label_cols = []
)

```

Now that we have produced the training dataset, let’s see what it looks like.

<Lightbox src="/img/blog/example-training-data-set.png" title="Example of training dataset" />

### Train and deploy a model

Now with this training set, data scientists can use [Snowflake Snowpark](https://docs.snowflake.com/en/developer-guide/snowpark/index) and [Snowpark ML Modeling](https://docs.snowflake.com/en/developer-guide/snowflake-ml/modeling) to use familiar Python frameworks for additional preprocessing, feature engineering, and model training all within Snowflake. The model can be registered in the Snowflake [Model Registry](https://docs.snowflake.com/en/developer-guide/snowflake-ml/model-registry/overview) for secure model management. Note that we will leave the model training for you as part of this exercise.

### Retrieve features for predictions

For inference, data pipelines retrieve feature values using the [retrieve_feature_values](https://docs.snowflake.com/en/developer-guide/snowflake-ml/feature-store/modeling#retrieving-features-and-making-predictions) method. These retrieved values can be fed directly to a model’s predict capability in your Python session using a developed model or by invoking a model’s predict method from Snowflake’s Model Registry. For batch scoring purposes, teams can build this entire pipeline using [Snowflake ML](https://docs.snowflake.com/en/developer-guide/snowflake-ml/overview). The following code demonstrates how the features are retrieved using this method.

```python
infernce_spine = session.create_dataframe(
    [
        ('1', '3937', "2019-07-01 00:00"), 
        ('2', '2', "2019-07-01 00:00"),
        ('3', '927', "2019-07-01 00:00"),
    ], 
    schema=["INSTANCE_ID", "CUSTOMER_ID", "EVENT_TIMESTAMP"])

inference_dataset = fs.retrieve_feature_values(
    spine_df=infernce_spine,
    features=[customer_transactions_fv],
    spine_timestamp_col="EVENT_TIMESTAMP",
)

inference_dataset.to_pandas()

``` 

Here’s an example view of our features produced for model inferencing.

<Lightbox src="/img/blog/example-features-produced.png" title="Example of training data set" />

## Conclusion

We’ve just seen how quickly and easily you can begin to develop features through dbt and leverage the Snowflake Feature Store to deliver predictive modeling as part of your data pipelines. The ability to build and deploy ML models, including integrating feature storage, data transformation, and ML logic within a single platform, simplifies the entire ML life cycle. Combining this new power with the well-established partnership of dbt and Snowflake unlocks even more potential for organizations to safely build and explore new AI/ML use cases and drive further collaboration in the organization.

The code used in the examples above is publicly available on [GitHub](https://github.com/sfc-gh-rpettus/dbt-feature-store). Also, you can run a full example yourself in this [quickstart guide](https://quickstarts.snowflake.com/guide/getting-started-with-feature-store-and-dbt/index.html?index=..%2F..index#0) from the Snowflake docs.
