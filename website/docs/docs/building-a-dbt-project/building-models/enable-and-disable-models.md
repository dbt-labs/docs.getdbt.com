---
title: "Enable and disable models"
id: "enable-and-disable-models"
---

## Using enabled

This parameter does exactly what you might think. Setting `enabled` to `false` tells dbt not to compile and run the associated models. Be careful disabling large swaths of your project: if you disable models that are relied upon by enabled models in the dependency chain, compilation will fail.

Note that dbt does not actively delete models in your database that have been disabled. Instead, it simply leaves them out of future rounds of compilation and deployment. If you want to delete models from your schema, you will have to drop them by hand.

By default, all models are "enabled" unless manually specified otherwise.