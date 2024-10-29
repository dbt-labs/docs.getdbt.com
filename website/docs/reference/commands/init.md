---
title: "About dbt init command"
sidebar_label: "init"
id: "init"
---

`dbt init` helps get you started using dbt Core!

## New project

If this is your first time ever using the tool, it will:
- ask you to name your project
- ask you which database adapter you're using (or to [Supported Data Platforms](/docs/supported-data-platforms))
- prompt you for each piece of information that dbt needs to connect to that database: things like `account`, `user`, `password`, etc

Then, it will:
- Create a new folder with your project name and sample files, enough to get you started with dbt
- Create a connection profile on your local machine. The default location is `~/.dbt/profiles.yml`. Read more in [configuring your profile](/docs/core/connect-data-platform/connection-profiles).

When using `dbt init` to initialize your project, include the `--profile` flag to specify an existing `profiles.yml` as the `profile:` key to use instead of creating a new one. For example, `dbt init --profile profile_name`.

If the profile does not exist in `profiles.yml` or the command is run inside an existing project, the command raises an error.


## Existing project

If you've just cloned or downloaded an existing dbt project, `dbt init` can still help you set up your connection profile so that you can start working quickly. It will prompt you for connection information, as above, and add a profile (using the `profile` name from the project) to your local `profiles.yml`, or create the file if it doesn't already exist.


## profile_template.yml

`dbt init` knows how to prompt for connection information by looking for a file named `profile_template.yml`. It will look for this file in two places:

- **Adapter plugin:** What's the bare minumum Postgres profile? What's the type of each field, what are its defaults? This information is stored in a file called [`dbt/include/postgres/profile_template.yml`](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/include/postgres/profile_template.yml). If you're the maintainer of an adapter plugin, we highly recommend that you add a `profile_template.yml` to your plugin, too. Refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide for more information.

- **Existing project:** If you're the maintainer of an existing project, and you want to help new users get connected to your database quickly and easily, you can include your own custom `profile_template.yml` in the root of your project, alongside `dbt_project.yml`. For common connection attributes, set the values in `fixed`; leave user-specific attributes in `prompts`, but with custom hints and defaults as you'd like.

<File name='profile_template.yml'>

```yml
fixed:
  account: abc123
  authenticator: externalbrowser
  database: analytics
  role: transformer
  type: snowflake
  warehouse: transforming
prompts:
  target:
    type: string
    hint: your desired target name
  user:
    type: string
    hint: yourname@jaffleshop.com
  schema:
    type: string
    hint: usually dbt_<yourname>
  threads:
    hint: "your favorite number, 1-10"
    type: int
    default: 8
```

</File>


```
$ dbt init
Running with dbt=1.0.0
Setting up your profile.
user (yourname@jaffleshop.com): summerintern@jaffleshop.com
schema (usually dbt_<yourname>): dbt_summerintern
threads (your favorite number, 1-10) [8]: 6
Profile internal-snowflake written to /Users/intern/.dbt/profiles.yml using project's profile_template.yml and your supplied values. Run 'dbt debug' to validate the connection.
```
