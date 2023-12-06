---
title: "About unit tests property"
sidebar_label: "unit tests"
resource_types: [models]
datatype: test
---

<file name='dbt_project.yml'>

```yml
unit-tests:
  - name: <test-name> # this is the unique name of the test
    model: <model-name> 
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


## Definition

Unit tests validate your modeling logic on a small set of static inputs before you materialize your full model in production. Unit tests enable test-driven development, with benefits for developer efficiency and code reliability. 

To run just your unit tests:
`dbt test —-select test_type:unit`