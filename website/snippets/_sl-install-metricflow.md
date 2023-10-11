This step is for dbt Core users only.

Install [MetricFlow dbt Core](/docs/build/metricflow-core) as an extension of a dbt adapter from PyPI. The MetricFlow CLI is compatible with Python versions 3.8, 3.9, 3.10 and 3.11. You need to use `pip` to instal MetricFlow on Windows or Linux operating systems:

1. Create or activate your virtual environment. `python -m venv venv` or `source your-venv/bin/activate`
2. Run `pip install dbt-metricflow`
   - You can install MetricFlow using PyPI as an extension of your dbt adapter in the command line. To install the adapter, run `pip install "dbt-metricflow[your_adapter_name]"` and add the adapter name at the end of the command. For example, for a Snowflake adapter run `pip install "dbt-metricflow[snowflake]"`

**Note**, you'll need to manage versioning between dbt Core, your adapter, and MetricFlow.
