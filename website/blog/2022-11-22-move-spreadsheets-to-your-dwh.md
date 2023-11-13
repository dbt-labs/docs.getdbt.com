---
title: "How to move data from spreadsheets into your data warehouse"
description: "A thankless, humble, and inevitable task: getting spreadsheet data into your data warehouse. Let's look at some of the different options, and the pros and cons of each."
slug: moving-spreadsheet-data

authors: [joel_labes]

tags: [analytics craft]
hide_table_of_contents: false

date: 2022-11-23
is_featured: true
---

Once your <Term id="data-warehouse"/> is built out, the vast majority of your data will have come from other SaaS tools, internal databases, or customer data platforms (CDPs). But there’s another unsung hero of the analytics engineering toolkit: the humble spreadsheet.

Spreadsheets are the Swiss army knife of data processing. They can add extra context to otherwise inscrutable application identifiers, be the only source of truth for bespoke processes from other divisions of the business, or act as the translation layer between two otherwise incompatible tools.

Because of spreadsheets’ importance as the glue between many business processes, there are different tools to load them into your data warehouse and each one has its own pros and cons, depending on your specific use case.

<!--truncate-->

In general, there are a few questions to ask yourself about your data before choosing one of these tools:

- Who at your company will be loading the data?
- Does it have a consistent format?
- How frequently will it change?
- How big is the dataset?
- Do changes need to be tracked?
- Where are the files coming from?

Let’s have a look at some of the offerings to help you get your spreadsheets into your data warehouse.

## dbt seeds

dbt comes with an inbuilt csv loader ([seeds](https://docs.getdbt.com/docs/build/seeds)) to populate your data warehouse with any files you put inside of your project’s `seeds` folder. It will automatically infer data types from your file’s contents, but you can always override it by [providing explicit instructions in your dbt_project.yml](https://docs.getdbt.com/reference/resource-configs/column_types) file.

However, since dbt creates these tables by inserting rows one at a time, it doesn’t perform well at scale (there’s no hard limit but aim for hundreds of rows rather than thousands). [The dbt docs](https://docs.getdbt.com/docs/build/seeds#faqs) suggest using seeds for “files that contain business-specific logic, for example, a list of country codes or user IDs of employees.”

A big benefit of using seeds is that your file will be checked into source control, allowing you to easily see when the file was updated and retrieve deleted data if necessary.

#### Good fit for:

- Small files such as mapping employee identifiers to employees
- Infrequently modified files such as mapping country codes to country names
- Data that would benefit from source control
- Programmatic control of data types

#### Not a good fit for:

- Files greater than 1MB in size
- Files that need regular updates

## ETL tools

An obvious choice if you have data to load into your warehouse would be your existing [ETL tool](https://www.getdbt.com/analytics-engineering/etl-tools-a-love-letter/) such as Fivetran or Stitch, which I'll dive into in this section. Below is a summary table highlighting the core benefits and drawbacks of certain <Term id="etl" /> tooling options for getting spreadsheet data in your data warehouse.

### Summary table

| Option/connector | Data updatable after load |  Configurable data types | Multiple tables per schema | Good for large datasets |
| --- | --- | --- | --- | --- |
| dbt seeds | ✅ | ✅ | ✅ | ❌ |
| Fivetran Browser Upload | ✅ | ✅ | ✅ | ✅ |
| Fivetran Google Sheets connector | ✅ | ❌ | ❌ | ✅ |
| Fivetran Google Drive connector | ❌ | ❌ | ✅ | ✅ |
| Stitch Google Sheets integration | ✅ | ❌ | ❌ | ✅ |
| Airbyte Google Sheets connector | ✅ | ❌ | ❌ | ✅ |

### Fivetran browser upload

[Fivetran’s browser uploader](https://fivetran.com/docs/files/browser-upload) does exactly what it says on the tin: you upload a file to their web portal and it creates a table containing that data in a predefined schema in your warehouse. With a visual interface to modify data types, it’s easy for anyone to use. And with an account type with the permission to only upload files, you don’t need to worry about your stakeholders accidentally breaking anything either.

<Lightbox src="/img/blog/2022-11-22-move-spreadsheets-to-your-dwh/fivetran-uploader-1.png" title="Converting data types from text to dates and numbers is easy in the visual editor" />

<Lightbox src="/img/blog/2022-11-22-move-spreadsheets-to-your-dwh/fivetran-uploader-2.png" title="Picking the matching date format from a list of options to convert them to a standardized format" />

A nice benefit of the uploader is support for updating data in the table over time. If a file with the same name and same columns is uploaded, any new records will be added, and existing records (per the <Term id="primary-key"/>) will be updated.

However, keep in mind that there is no source control on these changes or a to revert them; you might want to consider [snapshotting changes](https://docs.getdbt.com/docs/building-a-dbt-project/snapshots) in dbt if that’s a concern.

Also, Fivetran won’t delete records once they’re created, so the only way to remove records created using this process is by manually [deleting](https://docs.getdbt.com/terms/dml#delete) them from your warehouse. If you have an ad-hoc connector, consider having an automated process to drop these tables regularly, especially if you have PII management concerns.

#### Good fit for:

- Files that are frequently updated by someone
- Allowing anyone in the company to upload files
- Ad-hoc data loads
- Updating a table instead of creating a new one
- Basic data type changes (including handling currency columns)
- Larger files

#### Not a good fit for:

- Tracking changes to data
- Complex type mappings

### Fivetran Google Sheets connector

The main benefit of connecting to Google Sheets instead of a static spreadsheet should be obvious—teammates can change the sheet from anywhere and new records will be loaded into your warehouse automatically. [Fivetran’s Google Sheets connector](https://fivetran.com/docs/files/google-sheets) requires some additional initial configuration, but collaborative editing can make the effort worthwhile.

Instead of syncing all cells in a sheet, you create a [named range](https://fivetran.com/docs/files/google-sheets/google-sheets-setup-guide) and connect Fivetran to that range. Each Fivetran connector can only read a single range—if you have multiple tabs then you’ll need to create multiple connectors, each with its own schema and table in the target warehouse. When a sync takes place, it will [truncate](https://docs.getdbt.com/terms/ddl#truncate) and reload the table from scratch as there is no primary key to use for matching.

<Lightbox src="/img/blog/2022-11-22-move-spreadsheets-to-your-dwh/google-sheets-uploader.png" title="Creating a named range in Google Sheets to sync via the Fivetran Google Sheets Connector" />

Beware of inconsistent data types though—if someone types text into a column that was originally numeric, Fivetran will automatically convert the column to a string type which might cause issues in your downstream transformations. [The recommended workaround](https://fivetran.com/docs/files/google-sheets#typetransformationsandmapping) is to explicitly cast your types in [staging models](https://docs.getdbt.com/best-practices/how-we-structure/2-staging) to ensure that any undesirable records are converted to null.

#### Good fit for:

- Large, long-lived documents
- Files that are updated by many people (and somewhat often)

#### Not a good fit for:

- Ad-hoc loads—you need to create an entire schema for every connected spreadsheet, and preparing the sheet is a fiddly process
- Tracking changes to data
- Documents with many tabs

### Fivetran Google Drive connector

I’m a big fan of [Fivetran’s Google Drive connector](https://fivetran.com/docs/files/google-drive); in the past I’ve used it to streamline a lot of weekly reporting. It allows stakeholders to use a tool they’re already familiar with (Google Drive) instead of dealing with another set of credentials. Every file uploaded into a specific folder on Drive (or [Box, or consumer Dropbox](https://fivetran.com/docs/files/magic-folder)) turns into a table in your warehouse.

<Lightbox src="/img/blog/2022-11-22-move-spreadsheets-to-your-dwh/google-drive-uploader.png" title="Fivetran will add each of these csv files to a single schema in your warehouse, making it ideal for regular uploads" />

Like the Google Sheets connector, the data types of the columns are determined automatically. Dates, in particular, are finicky though—if you can control your input data, try to get it into [ISO 8601 format](https://xkcd.com/1179/) to minimize the amount of cleanup you have to do on the other side.

I used two macros in the dbt_utils package ([get_relations_by_pattern](https://github.com/dbt-labs/dbt-utils#get_relations_by_pattern-source) and [union_relations](https://github.com/dbt-labs/dbt-utils#union_relations-source)) to combine weekly exports from other tools into a single [model](/docs/build/models) for easy cleanup in a staging model. Make sure you grant your transformer account permission to access all tables in the schema (including future ones) to avoid having to manually intervene after every new file is uploaded.

#### Good fit for:

- Allowing anyone in the company to upload files
- Weekly exports from another tool
- Large files
- Many files (each will be created as another table in a single schema, unlike the Google Sheets integration)

#### Not a good fit for:

- Data that needs to be updated after load
- Custom type mappings (without further processing in dbt)

### Stitch Google Sheets integration

[The Google Sheets integration by Stitch](https://www.stitchdata.com/docs/integrations/saas/google-sheets) is a little more straightforward to set up than Fivetran’s as it imports the entire sheet without requiring you to configure named ranges. Beyond that, it works in the same way with the same benefits and the same drawbacks.

#### Good fit for:

- Large, long-lived documents
- Files that are updated by many people

#### Not a good fit for:

- Ad-hoc loads—you need to create an entire schema for every connected spreadsheet
- Tracking changes to data
- Documents with many tabs

### Airbyte Google Sheets connector

Airbyte, an open source and cloud ETL tool, [supports a Google Sheets source connector](https://airbytehq.github.io/integrations/sources/google-sheets/) very similar to Stitch’s and Fivetran’s integration. You’ll need to authenticate your Google Account using an OAuth or a service account key and provide the link of the Google Sheet you want to pull into your data warehouse. Note that all sheet columns are loaded as strings, so you will need to explicitly cast them in a downstream model. Airbyte’s connector here also supports both full refreshes and appends.

#### Good fit for:

- Large, long-lived documents
- Files that are updated by many people
- Teams that may be on a budget

#### Not a good fit for:

- Non-string type data you want preserved in your raw source tables in your data warehouse

## Native warehouse integrations

Each of the major data warehouses also has native integrations to import spreadsheet data. While the fundamentals are the same, there are some differences amongst the various warehousing vendors.

### Snowflake

Snowflake’s options are robust and user-friendly, offering both a [web-based loader](https://docs.snowflake.com/en/user-guide/data-load-web-ui.html) as well as [a bulk importer](https://docs.snowflake.com/en/user-guide/data-load-bulk.html). The web loader is suitable for small to medium files (up to 50MB) and can be used for specific files, all files in a folder, or files in a folder that match a given pattern. It’s also the most provider-agnostic, with support for Amazon S3, Google Cloud Storage, Azure and the local file system.

<Lightbox src="/img/blog/2022-11-22-move-spreadsheets-to-your-dwh/snowflake-uploader.png" title="Snowflake’s web-based Load Data Wizard via the Snowflake Blog https://www.snowflake.com/blog/tech-tip-getting-data-snowflake/" />

### BigQuery

BigQuery only supports importing data from external sources hosted by Google such as Google Drive and Google Cloud Storage (as BigQuery and Sheets are both Google products, BigQuery is the only platform on this list that has a native integration that doesn't require 3rd-party tooling). The data it references isn’t copied into BigQuery but can be referenced in queries as though it was. If needed, you can write a copy to BigQuery or just leave it as an external source. The team at supercooldata has written [a great how-to guide on setting up Google Sheets with BigQuery](https://blog.supercooldata.com/working-with-sheets-in-bigquery/).

### Redshift

Unsurprisingly for an AWS product, Redshift prefers to [import CSV files from S3](https://docs.aws.amazon.com/redshift/latest/dg/tutorial-loading-data.html). As with Snowflake, this is achieved with the COPY command, and you can easily control which file(s) are imported from the source bucket. Using S3 as a source compared to a web-based loader or Google Drive means this option isn’t as user-friendly for non-technical folks, but is still a great option to sync files that are automatically generated from other tools.

### Databricks

Databricks also supports [pulling in data, such as spreadsheets, from external cloud sources](https://docs.databricks.com/external-data/index.html) like Amazon S3 and Google Cloud Storage. In addition, the ability to [load data via a simple UI](https://docs.databricks.com/ingestion/add-data/index.html) within Databricks is currently in public preview.

## Conclusion

Beyond the options we’ve already covered, there’s an entire world of other tools that can load data from your spreadsheets into your data warehouse. This is a living document, so if your preferred method isn't listed then please [open a PR](https://github.com/dbt-labs/docs.getdbt.com) and I'll check it out.

The most important things to consider are your files’ origins and formats—if you need your colleagues to upload files on a regular basis then try to provide them with a more user-friendly process; but if you just need two computers to talk to each other, or it’s a one-off file that will hardly ever change, then a more technical integration is totally appropriate.
