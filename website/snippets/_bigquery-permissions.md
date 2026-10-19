dbt user accounts need the following permissions to read from and create tables and <Term id="view">views</Term> in a BigQuery project:
- BigQuery Data Editor
- BigQuery User

<VersionBlock firstVersion="1.12">

Starting in <Constant name="dbt" /> v1.12, dbt lists and looks up BigQuery routines (functions and stored procedures) when it scans datasets. If you use a custom IAM role instead of a predefined role, also grant:
- `bigquery.routines.list`: list routines in a dataset
- `bigquery.routines.get`: read routine metadata

Without these, dbt can miss existing tables or fail on some lookups. Predefined roles such as BigQuery Data Editor typically already include them.

</VersionBlock>

For BigQuery with <Constant name="fusion_engine" />, users also need:
- BigQuery Read Session User (for Storage Read API access)

To use the [Query History](/docs/explore/model-query-history#bigquery-model-query-history) feature, add:
- BigQuery Resource Viewer

For BigQuery DataFrames, users need these additional permissions:
- BigQuery Job User
- BigQuery Read Session User
- Notebook Runtime User
- Code Creator
- colabEnterpriseUser
