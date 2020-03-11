---
title: "Installing from source"
id: "install-from-source"
---


<Callout type="warning" title="Python Requirements">

The dbt CLI is compatible with Python versions 3.6 and higher. As of v0.15.0, dbt is no longer compatible with Python2.

</Callout>

First, set up a virtual environment:
```bash
python3 -m venv dbt-env
source dbt-env/bin/activate
```

Finally, install dbt from GitHub source
```bash
git clone https://github.com/fishtown-analytics/dbt.git
cd dbt
pip install -r editable_requirements.txt
```