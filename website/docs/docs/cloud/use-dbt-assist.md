--- 
title: "Use dbt Assist" 
sidebar_label: "Use dbt Assist" 
description: "Use dbt Assist to generate documentation and tests from scratch, giving you the flexibility to modify or fix generated code." 
---

# Use dbt Assist <Lifecycle status='beta'/> 

Use dbt Assist to generate documentation and tests from scratch, giving you the flexibility to modify or fix generated code. To access and use dbt Assist:

1. Navigate to the dbt Cloud IDE and select a SQL model file under the **File Explorer**.

2. In the **Console** section (under the **File Editor**), select the **dbt Assist** to view the available AI options.

3. Select the available options: **Documentation** or **Tests** to generate the YAML config.
   - To generate both for the same model, click each option separately. dbt Assist intelligently saves the YAML config in the same file.

4. Verify the AI-generated code. You can update or fix the code as needed.

5. Click **Save** to save the code. You should see the file changes under the **Version control** section.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-assist-doc.gif" width="100%" title="Use dbt Assist, a powerful AI feature, to automatically generate tests and documentation in the dbt Cloud IDE." />
