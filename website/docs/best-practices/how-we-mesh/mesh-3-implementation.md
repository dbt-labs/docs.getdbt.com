---
title: "Implementing your mesh plan"
description: Getting started with dbt Mesh patterns
hoverSnippet: Learn how to get started with dbt Mesh
---

As mentioned before, the key decision in migrating to a multi-project architecture is understanding how your project is already being grouped, built, and deployed. We can use this information to inform our decision to split our project apart.

- **Examine your jobs** - which sets of models are most often built together?
- **Look at your lineage graph** - how are models connected?
- **Look at your selectors** defined in `selectors.yml` - how do people already define resource groups?
- **Talk to teams** about what sort of separation naturally exists right now.
  - Are there various domains people are focused on?
  - Are there various sizes, shapes, and sources of data that get handled separately (such as click event data)?
  - Are there people focused on separate levels of transformation, such as landing and staging data or building marts?

## Add groups and access

Once you have a sense of some initial groupings, you can first implement **group and access permissions** within a single project.

- First you can create a [group](/docs/build/groups) to define the owner of a set of models.

```yml
# in models/__groups.yml

groups: 
  - name: marketing
    owner:
        name: Ben Jaffleck 
        email: ben.jaffleck@jaffleshop.com
```

- Then, we can add models to that group using the `group:` key in the model's YAML entry.

```yml
# in models/marketing/__models.yml

models: 
  - name: fct_marketing_model
    group: marketing
  - name: stg_marketing_model
    group: marketing
```

- Once you've added models to the group, you can **add [access](/docs/collaborate/govern/model-access) settings to the models** based on their connections between groups, *opting for the most private access that will maintain current functionality*. This means that any model that has *only* relationships to other models in the same group should be `private` , and any model that has cross-group relationships, or is a terminal node in the group DAG should be `protected` so that other parts of the DAG can continue to reference it.

```yml
# in models/marketing/__models.yml

models: 
  - name: fct_marketing_model
    group: marketing
    access: protected
  - name: stg_marketing_model
    group: marketing
    access: private
```

- **Validate these groups by incrementally migrating your jobs** to execute these groups specifically via selection syntax. We would recommend doing this in parallel to your production jobs until you’re sure about them. This will help you feel out if you’ve drawn the lines in the right place.
- If you find yourself **consistently making changes across multiple groups** when you update logic, that’s a sign that **you may want to rethink your groups**.

## Split your projects

1. **Move your grouped models into a subfolder**. This will include any model in the selected group, it's associated YAML entry, as well as its parent or child resources as appropriate depending on where this group sits in your DAG.
   1. Note that just like in your dbt project, circular refereneces are not allowed! Project B cannot have parents and children in Project A, for example.
2. **Create a new `dbt_project.yml` file** in the subdirectory.
3. **Copy any macros** used by the resources you moved.
4. **Create a new `packages.yml` file** in your subdirectory with the packages that are used by the resources you moved.
5. **Update `{{ ref }}` functions** &mdash; For any model that has a cross-project dependency (this may be in the files you moved, or in the files that remain in your project):
   1. Update the `{{ ref() }}` function to have two arguments, where the first is the name of the source project and the second is the name of the model: e.g. `{{ ref('jaffle_shop', 'my_upstream_model') }}`
   2. Update the upstream, cross-project parents’ `access` configs to `public` , ensuring any project can safely `{{ ref() }}` those models.
   3. We *highly* recommend adding a [model contract](/docs/collaborate/govern/model-contracts) to the upstream models to ensure the data shape is consistent and reliable for your downstream consumers.
6. **Create a `dependencies.yml` file** ([docs](/docs/collaborate/govern/project-dependencies)) for the downstream project, declaring the upstream project as a dependency.

```yml

# in dependencies.yml
projects:
  - name: jaffle_shop
```

### Best practices

- When you’ve **confirmed the right groups**, it's time to split your projects.
  - **Do *one* group at a time**!
  - **Do *not* refactor as you migrate**, however tempting that may be. Focus on getting 1-to-1 parity and log any issues you find in doing the migration for later. Once you’ve fully migrated the project then you can start optimizing it for its new life as part of your mesh.
- Start by splitting your project within the same repository for full git tracking and easy reversion if you need to start from scratch.


## Connecting existing projects

Some organizations may already be coordinating across multiple dbt projects. Most often this is via:

1. Installing parent projects as dbt packages
2. Using `{{ source() }}` functions to read the outputs of a parent project as inputs to a child project. 

This has a few drawbacks:

1. If using packages, each project has to include *all* resources from *all* projects in its manifest, slowing down dbt and the development cycle.
2. If using sources, there are breakages in the lineage, as there's no real connection between the parent and child projects.

The migration steps here are much simpler than splitting up a monolith!

1. If using the `package` method:
   1. In the parent project:
      1. mark all models being referenced downstream as `public` and add a model contract.
   2. In the child project:
      1. Remove the package entry from `packages.yml`
      2. Add the upstream project to your `dependencies.yml`
      3. Update the `{{ ref() }}` functions to models from the upstream project to include the project name argument.
1. If using `source` method:
   1. In the parent project:
      1. mark all models being imported downstream as `public` and add a model contract.
   2. In the child project:
      1. Add the upstream project to your `dependencies.yml`
      2. Replace the `{{ source() }}` functions with cross project `{{ ref() }}` functions.
      3. Remove the unnecessary `source` definitions.

## Additional Resources
### Our example projects

We've provided a set of example projects you can use to explore the topics covered here. We've split our [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) project into 3 separate projects in a multi-repo dbt Mesh. Note that you'll need to leverage dbt Cloud to use multi-project architecture, as cross-project references are powered via dbt Cloud's APIs.

- **[Platform](https://github.com/dbt-labs/jaffle-shop-mesh-platform)** - containing our centralized staging models.
- **[Marketing](https://github.com/dbt-labs/jaffle-shop-mesh-marketing)** - containing our marketing marts.
- **[Finance](https://github.com/dbt-labs/jaffle-shop-mesh-finance)** - containing our finance marts.

### dbt-meshify

We recommend using the `dbt-meshify` [command line tool](<https://dbt-labs.github.io/dbt-meshify/0.1/>) to help you do this. This comes with CLI operations to automate most of the above steps.
