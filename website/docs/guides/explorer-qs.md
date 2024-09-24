---
title: "Quickstart for the dbt Explorer Workshop"
id: ex-qs
description: "Use this guide to build and define metrics, set up the dbt Cloud Semantic Layer, and query them using Google Sheets."
sidebar_label: "Quickstart dbt Explorer"
icon: 'guides'
hide_table_of_contents: true
tags: ['Explorer', 'Snowflake', 'dbt Cloud','Quickstart']
keywords: ['dbt Semantic Layer','Metrics','dbt Cloud', 'Snowflake', 'Google Sheets']
level: 'Beginner'
recently_updated: true
---

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) -->
import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';
import SlSetUp from '/snippets/_new-sl-setup.md'; 

## Introduction
Unlock the power of [dbt Explorer](/docs/collaborate/explore-projects) in this hands-on workshop designed for analytics engineers, data analysts, stakeholders, and data leaders! Dive into a production-level dbt Mesh implementation and discover how to explore your data workflows.⁠ Whether you're looking to streamline your data operations, improve data quality, or self-serve information about your data platform, this workshop will equip you with the tools and knowledge to take your dbt projects to the next level.

**You’ll learn how to:**
- Navigate multiple dbt projects using dbt Explorer
- Self-serve on data documentation
- Trace dependencies at the model and column level
- Identify opportunities to improve performance and data quality

**Prerequisites:**
- Familiarity with data platforms

