---
title: "Platform-specific data types"
sidebar_label: "Data types"
---

Unit tests are designed to test for the expected _values_, not for the data types themselves. dbt takes the value you provide and attempts to cast it to the data type as inferred from the input and output models. 

How you specify input and expected values in your unit test YML definitions are largely consistent across data warehouses, with some variation for more complex data types.

## Snowflake data types

```yml

unit_tests:
  - name: test_my_data_types
    model: fct_data_types
    given:
      - input: ref('stg_data_types')
        rows:
         - int_field: 1
           float_field: 2.0
           str_field: my_string
           str_escaped_field: "my,cool'string"
           date_field: 2020-01-02
				   timestamp_field: 2013-11-03 00:00:00-0
           timestamptz_field: 2013-11-03 00:00:00-0
	         number_field: 3
           variant_field: 3
           geometry_field: POINT(1820.12 890.56)
           geography_field: POINT(-122.35 37.55)
           object_field: {'Alberta':'Edmonton','Manitoba':'Winnipeg'}
           str_array_field: ['a','b','c']
           int_array_field: [1, 2, 3]
		...

```

## BigQuery data types

```yml

unit_tests:
  - name: test_my_data_types
    model: fct_data_types
    given:
      - input: ref('stg_data_types')
        rows:
         - int_field: 1
           float_field: 2.0
           str_field: my_string
           str_escaped_field: "my,cool'string"
           date_field: 2020-01-02
           timestamp_field: 2013-11-03 00:00:00-0
           timestamptz_field: 2013-11-03 00:00:00-0
           bigint_field: 1
           geography_field: 'st_geogpoint(75, 45)'
           json_field: {"name": "Cooper", "forname": "Alice"}
           str_array_field: ['a','b','c']
           int_array_field: [1, 2, 3]
           date_array_field: ['2020-01-01']
           struct_field: 'struct("Isha" as name, 22 as age)'
           struct_of_struct_field: 'struct(struct(1 as id, "blue" as color) as my_struct)'
           struct_array_field: ['struct(st_geogpoint(75, 45) as my_point)', 'struct(st_geogpoint(75, 35) as my_point)']
		...

```

## Redshift data types

```yml

unit_tests:
  - name: test_my_data_types
    model: fct_data_types
    given:
      - input: ref('stg_data_types')
        rows:
         - int_field: 1
           float_field: 2.0
           str_field: my_string
           str_escaped_field: "my,cool'string"
           date_field: 2020-01-02
				   timestamp_field: 2013-11-03 00:00:00-0
           timestamptz_field: 2013-11-03 00:00:00-0
           json_field: '{"bar": "baz", "balance": 7.77, "active": false}'
		... 

```

Note that `array` is not supported at this time.

## Spark data types

```yml

unit_tests:
  - name: test_my_data_types
    model: fct_data_types
    given:
      - input: ref('stg_data_types')
        rows:
         - int_field: 1
           float_field: 2.0
           str_field: my_string
           str_escaped_field: "my,cool'string"
           bool_field: true
           date_field: 2020-01-02
				   timestamp_field: 2013-11-03 00:00:00-0
           timestamptz_field: 2013-11-03 00:00:00-0
	         int_array_field: 'array(1, 2, 3)'
           map_field: 'map("10", "t", "15", "f", "20", NULL)'
           named_struct_field: 'named_struct("a", 1, "b", 2, "c", 3)'
		... 

```

### Postgres data types

```yml

unit_tests:
  - name: test_my_data_types
    model: fct_data_types
    given:
      - input: ref('stg_data_types')
        rows:
         - int_field: 1
           float_field: 2.0
           numeric_field: 1
           str_field: my_string
           str_escaped_field: "my,cool'string"
           bool_field: true
           date_field: 2020-01-02
				   timestamp_field: 2013-11-03 00:00:00-0
           timestamptz_field: 2013-11-03 00:00:00-0
	         json_field: '{"bar": "baz", "balance": 7.77, "active": false}'
		... 

```

Note that `array` is not supported at this time.
