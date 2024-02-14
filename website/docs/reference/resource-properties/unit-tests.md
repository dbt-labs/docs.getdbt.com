---
title: "About unit tests property"
sidebar_label: "Unit tests"
resource_types: [models]
datatype: test
---


Unit tests validate your SQL modeling logic on a small set of static inputs before you materialize your full model in production. They support a test-driven development approach, improving both the efficiency of developers and reliability of code.

To run only your unit tests, use the command:
`dbt test --select test_type:unit`

<file name='dbt_project.yml'>

```yml

unit_tests:
  - name: <test-name> # this is the unique name of the test
    model: <model-name> 
      versions: #optional
        include: <list-of-versions-to-include> #optional
        exclude: <list-of-versions-to-exclude> #optional
    config: 
      meta: {dictionary}
      tags: <string> | [<string>]
    given:
      - input: <ref_or_source_call> # optional for seeds
        format: dict | csv
        # if format csv, either define dictionary of rows or name of fixture
        rows:
          - {dictionary}
        fixture: <fixture-name>
      - input: ... # declare additional inputs
    expect:
      format: dict | csv
      # if format csv, either define dictionary of rows or name of fixture
      rows: 
        - {dictionary}
      fixture: <fixture-name>
    overrides: # optional: configuration for the dbt execution environment
      macros:
        is_incremental: true | false
        dbt_utils.current_timestamp: str
        # ... any other jinja function from https://docs.getdbt.com/reference/dbt-jinja-functions
        # ... any other context property
      vars: {dictionary}
      env_vars: {dictionary}
  - name: <test-name> ... # declare additional unit tests

  ```

</file>


## About writing unit tests

Unit tests are currently limited to testing SQL models and only models in your current project. 

### Versions
If your model has multiple versions, the default unit test will run on *all* versions of your model. To specify version(s) of your model to unit test, use `include` or `exclude` for the desired versions in your model versions config:

```yaml

# my test_is_valid_email_address unit test will run on all versions of my_model
unit_tests:
  - name: test_is_valid_email_address
    model: my_model
    ...
            
# my test_is_valid_email_address unit test will run on ONLY version 2 of my_model
unit_tests:
  - name: test_is_valid_email_address 
    model: my_model 
      versions:
        include: 
          - 2
    ...
            
# my test_is_valid_email_address unit test will run on all versions EXCEPT 1 of my_model
unit_tests:
  - name: test_is_valid_email_address
    model: my_model 
      versions:
        exclude: 
          - 1
    ...

```

### Format

When using `format: dict` you must supply an in-line dictionary for `rows:` (this is the default, if you don’t specify a `format`)
    
```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: dict
        rows:
          - {id: 1, name: gerda}
          - {id: 2, b: michelle}    
        ...
```

When `format: csv`, can either supply:
  - An inline csv string for `rows:`
        
  ```yaml
  unit_tests:
    - name: test_my_model
      model: my_model
      given:
        - input: ref('my_model_a')
          format: csv
          rows: |
            id,name
            1,gerda
            2,michelle
        ...
    ```

        
    - The name of a csv file in the `tests/fixtures` directory in your project (or the directory configured for [test-paths](https://docs.getdbt.com/reference/project-configs/test-paths)) for `fixture`:
        
    ```yaml
    unit_tests:
      - name: test_my_model
        model: my_model
        given:
          - input: ref('my_model_a')
            format: csv
            fixture: my_model_a_fixture
        ...
    ```
        
    ```csv
    # tests/fixtures/my_model_a_fixture.csv
    1,gerda
    2,michelle
    ```
        
### Input
        
- `input:` string that represents a `ref` or `source` call:
    - `ref('my_model')` or `ref('my_model', v='2')` or `ref('dougs_project', 'users')`
    - `source('source_schema', 'source_name')`
- `input:` is optional for seeds:
    - If you don’t supply an input for a seed, we will use the seed *as* the input.
    - If you do supply an input for a seed, we will use that input instead.
- You can also have “empty” inputs, by setting rows to an empty list `rows: []`

## Examples
```yml

unit_tests:
  - name: test_is_valid_email_address # this is the unique name of the test
    model: dim_customers # name of the model I'm unit testing
    given: # the mock data for your inputs
      - input: ref('stg_customers')
        rows:
         - {customer_id: 1, email: cool@example.com,     email_top_level_domain: example.com}
         - {customer_id: 2, email: cool@unknown.com,     email_top_level_domain: unknown.com}
         - {customer_id: 3, email: badgmail.com,         email_top_level_domain: gmail.com}
         - {customer_id: 4, email: missingdot@gmailcom,  email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        rows:
         - {tld: example.com}
         - {tld: gmail.com}
    expect: # the expected output given the inputs above
      rows:
        - {customer_id: 1, is_valid_email_address: true}
        - {customer_id: 2, is_valid_email_address: false}
        - {customer_id: 3, is_valid_email_address: false}
        - {customer_id: 4, is_valid_email_address: false}

```

```yml

unit_tests:
  - name: test_is_valid_email_address # this is the unique name of the test
    model: dim_customers # name of the model I'm unit testing
    given: # the mock data for your inputs
      - input: ref('stg_customers')
        rows:
         - {customer_id: 1, email: cool@example.com,     email_top_level_domain: example.com}
         - {customer_id: 2, email: cool@unknown.com,     email_top_level_domain: unknown.com}
         - {customer_id: 3, email: badgmail.com,         email_top_level_domain: gmail.com}
         - {customer_id: 4, email: missingdot@gmailcom,  email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        format: csv
        rows: |
          tld
          example.com
          gmail.com
    expect: # the expected output given the inputs above
      format: csv
      fixture: valid_email_address_fixture_output

```
