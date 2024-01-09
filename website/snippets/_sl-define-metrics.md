Now that you've created your first semantic model, it's time to define your first metric! You can define metrics with the dbt Cloud IDE or command line.

MetricFlow supports different metric types like [simple](/docs/build/simple), [ratio](/docs/build/ratio), [cumulative](/docs/build/cumulative), and [derived](/docs/build/derived). It's recommended that you read the [metrics overview docs](/docs/build/metrics-overview) before getting started.

1. You can define metrics in the same YAML files as your semantic models or create a new file. If you want to create your metrics in a new file, create another directory called `/models/metrics`. The file structure for metrics can become more complex from here if you need to further organize your metrics, for example, by data source or business line.

2. The example metric we'll create is a simple metric that refers directly to the `order_total` measure, which will be implemented as a `sum()` function in SQL. Again, if you're working in the Jaffle shop sandbox, we recommend deleting the original `orders.yml` file, or removing the .yml extension so it's ignored during parsing. We'll be rebuilding the `order_total` metric from scratch. If you're working in your own project, create a simple metric like the one below using one of the measures you created in the previous step.

```yaml
metrics:
  - name: order_total
    description: Sum of total order amount. Includes tax + revenue.
    type: simple
    label: Order Total
    type_params:
      measure: order_total
```

3. Save your code, and in the next section, you'll validate your configs before committing them to your repository.

To continue building out your metrics based on your organization's needs, refer to the [Build your metrics](/docs/build/build-metrics-intro) for detailed info on how to define different metric types and semantic models.
