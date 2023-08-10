
:::info Model versioning is different to a version tag

Take note that [model versions](/docs/collaborate/govern/model-versions) are different from [dbt_project.yml versions](/reference/project-configs/version#dbt_projectyml-versions) and [.yml property file versions](/reference/project-configs/version#yml-property-file-versions).

Model versions is a _feature_ that enables better governance and data model management by allowing you to track changes and updates to models over time. dbt_project.yml versions refer to the compatibility of the dbt project with a specific version of dbt. Version numbers within .yml property files inform how dbt parses those YAML files. The latter two are completely optional starting from version 1.5.

:::
