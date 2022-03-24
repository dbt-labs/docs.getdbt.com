---
id: model 
title: Model
displayText: model  
hoverSnippet: In dbt, a model is one unit of sql transformation that creates a table or view in a database. 
---

In dbt, a model is one unit of sql transformation that creates a table or view in a database. 
What does it look like?: It is usually a SELECT statement that is defined in a .sql file.

In dbt, each model is a unique ```.sql``` file, which contains one SQL select statement, which can be as simple as ```select * from table_a``` or as complex as hundreds of lines, but it is only one statement, without DDL/DML or other database commands.

A model name is important, because it represents a node in the DAG and the name of the database object in your warehouse.
