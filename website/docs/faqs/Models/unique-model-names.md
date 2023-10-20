---
title: Do model names need to be unique?
description: "Unique model names to build dependencies"
sidebar_label: 'Model names need to be unique'
id: unique-model-names

---

<VersionBlock firstVersion="1.6">

Within one project: yes! To build dependencies between models, you need to use the `ref` function, and pass in the model name as an argument. dbt uses that model name to uniquely resolve the `ref` to a specific model. As a result, these model names need to be unique, _even if they are in distinct folders_.

A model in one project can have the same name as a model in another project (installed as a dependency). dbt uses the project name to uniquely identify each model. We call this "namespacing." If you `ref` a model with a duplicated name, it will resolve to the model within the same namespace (package or project), or raise an error because of an ambiguous reference. Use [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant) to disambiguate references by specifying the namespace.

Those models will still need to land in distinct locations in the data warehouse. Read the docs on [custom aliases](/docs/build/custom-aliases) and [custom schemas](/docs/build/custom-schemas) for details on how to achieve this.

</VersionBlock>

<VersionBlock lastVersion="1.5">

Yes! To build dependencies between models, you need to use the `ref` function, and pass in the model name as an argument. dbt uses that model name to uniquely resolve the `ref` to a specific model. As a result, these model names need to be unique, _even if they are in distinct folders_.

Often, this question comes up because users want to give two models the same name in their warehouse, splitting them across separate schemas (e.g. `stripe.users` and `app.users`). Checkout the docs on [custom aliases](/docs/build/custom-aliases) and [custom schemas](/docs/build/custom-schemas) to achieve this.

</VersionBlock>
