---
title: "Connecting to dbt"
id: "connecting-to-dbt"
description: ""
---

To use dbt, you will need to connect dbt to a data warehouse/query engine/data platform. dbt works on top of your data warehouse to utilize its compute capabilities, compiling your data transformation queries for the data warehouse to execute. As such, you’ll need a data warehouse with source data loaded in it for dbt to transform. 

dbt uses **adapters** in order to connect to the data warehouse. These adapters allow users to make calls to the data warehouse and translates the dbt functionality to the given platform. All adapters are open source and free to use, just like dbt Core. 

To see what platforms are supported, check out [our available adapters](/docs/connecting-to-dbt/selecting-an-available-adapter). 

If you do not see an adapter for your data platform, check out [our guide for creating adapters](docs/connecting-to-dbt/building-a-new-adapter).

How you interact with the adapter will be dependent on whether you are using it on dbt Core or dbt Cloud.

## On dbt Core

All adapters are available on dbt Core and can be installed from PyPi using pip. The installation will include `dbt-core` and any other required dependencies, which may include other adapter plugins. This means once you have installed the adapter, you are ready to use dbt Core. Read more about [installing dbt Core](dbt-cli/install/overview).

## On dbt Cloud 

Just like you don't have to install dbt in dbt Cloud, there is no need to install adapters as well. Once you sign up for an account, you will be bought through the project configuration flow and asked to select a data warehouse to connect to and supply your credentials. Read more about [connecting databases in dbt Cloud here](website/docs/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database).

