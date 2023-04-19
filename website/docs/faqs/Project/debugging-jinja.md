---
title: How do I debug my Jinja?
description: "Using target folder or log function to debug Jinja"
sidebar_label: 'Debugging Jinja'
id: debugging-jinja

---

You should get familiar with checking the compiled SQL in `target/compiled/<your_project>/` and the logs in `logs/dbt.log` to see what dbt is running behind the scenes.

You can also use the [log](/reference/dbt-jinja-functions/log) function to debug Jinja by printing objects to the command line. 
