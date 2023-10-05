---
title: "Tableau (beta)"
description: "Use Tableau worksheets to query the dbt Semantic Layer and produce dashboards with trusted date."
tags: [Semantic Layer]
sidebar_label: "Tableau (beta)"
---

The Tableau integration is a live connection into the dbt Semantic Layer using Tableau Desktop. It allows you to use worksheets to query the Semantic Layer directly and produce your dashboards with trusted data.

## Prerequisites

1. Tableau Desktop Installed and either an account with Tableau Server or Tableau Cloud that you can authenticate with
2. A JDBC URL, or a dbt Cloud environment Id and a Service Token to authenticate with from a dbt Cloud account that has the Semantic Layer configured.


## Installing

1. Install this file () locally
2. Install this jdbc driver (same exact link we have in jdbc docs) to the folder based on your operating system
			`Windows: C:\Program Files\Tableau\Drivers`
			`Mac: ~/Library/Tableau/Drivers`
			`Linux: /opt/tableau/tableau_driver/jdbc`
3. Open Tableau Desktop and find in the lefthand side the "dbt Semantic Layer by dbt Labs" 
4. Connect with your JDBC connection information that's provided to you in your dbt Cloud Semantic Layer configuration


## Using the integration

Once you authenticate, navigate to the left hand side and choose the database "DBT_SEMANTIC_LAYER" to see a data source with all the metrics and dimensions configured in your Semantic Layer. 

From there, you can go directly to a worksheet in the bottom left hand corner, and you'll find all the metrics and dimensions that are available to query on the left hand side of your window.

You can visit the Tableau documentation (link out) to learn more about how to use Tableau worksheets and dashboards.

## Things to note

1. You will notice that the aggregation type for all of your metrics is "SUM" and it cannot be changed. The dbt Semantic Layer controls aggregation type and it is deliberately immutable. Note that the underlying aggregation in the dbt Semantic Layer may not be "SUM". 
2. We surface all metrics and dimensions from the dbt Semantic Layer in the left hand side, but it should be noted that not all of them can be combined with one another. You will recieve an error message if a particular dimension cannot be sliced with a metric (or vice versa)
3. Certain Table calculations like "Totals" and "Percent Of" may not be accurate when using metrics aggregated in a non-additive way (e.g., count distinct)

## Unsupported functionality

Note that we may support this functionality in a future release

1. Updating the data source page
2. Using Extract Mode
3. Unioning Tables
4. Writing Custom SQL
5. Table Extensions
6. Cross Database Joins
7. All functions in Analysis --> Create Calculated Field
8. Filters on Metric values
