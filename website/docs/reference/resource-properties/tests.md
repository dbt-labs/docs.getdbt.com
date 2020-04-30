#### tests
The `tests` field is used to assert properties of a column or table. Defining tests is a great way to confirm that your code is working correctly, and also helps prevent regressions when your code changes.

In the example above, the `not_null`, `unique`, and `relationships` tests are specified for columns in the `events` model. Once these tests are defined, you can validate their correctness by running `dbt test`. More information on the options and syntax for these schema tests can be found in the [Testing](testing) guide.
