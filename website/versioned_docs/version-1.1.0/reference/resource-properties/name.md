#### name
The `name` field can be used to specify both model names and column names in schema.yml files. When `name` is used to denote a model (as shown on line 4 above), dbt will look up that model by its filename. The example above will look for a model called `events.sql`, for instance.
