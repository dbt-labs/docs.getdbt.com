---
title: Create a project
sidebar_label: dbt Cloud
id: create-a-project-dbt-cloud
---
Now that we've set up our environment, and chosen the way we want to develop,
we can create a dbt project!

> ℹ️ These are the instructions for developing a project in dbt Cloud. If you're
using the dbt CLI, follow the instructions [here](docs/create-a-project-dbt-cli).

## Create a project
dbt Cloud makes the process of creating a new project (with example models)
very easy! Once we have a new project, we can start writing our own models.
<iframe width="640" height="400" src="https://www.loom.com/embed/05478e5ba2094152b41bc8fdf9f19d9f" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

<iframe width="640" height="400" src="https://www.loom.com/embed/f5f4a51cf92548b4a84d417b37efb86b" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

1. Create a dbt Cloud account [here](https://cloud.getdbt.com/signup/). If your
organization already has a dbt Cloud account, ask an admin to add you as a
Developer.
2. If you created a new account, a new project should automatically be created.
If you were added to an existing account:
    * Click the hamburger menu, then `Account Settings`, then `Projects`.
    * Name your project "dbt Tutorial", and click `Save`. There's no need to fill
  in the other details.
    * Click the hamburger menu, and then `Home`.
    * Switch the project in the header bar to your new "dbt Tutorial" project.
3. Complete the onboarding flow:
    * Connect to BQ
    * Add a repository — choose managed repository (if you're comfortable with git,
  you can also choose to link to an existing, but bare, repository)
4. Click the hamburger menu, and then `Develop` to go to the dbt IDE (Integrated
Development Environment). Select `Initialize a project` to create your project

## Perform your first dbt run
Our sample project has some example models in it. We're going to check that we
can run them to confirm everything is in order.
1. In the terminal bar at the bottom of the screen, type in `dbt run` and hit enter

## Commit your changes
1. Click the `commit` button, with a message like "Create a dbt project"
