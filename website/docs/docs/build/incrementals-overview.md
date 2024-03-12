---
title: "About Incremental models"
description: "Read this tutorial to learn about incremental models and how to use them."
id: "incrementals-overview"
---

Incremental models in dbt are designed to efficiently update your data warehouse tables by only transforming and loading new or changed data since the last run. Instead of processing your entire dataset every time, incremental models append or update only the new rows, significantly reducing the time and resources required for your data transformations.

This method not only speeds up the data processing tasks but also optimizes your data warehouse's performance and lowers compute costs. By focusing on the incremental changes in your data, dbt ensures your models are built promptly and efficiently, keeping your data up-to-date without unnecessary overhead.

- Brief overview of incremental models
- Importance of incremental models in data transformations

<Lightbox src="website/static/img/docs/building-a-dbt-project/incremental-diagram.jpg" width="60%" title="test test incremental" />

## Prerequistes
- The `is_incremental()` macro is what powers incremental materializations. It only run (and will return True) if all of the following conditions are met:

- The model must already exist in the database
- The destination table already exist in the database
- The model is configured with `materialized='incremental'`
- Ensure the `full-refresh` flag isn't passed

## Core Concepts
- Understanding Incremental Models
  - Definition and significance
  - How incremental models work in dbt
- Materializations in dbt
  - Incremental vs. other types of materializations

## Configuring Incremental Models
- Basic Configuration
  - Defining your model
  - Using the incremental materialization
- Filtering Rows for Incremental Runs
  - The is_incremental() macro
  - Examples of filtering rows
- Defining a Unique Key (Optional)
  - Purpose of a unique key
  - How to define a unique key

## Advanced Configuration
- Strategy Specific Configs
  - Managing update behavior
  - Column-specific strategies
- Handling Schema Changes
  - The on_schema_change parameter
  - Strategies for schema changes

## Performance Optimization
- Optimizing Query Performance
  - Position of is_incremental() macro
  - Using Common Table Expressions (CTEs)
- Advanced Incremental Strategies
  - Incremental strategies by adapter
  - Custom strategies

## Rebuilding Incremental Models
- When and How to Rebuild
  - Using the --full-refresh flag
  - Considerations for downstream models

## FAQ and Troubleshooting
- Common Issues and Solutions
- Tips for Efficient Modeling
- Glossary of Terms
- Definitions of key terms used in the documentation

## Appendix
- Additional Resources
- Official dbt documentation
- Community contributions and examples

## Feedback
- How to provide feedback or contribute to the documentation

## Related docs
- [Incremental models](/docs/build/incremental-models)
- [Materializations best practices](/best-practices/materializations/1-guide-overview)
