---
title: How do I troubleshoot if cost data isn't appearing?
description: "Troubleshooting steps to resolve missing cost data in Cost Insights"
sidebar_label: 'Troubleshooting cost data'
id: troubleshooting-cost-data
---

If cost data isn't appearing in Cost Insights, check the following:

- Verify that platform metadata credentials are configured in your account settings and that the credential test is passing. For more information, see [Set up Cost Insights](/docs/explore/set-up-cost-insights#configure-platform-metadata-credentials).
- Ensure you have one of the required permissions to view cost data. For more information, see [Assign required permissions](/docs/explore/set-up-cost-insights#assign-required-permissions).
- Confirm that at least one job is running in a production environment. Cost data only appears after jobs have executed.
- Cost data refreshes daily and reflects the previous day's usage, which means there is a lag of up to one day between when a job runs and when its cost data appears. If you just ran a job, wait until the next day to see the data.
- After enabling Cost Insights, dbt looks back 10 days to build baselines for cost reduction calculations. If you don't see cost reduction data, ensure you have sufficient job history within the last 10 days.