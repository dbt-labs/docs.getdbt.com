Now make a small change and watch <Constant name="wizard" /> work out what it touches. Copy this prompt into the chat:

```text
Add an average_order_value column to daily_revenue, then check that nothing downstream breaks.
```

**You should see** a small diff. One new column in `daily_revenue.sql`:

```sql
        sum(amount) as total_order_amount,
        count(*) as order_count,
        sum(amount) / count(*) as average_order_value
```

And a matching entry in `schema.yml`:

```yaml
      - name: average_order_value
        description: Average order amount on this date
```

Nothing else in the project references `daily_revenue`, so there's nothing downstream to break. <Constant name="wizard" /> checks that for you before it changes anything.

**What just happened:** <Constant name="wizard" /> looked at the lineage first, then made the change. That's the difference between an agent that knows your project and one that only sees files.
