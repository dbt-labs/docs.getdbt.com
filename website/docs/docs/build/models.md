---
title: "About dbt models"
description: "Read this tutorial to learn how to use models when building in dbt."
id: "models"
pagination_next: "docs/build/sql-models"
pagination_prev: null
---

## Overview

dbt Core and Cloud are composed of different moving parts working harmoniously. All of them are important to what dbt does — transforming data—the 'T' in ELT. When you execute `dbt run`, you are running a model that will transform your data without that data ever leaving your warehouse.

Models are where your developers spend most of their time within a dbt environment. Models are primarily written as a `select` statement and saved as a `.sql` file. While the definition is straightforward, the complexity of the execution will vary from environment to environment.  Models will be written and rewritten as needs evolve and your organization finds new ways to maximize efficiency.

SQL is the language most dbt users will utilize, but it is not the only one for building models. Starting in version 1.3, dbt Core and dbt Cloud support Python models. Python models are useful for training or deploying data science models, complex transformations, or where a specific Python package meets a need &mdash; such as using the `dateutil` library to parse dates.

### Models and modern workflows

The top level of a dbt workflow is the project. A project is a directory of a `.yml` file (the project configuration) and either `.sql` or `.py` files (the models). The project file tells dbt the project context, and the models let dbt know how to build a specific data set. For more details on projects, refer to [About dbt projects](/docs/build/projects).

Your organization may need only a few models, but more likely you’ll need a complex structure of nested models to transform the required data. A model is a single file containing a final `select` statement, and a project can have multiple models, and models can even reference each other. Add to that, numerous projects and the level of effort required for transforming complex data sets can improve drastically compared to older methods.

Learn more about models in [SQL models](/docs/build/sql-models) and [Python models](/docs/build/python-models) pages. If you'd like to begin with a bit of practice, visit our [Getting Started Guide](/guides) for instructions on setting up the Jaffle_Shop sample data so you can get hands-on with the power of dbt.
