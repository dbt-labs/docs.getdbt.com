---
resource_types: all
datatype: test
---
<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document.

</Alert>

<!--
To-full re-do when we look at the `tests` documentation, include:
- severity
- tag
-->

The `tests` field is used to assert properties of a column or table. Defining tests is a great way to confirm that your code is working correctly, and also helps prevent regressions when your code changes.

Once these tests are defined, you can validate their correctness by running `dbt test`. More information on the options and syntax for these schema tests can be found in the [Testing](testing) guide.
