You can optionally use the [`volatility` config](/reference/resource-configs/volatility) for SQL or Python UDFs to describe how predictable the function output is by using `deterministic`, `stable`, or `non-deterministic`. Warehouses use this information to decide if results can be cached, reordered, or inlined. Setting the appropriate volatility helps prevent incorrect results when a function isn’t safe to cache or reorder. 

For example:
- A function that returns a random number (`random()`) should be set as `non-deterministic` because its output changes every time it’s called.
- A function that returns today’s date (`current_date()`) is `stable`; its value remains consistent within a single query execution but may change between queries. If it were configured as `deterministic`, a warehouse might incorrectly cache the value and reuse it on subsequent days.
