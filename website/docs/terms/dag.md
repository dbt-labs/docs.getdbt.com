---
id: dag
title: DAG
displayText: DAG  
hoverSnippet: A "graph" is a structure in which some pairs of objects are in some sense related.
---

A "graph" is a structure in which some pairs of objects are in some sense related.

dbt build a DAG (Directed Acyclic Graph) based on the interdependencies between models (which represent the nodes of the graph), and edges (which represent the lines of the graph). These interdependencies are are defined by ```ref``` and ```source``` functions in your code. A model or raw source specified in one of these functions is a known antecedent of the current model, so when you save in Cloud IDE or run a command in CLI, dbt will compile your project and log these interdependencies.

The first word, "directed", means there is an inherent order in which the data must flow. When dbt runs, models are executed in the order defined by the DAG. 

the second word, "acyclic" means there are no cycles or no circular dependencies. This helps with idempotency and consistent behavior when running your models. 

Analytics Engineers use the DAG as a window into the project. It allows you to see how different models relate to each other without getting bogged down into the nitty gritty of SQL statements and transformations.
