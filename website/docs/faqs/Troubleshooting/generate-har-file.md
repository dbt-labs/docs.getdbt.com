---
title: "How to generate HAR files"
description: "How to generate HAR files for debugging"
sidebar_label: 'Generate HAR files'
sidebar_position: 1
keywords:
  - HAR files
  - HTTP Archive
  - Troubleshooting
  - Debugging
---

HTTP Archive (HAR) files are used to gather data from users’ browser, which dbt Support uses to troubleshoot network or resource issues. This information includes detailed timing information about the requests made between the browser and the server. 

The following sections describe how to generate HAR files using common browsers such as [Google Chrome](#google-chrome), [Mozilla Firefox](#mozilla-firefox), [Apple Safari](#apple-safari), and [Microsoft Edge](#microsoft-edge).

:::info
Remove or hide any confidential or personally identifying information before you send the HAR file to dbt Labs. You can edit the file using a text editor. 
:::

### Google Chrome

1. Open Google Chrome.
2. Click on **View** --> **Developer Tools**.
3. Select the **Network** tab.
4. Ensure that Google Chrome is recording. A red button (🔴) indicates that a recording is already in progress. Otherwise, click **Record network log**.
5. Select **Preserve Log**.
6. Clear any existing logs by clicking **Clear network log** (🚫).
7. Go to the page where the issue occurred and reproduce the issue.
8. Click **Export HAR** (the down arrow icon) to export the file as HAR. The icon is located on the same row as the **Clear network log** button.
9. Save the HAR file.
10. Upload the HAR file to the dbt Support ticket thread.

### Mozilla Firefox

1. Open Firefox.
2. Click the application menu and then **More tools** --> **Web Developer Tools**.
3. In the developer tools docked tab, select **Network**.
4. Go to the page where the issue occurred and reproduce the issue. The page automatically starts recording as you navigate.
5. When you're finished, click **Pause/Resume recording network log**.
6. Right-click anywhere in the **File** column and select **Save All as HAR**.
7. Save the HAR file.
8. Upload the HAR file to the dbt Support ticket thread.

### Apple Safari

1. Open Safari.
2. In case the **Develop** menu doesn't appear in the menu bar, go to **Safari** and then **Settings**.
3. Click **Advanced**.
4. Select the **Show features for web developers** checkbox.
5. From the **Develop** menu, select **Show Web Inspector**.
6. Click the **Network tab**.
7. Go to the page where the issue occurred and reproduce the issue.
8. When you're finished, click **Export**.
9. Save the file.
10. Upload the HAR file to the dbt Support ticket thread.

### Microsoft Edge

1. Open Microsoft Edge.
2. Click the **Settings and more** menu (...) to the right of the toolbar and then select **More tools** --> **Developer tools**.
3. Click **Network**.
4. Ensure that Microsoft Edge is recording. A red button (🔴) indicates that a recording is already in progress. Otherwise, click **Record network log**.
5. Go to the page where the issue occurred and reproduce the issue.
6. When you're finished, click **Stop recording network log**.
7. Click **Export HAR** (the down arrow icon) or press **Ctrl + S** to export the file as HAR.
8. Save the HAR file.
9. Upload the HAR file to the dbt Support ticket thread.

### Additional resources
Check out the [How to generate a HAR file in Chrome](https://www.loom.com/share/cabdb7be338243f188eb619b4d1d79ca) video for a visual guide on how to generate HAR files in Chrome.
