dbt user accounts need the following permissions to read from and create tables and <Term id="view">views</Term> in a BigQuery project:
- BigQuery Data Editor
- BigQuery User

For BigQuery with <Constant name="fusion_engine" />, users also need:
- BigQuery Read Session User (for Storage Read API access)

For BigQuery DataFrames, users need these additional permissions:
- BigQuery Job User
- BigQuery Read Session User
- Notebook Runtime User
- Code Creator
- colabEnterpriseUser
