---
cte: 
  displayText: CTE
  hoverSnippet: A Common Table Expression (CTE) is a temporary result set that can be used in a SQL query. You can use CTEs to break up complex queries into simpler blocks of code that can connect and build on each other.

dag:
  displayText: DAG
  hoverSnippet: A DAG is a Directed Acyclic Graph, a type of graph whose nodes are directionally related to each other and don’t form a directional closed loop.

data-extraction:
  displayText: data extraction
  hoverSnippet: Data extraction is the process by which data is retrieved from multiple sources, often varying in volume and structure.

data-lake:
  displayText: data lake
  hoverSnippet: A data lake is a data management system used for storing large amounts of data in in its raw, native form as files. Data lakes can store any type of data—structured, semi-structured, unstructured—in one centralized place.

data-lineage:
  displayText: data lineage
  hoverSnippet: Data lineage provides a holistic view of how data moves through an organization, where it’s transformed and consumed.

data-warehouse:
  displayText: data warehouse
  hoverSnippet: A data warehouse is a data management system used for data storage and computing that allows for analytics activities such as transforming and sharing data.

data-catalog:
  displayText: data catalog
  hoverSnippet: A data catalog is an inventory of data assets from different parts of the data stack within an organization. This catalog can display metadata, lineage, and business definitions from your different data sources.

data-wrangling: 
  displayText: data wrangling
  hoverSnippet: Data wrangling describes the different processes used to transform raw data into a consistent and easily usable format. The ultimate goal of data wrangling is to work in a way that allows you to dive right into analysis on a dataset or build upon that data.

dataframe:
  displayText: dataframe  
  hoverSnippet: A DataFrame is a two-dimensional data structure (rows and columns). It's the most common way of representing and interacting with large datasets in Python.

ddl:
  displayText: DDL  
  hoverSnippet: Data Definition Language (DDL) is a group of SQL statements that you can execute to manage database objects, including tables, views, and more.

deploying: 
  displayText: Deploying
  hoverSnippet: Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line.

dimensional-modeling:
  displayText: dimensional modeling
  hoverSnippet: Dimensional modeling is a data modeling technique where you break data up into “facts” and “dimensions” to organize and describe entities within your data warehouse.

dml:
  displayText: DML  
  hoverSnippet: Data Manipulation Language (DML) is a class of SQL statements that are used to query, edit, add and delete row-level data from database tables or views. The main DML statements are SELECT, INSERT, DELETE, and UPDATE. 

dry:
  displayText: DRY  
  hoverSnippet: DRY is a software development principle that stands for “Don’t Repeat Yourself.” Living by this principle means that your aim is to reduce repetitive patterns and duplicate code and logic in favor of modular and referenceable code.

edw:
  displayText: EDW  
  hoverSnippet: An Enterprise Data Warehouse (EDW), like any other data warehouse, is a collection of databases that centralize a business's information from multiple sources and applications.

elt:
  displayText: ELT  
  hoverSnippet: Extract, Load, Transform (ELT) is the process of first extracting data from different data sources, loading it into a target data warehouse, and finally transforming it.

etl:
  displayText: ETL
  hoverSnippet: Extract, Transform, Load (ETL) is the process of first extracting data from a data source, transforming it, and then loading it into a target data warehouse.

grain:
  displayText: grain  
  hoverSnippet: Your data's grain is the combination of columns at which records in a table are unique. Ideally, this is captured in a single column and a unique primary key.

idempotent:
  displayText: idempotent
  hoverSnippet: Idempotent describes a process that gives you the same result no matter how many times you run it.

json:
  displayText: JSON
  hoverSnippet: JSON (JavaScript Object Notation) is a minimal format for semi-structured data used to capture relationships between fields and values.

materialization:
  displayText: materialization 
  hoverSnippet: The exact Data Definition Language (DDL) that dbt will use when creating the model’s equivalent in a data warehouse. 

model: 
  hoverSnippet: A model is an essential building block of the DAG
  displayText: model

monotonically-increasing:
  displayText: monotonically increasing 
  hoverSnippet: A monotonically-increasing sequence is a sequence whose values are sorted in ascending order and do not decrease. For example, the sequences 1, 6, 7, 11, 131 or 2, 5, 5, 5, 6, 10.

predicate-pushdown:
  displayText: Predicate pushdown
  hoverSnippet: A predicate pushdown is an expression used to determine what rows in a database apply to a particular query

primary-key:
  displayText: primary key  
  hoverSnippet: A primary key is a non-null column in a database object that uniquely identifies each row.

relational-database:
  displayText: relational database
  hoverSnippet: A relational database provides a structured way to store data into tables consisting of rows and columns. Different tables in a relational database can be joined together using common columns from each table, forming relationships.

reverse-etl:
  displayText: reverse ETL
  hoverSnippet: Reverse ETL is the process of getting your transformed data stored in your data warehouse to end business platforms, such as sales CRMs and ad platforms. 

subquery:
  displayText: subquery
  hoverSnippet: A subquery is a query within another query. Subqueries are often used when you need to process data in multiple steps.

surrogate-key:
  displayText: surrogate key  
  hoverSnippet: A surrogate key is a unique identifier derived from the data itself. It often takes the form of a hashed value of multiple columns that will create a uniqueness constraint for each row.

table:
  displayText:  table 
  hoverSnippet: In simplest terms, a table is the direct storage of data in rows and columns.  Think excel sheet with raw values in each of the cells.  

view:
  displayText: view  
  hoverSnippet: A view (as opposed to a table) is a defined passthrough SQL query that can be run against a database (or data warehouse).
---
