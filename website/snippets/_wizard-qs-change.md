Now make a small change and watch <Constant name="wizard" /> work out what it touches. Copy this prompt into the chat:

```text
Add an average_order_value column to daily_revenue, then check that nothing downstream breaks.
```

**You should see:**

- A small diff: one new column in `daily_revenue.sql`, and a matching entry in `schema.yml`.
- A note that `daily_revenue` has no downstream models, so nothing else is affected.

**What just happened:** <Constant name="wizard" /> checked the lineage before it changed anything, then described the impact. That's the difference between an agent that knows your project and one that only sees files.

{/* TODO(verify): run this prompt end to end and confirm the impact summary wording. */}
