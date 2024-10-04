--- 
title: "Use dbt Assist" 
sidebar_label: "Use dbt Assist" 
description: "Use dbt Assist to generate documentation, semantic models, and tests from scratch, giving you the flexibility to modify or fix generated code." 
---

# Use dbt Assist <Lifecycle status='beta'/> 

Use dbt Assist to generate documentation, semantic models, and tests from scratch, giving you the flexibility to modify or fix generated code. 

To access and use dbt Assist:

1. Navigate to the dbt Cloud IDE and select a SQL model file under the **File Explorer**.
2. In the **Console** section (under the **File Editor**), select the **dbt Assist** to view the available AI options.
3. Select the available options to generate the YAML config: **Generate Documentation**, **Generate Tests**, or **Generate Semantic Model**.
   - To generate multiple YAML configs for the same model, click each option separately. dbt Assist intelligently saves the YAML config in the same file.
4. Verify the AI-generated code. Update or fix the code if needed.
5. Click **Save** to save the code. You should see the file changes under the **Version control** section.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-assist.gif" width="100%" title="Use dbt Assist, a powerful AI feature, to automatically generate documentation, semantic models, and tests in the dbt Cloud IDE." />
