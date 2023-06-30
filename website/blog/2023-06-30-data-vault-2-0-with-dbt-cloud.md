---
title: "Data Vault 2.0 with dbt Cloud"
description: "Learn how to use dbt to build custom user segments and track them over time."
slug: data-vault-with-dbt-cloud

authors: [rastislav_zdechovan], [sean_mcintyre]

tags: [data vault] 
hide_table_of_contents: false

date: 2023-06-30
is_featured: true
---

# Data Vault 2.0 on dbt Cloud

Data Vault 2.0 is a data modelling technique designed to help scale large data warehousing projects. It is a rigid, prescriptive system detailed vigorously in [a book](https://www.amazon.com/Building-Scalable-Data-Warehouse-Vault/dp/0128025107) that has become the bible for this technique.

So why Data Vault? Have you experienced a data warehousing project with 50+ data sources, with 25+ data developers working on the same data platform, or data spanning 5+ years with two or more generations of source systems? If not, it might be hard to initially understand the benefits of Data Vault, and maybe [Kimball modelling](https://docs.getdbt.com/blog/kimball-dimensional-model) is better for you. But if you are in _any_ of the situations listed, then this is the article for you!

Here’s an analogy to help illustrate Data Vault:

Think of a city’s water supply. Each house does not have a pipe directly from the local river: there is a dam and a reservoir to collect water for the city from all of the sources – the lakes, streams, creeks, glaciers – before the water is redirected into each neighbourhood and finally into each home’s taps.

A new development in the city? No problem! Just hook up the new pipes to the reservoir! Not enough water? Just find another water source and fill up the reservoir.

Data Vault is the dam and reservoir: it is the well-engineered data model to structure an organisation’s data from source systems for use by downstream data projects – rather than each team collecting data straight from the source. The Data Vault data model is designed using a few well-applied principles, and in practice, pools source data so it is available for use by all downstream consumers. This promotes a scalable data warehouse through reusability and modularity.

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/image1.png "image_tooltip")

_Artist depiction of Data Vault reservoir and dam analogy courtesy of Gwen Windflower and Midjourney_

## Data Vault components

Loading your data directly from source systems without applying any business rules implies that you want them stored in a so-called **Raw Vault**. This is most of the time the first step in the journey of transforming your data. There are situations where you’d want to apply business logic before loading the data into your presentation layer, that’s where **Business Vault **comes into play. Performance enhancement or centralised business logic are few of the reasons for doing so.

The core components of Data Vault are hubs, links and satellites. They allow for more flexibility and extensibility, and can be used to model complex processes in an agile way.

Here is what you need to know about the main components:

* **Hubs**: A hub is the central repository of all business keys identifying the same business entity. By separating data into hubs, we ensure each piece of business concept is as accurate and consistent as possible, while avoiding redundancy and ensuring referential integrity;
* **Links**: Links connect your hubs in Data Vault. The relationship is stored as data, which makes it auditable and flexible to change. There are several special types of links, but in most cases, links are bidirectional, meaning you can easily navigate back and forth between business entities. This allows you to analyse complex relationships via connections created by hubs and links in your data model;
* **Satellites**: Satellites store contextual, descriptive and historical information about the hubs and links they are attached to, depending on whether the data is related to a business object or a relationship. Each satellite in the Data Vault provides additional, valuable information about the main entity.

You can think of these Raw Vault components as LEGO bricks: they are modular and you can combine them in many different ways to build a wide variety of different, cohesive structures.

Given its modular structure that requires many joins to get the specific information, Data Vault is not intended as a final, presentation layer in your data warehouse. Instead, due to the wide variety of use cases, the framework works brilliantly as the middle, integration layer of your business, serving any form of presentation layer you might have, such as wide tables, star schema, feature stores, you name it.

To further accelerate the creation of these layers and prevent the repetition of the same business logic, you can make use of Business Vault as a complementary layer of your data warehouse.

The Business Vault is there to fill the gaps of generic, source-data-generated Raw Vault, which often does not cover all of the business processes of your organisation. You can easily address such challenges by applying soft rules applied in this.

Business Vault can also help with performance issues that can arise due to presentation layer transformations having to do lots of joins on the fly. In such scenarios, a business vault becomes a central piece for your business logic populating all of the information marts.

### Should you consider Data Vault for your data warehouse?

Data Vault is powerful modelling technique for middle-to-enterprise level data warehouses with the following attributes:

* Integration of multiple dynamic source systems;
* Long-term project with agile delivery requirements;
* Auditibilty and compliance needs;
* Preference for template based project allowing automation needs;
* High flexibility of the data model with minimal reengineering;
* Load performance is important, parallel loading is a must.

Due to its complexity, Data Vault is not a go-to choice for:

* Simple and constant systems;
* Quick one-off solutions for experiments or short-term data warehouse projects;
* Data warehouse layers needed for direct reporting.

## dbt Cloud: the operating system for Data Vault

There are many tools that can be used to implement your Data Vault project but dbt Cloud with its rich set of features provides the functionalities that make the difference by accelerating your project end to end, saving you the trouble of jumping from one tool to another.

Let’s take a look at the most impactful features and explore how you can leverage them when implementing your Data Vault project.

### Scalable schema

Don’t Repeat Yourself (DRY) software engineering principles can help you sleep better when you are dealing with complex projects, which Data Vault most often is.

dbts’ **macros **feature is a life saver in terms of templating your code. It saves you headaches due to manual errors as well as defining transformation logic in one place in case you need to change it.

Data Vault follows the insert only principle with incremental loading strategy. A built-in **jinja** functionality allows you to create one version of the dbt model for both incremental and full load of a table. The easy dependency management that this feature helps you achieve is a huge benefit for highly complex projects.

If you are new to the framework, taking a look at already built Data Vault macros can be crucial, and even if you are an expert, it can still be beneficial. dbt’s rich set of community **packages** can be directly applied to your project or used as an inspiration for your own transformation templates.

Building your transformation templates leveraging reusable macros and flexible jinja language can enhance your project development in a scalable way. When things get more complex, you are able to go back and change your templates in one place either completely, or using parameters to ensure you don’t mess with what already works well.

Scalability also happens at the database layer. With **materialisations**, you have fine-grained control over whether a database object built by dbt is persisted as a view, table, or built incrementally, which gives you control over the performance and cost characteristics of each transformation. So if your data platform bill is growing, it’s easy to identify which Data Vault components are the most expensive, and make optimisations to reduce cost.

With the active dbt open source community, there is a good chance you are facing a problem which was already solved by someone else. There are plenty of amazing packages available in the dbt [package hub](https://hub.getdbt.com/), which you can utilise to speed up your development even further.

### Agile development

dbt Cloud includes **built-in Git** with accessible features directly from its IDE, which simplifies development immensely. Once a developer is happy with their additions or changes to the Data Vault codebase, they can commit the code within the IDE and open a Pull Request, triggering a code review process. Then, with [continuous integration with dbt Cloud](https://docs.getdbt.com/docs/deploy/continuous-integration), automated checks are run to ensure data quality standards and Data Vault conventions are met, automatically preventing any bad changes from reaching production. 

The biggest boon to Data Vault developer productivity in dbt Cloud are the **DataOps** and **Data Warehouse Automation** features of dbt Cloud. Each Data Vault developer gets their own development environment to work in and there is no complicated set up process to go through.

Commit your work, create a penabled by **jobs** that can be defined for each environment separately and then scheduled or triggered by a specific event. Together with dbt **tags**, the feature allows you to orchestrate your project in an efficient and powerful way.

### Auditable data

One of the main selling points of Data Vault is its auditability. In addition to its own capabilities, dbt Cloud features enhance this advantage even further. Each job execution leaves an **audit log**, which can be leveraged to analyse trends in job performance among other things, allowing you to identify bottlenecks in your system. dbt Cloud stores **artifact **files after each execution for further processing and analysis as well.

dbt has the built-in **data lineage **which helps both developers and data consumers understand just how the data assets in the data warehouse are created. And with the self-serve and automatically generated **dbt docs**, you can spend less time answering questions about your data from across the organisation and more time building your Data Vault.

Last but not least, the built-in **dbt testing framework** allows Data Vault developers to test their assumptions about the data in their database. Not only are primary key checks and foreign key checks easy to add and simple to run, but more complex checks like integer range checks, anomaly detection, and highly sophisticated data quality checks are also possible expressed as SQL statements. Infinite Lambda have created two dbt packages for data quality, [dq_tools](https://hub.getdbt.com/infinitelambda/dq_tools/latest/) and [dq_vault](https://hub.getdbt.com/infinitelambda/dq_vault/latest/), which are described later in this post.

## How to get started with dbt Cloud and Data Vault

There are many decisions to make before you roll up your sleeves and start implementing your Data Vault data warehouse. Apart from data modelling work, you need to agree on naming conventions, hash algorithm, staging strategy and data types for standard metadata attributes, and make sure these are all well documented. Here, to save yourself some headaches in the long run, we recommend starting your own **decision log**.

In terms of the implementation of the Data Vault itself, we recommend familiarising yourself with the best practices well in advance, especially if you have no previous experience with the framework. There are two well known dbt packages focusing on Data Vault implementation, which you can take inspiration from to build your own templating system, or there can be used directly if they fit your use case.

### AutomateDV (formerly known as dbtvault)

AutomateDV is the most popular open source Data Vault package for dbt, with some users having over 5000 Data Vault components in their project. Here in Infinite Lambda, we’ve been using this package for quite some time now, even building on top of it (depending on the specifics of the project). This mature system provides a great way to start your Data Vault with dbt Cloud journey as the learning curve is quite manageable, it is well documented and even comes with tutorial and working examples built on top of Snowflake’s TPCH standard dataset. There is one limitation to using the package and that is _AutomateDV _expects your source data to contain only one delta load. In order to workaround this issue, owners of the package came up with custom dbt materialisations helping you with initial load of your system, however the performance of such load is in our experience not acceptable. 

### datavault4dbt

At first glance, this fairly new open source package works in a similar fashion, especially the usage of the macros provides the same experience (apart from names of some of the parameters). Diving deeper into documentation however, we can see it provides a higher level of customisation thanks to many global variables, which alters the behaviour of macros. It also supports any type of source data - CDC, transient or persistent, it can handle it all. We suggest looking into this package if you have a deeper understanding of Data Vault and need a complex, customisable system. It’s good to be aware of the fact that this package is new, so there is a risk of hidden unresolved issues. 

### Customising the existing packages

These two packages, AutomateDV and datavault4dbt, are the most popular approaches to building a Data Vault on dbt. However, sometimes these packages don’t quite match an organisation’s pre-existing Data Vault practices built with a different tool. At the surface, dbt looks quite simple, but deep down is extremely customisable: it’s possible to make minor modifications to the packages within your project using Jinja, which is a powerful templating language.

For example, some organisations choose different hashing algorithms to generate their Data Vault hash keys than what comes out-of-the-box with AutomateDV. So to change that, you can add a [dbt macro](https://docs.getdbt.com/docs/build/jinja-macros#macros) called [default__hash_alg_md5](https://github.com/Datavault-UK/automate-dv/blob/3db7cc285e110ae6976d0afe7a93adf9b776b449/macros/supporting/hash_components/select_hash_alg.sql#L32C1-L36) to your project with the custom logic you want. Much of the package logic can be overridden in this way to suit your needs.

### Build your own system

Every project is different and needs its own set of features, special treatments tailored to your data or performance tuning mechanisms. Because of this, for any long term, high priority data warehouse solutions we at [Infinite Lambda](https://infinitelambda.com/) recommend working on your own templating system. It needs significant engineering effort before an actual implementation (and bug fixing during), but you’ll save the time later thanks to knowing where to look for a potential issue. If you are not comfortable creating such a system from scratch, you can always start with one of above open-source packages and build on them once you hit its limits.

We at Infinite Lambda treat data quality very seriously and we push for high test coverage as well as overall data governance in every project. With the experience from multiple projects, we developed two data quality dbt packages, which can help business users raise trust in your data.

Within the [dq_tools](https://hub.getdbt.com/infinitelambda/dq_tools/latest/) _package, we aim for simple storing test results and visualisation of these in a BI dashboard. Leveraging this tool can help with making sure your system behaves in an expected way, all in a visual format of dashboard built on your favourite BI tool. [dq_vault](https://hub.getdbt.com/infinitelambda/dq_vault/latest/) package provides an overview of data quality for all Data Vault models in your dbt project. Complex as it is, Data Vault projects need detailed test coverage to make sure there are no holes in the system. This tool helps with governing your testing strategy and being able to identify issues very quickly.

To help you get started, we have created a template GitHub project you can utilise to understand basic principles of building Data Vault with dbt Cloud using one of the abovementioned packages. But if you need help building your Data Vault, get in touch.

<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>
![alt_text](images/image2.png "image_tooltip")

### Entity Relation Diagrams (ERDs) and dbt

There are a few open source packages to visualise the entities in your Data Vault built with dbt. I recommend checking out the [dbterd ](https://dbterd.datnguyen.de/1.2/index.html) which turns your [dbt relationship data quality checks](https://docs.getdbt.com/docs/build/tests#generic-tests) into an ER diagram.

## Summary

By leveraging the building blocks of Data Vault, organisations can build data warehouses that are adaptable to changing business requirements, promote data quality and integrity, and enable efficient data management and analytics. This in turn drives better decision-making, competitive advantage and business growth.

Choosing the right methodology for building your data warehouse is crucial for your system’s capabilities in the long run. If you are exploring Data Vault and want to learn more, Infinite Lambda can help you make the right call for your organisation.
