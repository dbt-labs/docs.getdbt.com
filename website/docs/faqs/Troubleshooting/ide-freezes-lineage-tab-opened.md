---
title: "Studio IDE freezes when opening the Lineage tab"
description: "Workarounds for Studio IDE freezing or becoming unresponsive when the Lineage tab is active, especially with large models or multiple open model tabs."
sidebar_label: "Studio IDE freezes when opening the Lineage tab"
id: studio-ide-freezes-lineage-tab
---

If the <Constant name="studio_ide" /> freezes with two or more models open and the **Lineage** tab active, use the following workarounds.

### Why this happens

The <Constant name="studio_ide" /> can freeze when the **Lineage** tab is open or loads automatically, and when two or more models are open, especially if a model has a large or slow-loading <Term id="dag" />.

## What you might observe

- The editor becomes unresponsive.
- After a few minutes, your browser may display a **Wait** or **Exit** dialog.

## Workaround 1: Avoid the Lineage tab on startup

1. Refresh the page.
2. Keep the console focused on another tab (for example, **Results** or **Compiled code**) instead of **Lineage**.
3. Close extra model tabs before opening **Lineage**.
4. Open **Lineage** only when needed.

## Workaround 2: Clear Local Storage for your account URL

This workaround is browser-dependent. In DevTools, select the Local Storage origin that matches the URL in your browser address bar. For example, your account access URL might look like `https://ab123.us1.dbt.com`.

### Google Chrome and Microsoft Edge

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

## Need more help?

If freezing continues after trying these workarounds, [contact dbt Support](mailto:support@getdbt.com) and include:
- A HAR file (refer to [How to generate HAR files](/faqs/Troubleshooting/generate-har-file))
- Your account URL
- Browser and version
- Approximate number of open model tabs
- Whether the issue happens only when the **Lineage** tab is active