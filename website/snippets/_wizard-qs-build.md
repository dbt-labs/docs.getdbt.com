Both jaffle shop projects already ship with a staging layer, so you'll build something new on top of it: a daily revenue model.

Copy this prompt into the chat:

```text
Add a new model models/daily_revenue.sql that returns total order amount and order count per order date, using the existing orders model. Add a description and not_null and unique tests for the order date column in models/schema.yml.
```

**You should see:**

- A new file, `models/daily_revenue.sql`, that selects from `{{ ref('orders') }}`. It sums the order amount and counts orders, grouped by order date.
- An update to `models/schema.yml` with a description for the model and `not_null` and `unique` tests on the order date column.

**What just happened:** you asked for a model, a test, and docs in plain English. <Constant name="wizard" /> used the `orders` model that's already in your project, so you didn't have to name columns or write YAML.

{/* TODO(verify): confirm the generated files on the Desktop sample project. In CLI testing against jaffle_shop_duckdb this prompt produced the model, descriptions, and both tests in about 1.5 minutes. Column names in the answer may differ slightly. */}
