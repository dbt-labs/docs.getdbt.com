Before you begin, install the [MetricFlow CLI](/docs/build/metricflow-cli) as an extension of a dbt adapter from PyPI. The MetricFlow CLI is compatible with Python versions 3.8, 3.9, 3.10 and 3.11

Use pip install `metricflow` and your [dbt adapter](/docs/supported-data-platforms):

- Create or activate your virtual environment. `python -m venv venv` or `source your-venv/bin/activate`
- Run `pip install "dbt-metricflow[your_adapter_name]"`
  - You must specify `[your_adapter_name]`. For example, run `pip install "dbt-metricflow[snowflake]"` if you use a Snowflake adapter.
