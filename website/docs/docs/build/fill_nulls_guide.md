# Filling null values for simple and derived/ratio metrics

You may want to coalesce null metric values with another value, like zero. This is useful if you want to express a numeric value for a metric for every row of data returned.

The `fill_nulls_with` allows you to coalesce null values with a chosen integer, however, due to the implementation of derived metrics, you can still encounter null values in a query even if the `fill_nulls_with` parameter is set on the input metrics. This guide walks through how to use fill null values for simple metrics, and how to use `join_to_timespine` and `fill_nulls_with` together to ensure there are no null values in derived and ratio metrics.  

### Filling null values for simple metrics

Say you have three metrics: website `visits`, `leads`, and a derived metric called `leads_to_website_visit` that calculates the ratio of leads to site visits. There could be days when there are site visits, but none of these site visits converted into leads. You may want to display 0 as the value for leads on days when there are no conversions. 

You can do this by adding the `fill_nulls_with` parameter to the measure input on the leads metric. 

```sql
metrics:
 - name: website_visits
	 type: simple
		type_params:
			measure:
				name: bookings
 - name: leads
	 type: simple
		type_params:
			measure:
				name: bookings
				fill_nulls_with: 0 #will fill null values with zero
 - name: leads_to_website_visit
	 type: derived
		type_params:
			expr: leads/website_visits
			metrics:
				- name: leads
				- name: website_visits
				
```

The website visits and leads metrics have the following data

| metric_time | website_visits |
| --- | --- |
| 2024-01-01 | 50 |
| 2024-01-02 | 37 |
| 2024-01-03 | 79 |

| metric_time | leads |
| --- | --- |
| 2024-01-01 | 5 |
| 2024-01-03 | 8 |

There are never any days without visits in the data set, but there are days without leads. After adding `fill_nulls_with_zero` If I query these metrics together, the null values for leads on `2024-01-02` will get filled in with zero. 

| metric_time | bookings | listings |
| --- | --- | --- |
| 2024-01-01 | 50 | 5 |
| 2024-01-02 | 37 | 0 |
| 2024-01-03 | 79 | 8 |

### Filling null values for derived metrics

To fill null values for derived and ratio metrics you need to take an extra step and join the input metric to a time spine table to ensure there is data for every reporting day. 

Why do I need to do this? Derived and ratio metrics take *metrics* as inputs instead of *measures*. When MetricFlow renders SQL the for derived or ratio metrics there is an additional subquery needed to render the metric. The subquery nesting is as follows:  `derived/ratio metric → input metrics → input measures`. For simple and cumulative metrics there are only two levels of subquery nesting. `simple/cumulative metric → input measure`. We don’t apply a COALESCE for the third, outer rendering layer for the final metric calculation in derived metrics, meaning you could still have nulls in the final result set: 

| metric_time | bookings | listings | leads_to_website_visit |
| --- | --- | --- | --- |
| 2024-01-01 | 50 | 5 | .1 |
| 2024-01-02 | 37 | 0 | null |
| 2024-01-03 | 79 | 8 | .1 |

If I want to show a zero value for `leads_to_website_visit`  for `2024-01-02` I have to join the listings metric to a time spine model to ensure a value for each day. This can be done by adding `join_to_timespine` to the measured input on the `leads` metric.

```sql
 - name: listing
	 type: simple
		type_params:
			measure:
				name: bookings
				fill_nulls_with: 0
				join_to_timespine: true
```

Now when I query the listing metric after the timespine join there will be a record for each day, and any null values will get filled with zero.

| metric_time | leads |
| --- | --- |
| 2024-01-01 | 5 |
| 2024-01-02 | 0 |
| 2024-01-03 | 8 |

When I combine the metrics in a derived metric, there will be a zero value for leads on `2024-01-02` and the final result set will not have any null values