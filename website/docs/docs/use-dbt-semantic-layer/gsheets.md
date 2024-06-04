---
title: "Google Sheets"
description: "Integrate with Google Sheets to query your metrics in a spreadsheet."
tags: [Semantic Layer]
sidebar_label: "Google Sheets"
---

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Google Sheets"
/>

## Using saved queries
Access [saved queries](/docs/build/saved-queries), powered by MetricFlow, in {props.type} to quickly get results from pre-defined sets of data. To access the saved queries in Google Sheets:

1. Open the hamburger menu in Google Sheets.
2. Navigate to **Saved Queries** to access the ones available to you. 
3. You can also select **Build Selection**, which allows you to explore the existing query. This won't change the original query defined in the code.
   - If you use a `WHERE` filter in a saved query, Google Sheets displays the advanced syntax for this filter.

**Limited use policy disclosure**

The dbt Semantic Layer for Sheet's use and transfer to any other app of information received from Google APIs will adhere to [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
