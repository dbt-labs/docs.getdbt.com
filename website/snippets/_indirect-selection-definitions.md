**Indirect selection modes** control which tests run based on the models you select and their relationships in your DAG. These modes determine how dbt handles tests that reference your selected models, either directly or through upstream/downstream relationships.

You can use the following modes (with `eager` as the default). Test exclusion is always greedy: if ANY parent is explicitly excluded, the test will be excluded as well.

:::tip Building subsets of a DAG
The `buildable` and `cautious` modes can be useful when you're only building a subset of your DAG, and you want to avoid test failures in `eager` mode caused by unbuilt resources. You can also achieve this with [deferral](/reference/node-selection/defer).
:::

#### Eager mode (default)

**Most inclusive.** Runs tests if ANY of the parent nodes are selected, regardless of whether all dependencies are met. This includes ANY tests that reference the selected nodes, even if they also reference other unselected nodes. 

For example, if you run `dbt test --select fct_orders`, eager mode will run:
- Tests directly on `fct_orders`
- Tests in upstream models (like `fct_order_items`) that reference `fct_orders` 
- Tests in downstream models that reference `fct_orders`

Models will be built if they depend on the selected model. In this mode, any tests depending on unbuilt resources will raise an error.

#### Buildable mode

**Middle ground.** Only runs tests that refer to selected nodes (or their ancestors). This mode is slightly more inclusive than `cautious` by including tests whose references are each within the selected nodes (or their ancestors). This mode is useful when a test depends on a model _and_ a direct ancestor of that model, like confirming an aggregation has the same totals as its input.

#### Cautious mode

**Most exclusive.** Ensures that tests are executed and models are built only when all necessary dependencies of the selected models are met. Restricts tests to only those that exclusively reference selected nodes. Tests will only be executed if all the nodes they depend on are selected, which prevents tests from running if one or more of its parent nodes are unselected and, consequently, unbuilt.

#### Empty mode

**No tests.** Restricts the build to only the selected node and ignores any indirect dependencies, including tests. It doesn't execute any tests, whether they are directly attached to the selected node or not. The empty mode does not include any tests and is automatically used for [interactive compilation](/reference/commands/compile#interactive-compile).

