---
title: "Debug errors"
id: "debug-errors"
description: Learn about errors and the art of debugging them.
displayText: Debugging errors
hoverSnippet: Learn about errors and the art of debugging those errors.
icon: 'guides'
hide_table_of_contents: true
tags: ['Troubleshooting', 'dbt Core', 'dbt Cloud']
level: 'Beginner'
recently_updated: true
---

## General process of debugging

Learning how to debug is a skill, and one that will make you great at your role!
1. Read the error message — when writing the code behind dbt, we try our best to make error messages as useful as we can. The error message dbt produces will normally contain the type of error (more on these error types below), and the file where the error occurred.
2. Inspect the file that was known to cause the issue, and see if there's an immediate fix.
3. Isolate the problem — for example, by running one model a time, or by undoing the code that broke things.
4. Get comfortable with compiled files and the logs.
    - The `target/compiled` directory contains `select` statements that you can run in any query editor.
    - The `target/run` directory contains the SQL dbt executes to build your models.
    - The `logs/dbt.log` file contains all the queries that dbt runs, and additional logging. Recent errors will be at the bottom of the file.
    - **dbt Cloud users**: Use the above, or the `Details` tab in the command output.
    - **dbt Core users**: Note that your code editor _may_ be hiding these files from the tree <Term id="view" /> [VSCode help](https://stackoverflow.com/questions/42891463/how-can-i-show-ignored-files-in-visual-studio-code)).
5. If you are really stuck, try [asking for help](/community/resources/getting-help). Before doing so, take the time to write your question well so that others can diagnose the problem quickly.


## Types of errors
Below, we've listed some of common errors. It's useful to understand what dbt is doing behind the scenes when you execute a command like `dbt run`.

| Step | Description | Error type |
|:-----|:------------|:-----------|
| Initialize | Check that this a dbt project, and that dbt can connect to the warehouse | `Runtime Error` |
| Parsing | Check that the Jinja snippets in `.sql` files valid, and that `.yml` files valid. | `Compilation Error` |
| Graph validation | Compile the dependencies into a graph. Check that it's acyclic. | `Dependency Error` |
| SQL execution | Run the models | `Database Error` |

Let's dive into some of these errors and how to debug 👇. Note: not all errors are covered here!

## Runtime Errors
_Note: If you're using the dbt Cloud IDE to work on your project, you're unlikely to encounter these errors._

### Not a dbt project

```
Running with dbt=0.17.1
Encountered an error:
Runtime Error
  fatal: Not a dbt project (or any of the parent directories). Missing dbt_project.yml file
```
<details>
<summary>Debugging</summary>

- Use `pwd` to check that you're in the right directory. If not, `cd` your way there!
- Check that you have a file named `dbt_project.yml` in the root directory of your project. You can use `ls` to list files in the directory, or also open the directory in a code editor and see files in the "tree view".

</details>


### Could not find profile

```
Running with dbt=0.17.1

Encountered an error:
Runtime Error
  Could not run dbt
  Could not find profile named 'jaffle_shops'
```
<details>
<summary>Debugging</summary>

- Check the `profile:` key in your `dbt_project.yml`. For example, this project uses the `jaffle_shops` (note plural) profile:

<File name='dbt_project.yml'>

```yml
profile: jaffle_shops # note the plural
```
</File>

- Check the profiles you have in your `profiles.yml` file. For example, this profile is named `jaffle_shop` (note singular).

<File name='profiles.yml'>

```yaml
jaffle_shop: # this does not match the profile: key
  target: dev

  outputs:
    dev:
      type: postgres
      schema: dbt_alice
      ... # other connection details
```

</File>

- Update these so that they match.
- If you can't find your `profiles.yml` file, run `dbt debug --config-dir` for help:
```
$ dbt debug --config-dir
Running with dbt=0.17.1
To view your profiles.yml file, run:

open /Users/alice/.dbt
```

  - Then execute `open /Users/alice/.dbt` (adjusting accordingly), and check that you have a `profiles.yml` file. If you do not have one, set one up using [these docs](/docs/core/connect-data-platform/profiles.yml)


</details>

### Failed to connect

```
Encountered an error:
Runtime Error
  Database error while listing schemas in database "analytics"
  Database Error
    250001 (08001): Failed to connect to DB: your_db.snowflakecomputing.com:443. Incorrect username or password was specified.
```

<details>
<summary>Debugging</summary>


- Open your `profiles.yml` file (if you're unsure where this is, run `dbt debug --config-dir`)
- Confirm that your credentials are correct — you may need to work with a DBA to confirm this.
- After updating the credentials, run `dbt debug` to check you can connect

```
$ dbt debug
Running with dbt=0.17.1
Using profiles.yml file at /Users/alice/.dbt/profiles.yml
Using dbt_project.yml file at /Users/alice/jaffle-shop-dbt/dbt_project.yml

Configuration:
  profiles.yml file [OK found and valid]
  dbt_project.yml file [OK found and valid]

Required dependencies:
 - git [OK found]

Connection:
  ...
  Connection test: OK connection ok
```

</details>

### Invalid `dbt_project.yml` file

```
Encountered an error while reading the project:
  ERROR: Runtime Error
  at path []: Additional properties are not allowed ('hello' was unexpected)

Error encountered in /Users/alice/jaffle-shop-dbt/dbt_project.yml
Encountered an error:
Runtime Error
  Could not run dbt
```

<details>
<summary>Debugging</summary>


- Open your `dbt_project.yml` file.
- Find the offending key (e.g. `hello`, as per "'hello' was unexpected")

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
hello: world # this is not allowed

```

</File>

- Use the reference section for [`dbt_project.yml` files](/reference/dbt_project.yml.md) to correct this issue.
- If you're using a key that is valid according to the documentation, check that you're using the latest version of dbt with `dbt --version`.



</details>

## Compilation Errors

_Note: if you're using the dbt Cloud IDE to work on your dbt project, this error often shows as a red bar in your command prompt as you work on your dbt project. For dbt Core users, these won't get picked up until you run `dbt run` or `dbt compile`._


### Invalid `ref` function
```
$ dbt run -s customers
Running with dbt=0.17.1

Encountered an error:
Compilation Error in model customers (models/customers.sql)
  Model 'model.jaffle_shop.customers' (models/customers.sql) depends on a node named 'stg_customer' which was not found
```
<details>
<summary>Debugging</summary>


- Open the `models/customers.sql` file.
- `cmd + f` (or equivalent) for `stg_customer`. There must be a file named `stg_customer.sql` for this to work.
- Replace this reference with a reference to another model (i.e. the filename for another model), in this case `stg_customers`. OR rename your model to `stg_customer`

</details>

### Invalid Jinja

```
$ dbt run
Running with dbt=0.17.1
Compilation Error in macro (macros/cents_to_dollars.sql)
  Reached EOF without finding a close tag for macro (searched from line 1)
```
<details>
<summary>Debugging</summary>

Here, we rely on the Jinja library to pass back an error, and then just pass it on to you.

This particular example is for a forgotten `{% endmacro %}` tag, but you can also get errors like this for:
- Forgetting a closing `}`
- Closing a `for` loop before closing an `if` statement

To fix this:
- Navigate to the offending file (e.g. `macros/cents_to_dollars.sql`) as listed in the error message
- Use the error message to find your mistake

To prevent this:
- _(dbt Core users only)_ Use snippets to auto-complete pieces of Jinja ([atom-dbt package](https://github.com/dbt-labs/atom-dbt), [vscode-dbt extestion](https://marketplace.visualstudio.com/items?itemName=bastienboutonnet.vscode-dbt))

</details>

### Invalid YAML
dbt wasn't able to turn your YAML into a valid dictionary.

```
$ dbt run
Running with dbt=0.17.1

Encountered an error:
Compilation Error
  Error reading jaffle_shop: schema.yml - Runtime Error
    Syntax error near line 5
    ------------------------------
    2  |
    3  | models:
    4  | - name: customers
    5  |     columns:
    6  |       - name: customer_id
    7  |         tests:
    8  |           - unique

    Raw Error:
    ------------------------------
    mapping values are not allowed in this context
      in "<unicode string>", line 5, column 12
```
<details>

<summary>Debugging</summary>

Usually, it's to do with indentation — here's the offending YAML that caused this error:
```yaml
version: 2

models:
  - name: customers
      columns: # this is indented too far!
      - name: customer_id
        tests:
          - unique
          - not_null
```

To fix this:
- Open the offending file (e.g. `schema.yml`)
- Check the line in the error message (e.g. `line 5`)
- Find the mistake and fix it

To prevent this:
- (dbt Core users) Turn on indentation guides in your code editor to help you inspect your files
- Use a YAML validator ([example](http://www.yamllint.com/)) to debug any issues

</details>


### Incorrect YAML spec
Slightly different error — the YAML structure is right (i.e. the YAML parser can turn this into a python dictionary), _but_ there's a key that dbt doesn't recognize.

```
$ dbt run
Running with dbt=0.17.1

Encountered an error:
Compilation Error
  Invalid models config given in models/schema.yml @ models: {'name': 'customers', 'hello': 'world', 'columns': [{'name': 'customer_id', 'tests': ['unique', 'not_null']}], 'original_file_path': 'models/schema.yml', 'yaml_key': 'models', 'package_name': 'jaffle_shop'} - at path []: Additional properties are not allowed ('hello' was unexpected)
```

<details>
<summary>Debugging</summary>

- Open the file (e.g. `models/schema.yml`) as per the error message
- Search for the offending key (e.g. `hello`, as per "**'hello'** was unexpected")
- Fix it. Use the [model properties](/reference/model-properties) docs to find valid keys
- If you are using a valid key, check that you're using the latest version of dbt with `dbt --version`

</details>

## Dependency Errors
```
$ dbt run
Running with dbt=0.17.1-rc

Encountered an error:
Found a cycle: model.jaffle_shop.customers --> model.jaffle_shop.stg_customers --> model.jaffle_shop.customers

```


Your dbt DAG is not acyclic, and needs to be fixed!
- Update the `ref` functions to break the cycle.
- If you need to reference the current model, use the [`{{ this }}` variable](/reference/dbt-jinja-functions/this) instead.

## Database Errors

The thorniest errors of all! These errors come from your <Term id="data-warehouse" />, and dbt passes the message on. You may need to use your warehouse docs (i.e. the Snowflake docs, or BigQuery docs) to debug these.

```
$ dbt run
...
Completed with 1 error and 0 warnings:

Database Error in model customers (models/customers.sql)
  001003 (42000): SQL compilation error:
  syntax error line 14 at position 4 unexpected 'from'.
  compiled SQL at target/run/jaffle_shop/models/customers.sql
```

90% of the time, there's a mistake in the SQL of your model. To fix this:
1. Open the offending file:
    - **dbt Cloud:** Open the model (in this case `models/customers.sql` as per the error message)
    - **dbt Core:** Open the model as above. Also open the compiled SQL (in this case `target/run/jaffle_shop/models/customers.sql` as per the error message) — it can be useful to show these side-by-side in your code editor.
2. Try to re-execute the SQL to isolate the error:
    - **dbt Cloud:** Use the `Preview` button from the model file
    - **dbt Core:** Copy and paste the compiled query into a query runner (e.g. the Snowflake UI, or a desktop app like DataGrip / TablePlus) and execute it
3. Fix the mistake.
4. Rerun the failed model.

In some cases, these errors might occur as a result of queries that dbt runs "behind-the-scenes". These include:
- Introspective queries to list objects in your database
- Queries to `create` schemas
- `pre-hooks`s, `post-hooks`, `on-run-end` hooks and `on-run-start` hooks
- For incremental models, and snapshots: merge, update and insert statements

In these cases, you should check out the logs — this contains _all_ the queries dbt has run.
- **dbt Cloud**: Use the `Details` in the command output to see logs, or check the `logs/dbt.log` file
- **dbt Core**: Open the `logs/dbt.log` file.

:::tip Isolating errors in the logs
If you're hitting a strange `Database Error`, it can be a good idea to clean out your logs by opening the file, and deleting the contents. Then, re-execute `dbt run` for _just_ the problematic model. The logs will _just_ have the output you're looking for.
:::


## Common pitfalls

### `Preview` vs. `dbt run`
_(dbt Cloud IDE users only)_

There's two interfaces that look similar:
- The `Preview` button executes whatever SQL statement is in the active tab. It is the equivalent of grabbing the compiled `select` statement from the `target/compiled` directory and running it in a query editor to see the results.
- The `dbt run` command builds relations in your database

Using the `Preview` button is useful when developing models and you want to visually inspect the results of a query. However, you'll need to make sure you have executed `dbt run` for any upstream models — otherwise dbt will try to select `from` tables and views that haven't been built.


### Forgetting to save files before running
We’ve all been there. dbt uses the last-saved version of a file when you execute a command. In most code editors, and in the dbt Cloud IDE, a dot next to a filename indicates that a file has unsaved changes. Make sure you hit `cmd + s` (or equivalent) before running any dbt commands — over time it becomes muscle memory.

### Editing compiled files
_(More likely for dbt Core users)_

If you just opened a SQL file in the `target/` directory to help debug an issue, it's not uncommon to accidentally edit that file! To avoid this, try changing your code editor settings to grey out any files in the `target/` directory — the visual cue will help avoid the issue.
