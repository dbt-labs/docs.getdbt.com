---
title: "Studio IDE freezes when opening the Lineage tab"
description: "Workarounds for Studio IDE freezing or becoming unresponsive when the Lineage tab is active, especially with large models or multiple open model tabs."
sidebar_label: "Studio IDE freezes when opening the Lineage tab"
id: studio-ide-freezes-lineage-tab
---

If the <Constant name="studio_ide" /> freezes or becomes unresponsive when you have two or more models open and the **Lineage** tab is active, use the workarounds in this guide.

## Common reasons

The <Constant name="studio_ide" /> may freeze when:
- You have two or more models open, and
- The **Lineage** tab is open or loads automatically.

This is more likely when at least one model is large and the DAG takes longer to load.

## What you might observe

- The editor becomes unresponsive for a period of time.
- After a few minutes, your browser may display a **Wait** or **Exit** dialog.

## Workaround 1: Avoid the Lineage tab on startup

1. Refresh the page.
2. Keep the console focused on another tab (for example, **Results** or **Compiled code**) instead of **Lineage**.
3. Open **Lineage** only when needed, and consider closing extra model tabs first.

## Workaround 2: Clear Local Storage for your account URL

This workaround is browser-dependent. In DevTools, select the Local Storage origin that matches the URL in your browser address bar. For example, your account access URL might look like `https://ab123.us1.dbt.com`.

### Google Chrome

1. Open the <Constant name="dbt_platform" /> page that’s freezing.
2. Open DevTools (right-click the page and select **Inspect**).
3. Click the **Application** tab.
4. In the left sidebar, expand **Storage** → **Local Storage**.
5. Right-click the origin that matches your current URL (for example, `https://ab123.us1.dbt.com`) and select **Clear**.
6. Refresh the page and sign in again if prompted.

### Microsoft Edge

1. Open the <Constant name="dbt_platform" /> page that’s freezing.
2. Open DevTools (right-click the page and select **Inspect**).
3. Click the **Application** tab.
4. In the left sidebar, expand **Storage** → **Local Storage**.
5. Right-click the origin that matches your current URL (for example, `https://ab123.us1.dbt.com`) and select **Clear**.
6. Refresh the page and sign in again if prompted.

### Mozilla Firefox

1. Open the <Constant name="dbt_platform" /> page that’s freezing.
2. Open DevTools (right-click the page and select **Inspect**).
3. Open the **Storage** tab.
   - If you don’t see it, open DevTools **Settings** and enable **Storage**.
4. In the left sidebar, expand **Local Storage**.
5. Right-click the origin that matches your current URL (for example, `https://ab123.us1.dbt.com`) and select **Delete All**.
6. Refresh the page and sign in again if prompted.

### Safari

1. Open Safari and go to the <Constant name="dbt_platform" /> page that’s freezing.
2. If needed, enable developer features:
   - Go to **Safari** > **Settings**.
   - Click **Advanced**.
   - Enable developer features.
3. Open Web Inspector from **Develop** > **Show Web Inspector**.
4. Open the **Storage** tab.
5. In the left sidebar, expand **Local Storage** and select the origin that matches your current URL (for example, `https://ab123.us1.dbt.com`).
6. Delete the Local Storage entries for that origin.
7. Refresh the page and sign in again if prompted.

## If the issue persists

If you still see freezing after trying the workarounds:

- Capture a HAR file and share it with [dbt support](/docs/dbt-support):
  - Refer to [How to generate HAR files](/faqs/Troubleshooting/generate-har-file)
- Contact Support and include:
  - Your account URL
  - Browser + version
  - Approximate number of open model tabs
  - Whether the issue happens only when the **Lineage** tab is active