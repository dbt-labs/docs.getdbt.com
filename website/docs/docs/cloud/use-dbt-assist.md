--- 
title: "Use dbt Copilot" 
sidebar_label: "Use dbt Copilot" 
description: "Use dbt Copilot to generate documentation and tests from scratch, giving you the flexibility to modify or fix generated code." 
---

# Use dbt Copilot <Lifecycle status='beta'/> 

Use dbt Copilot to generate documentation and tests from scratch, giving you the flexibility to modify or fix generated code. To access and use the dbt Copilot experience:

1. Navigate to the dbt Cloud IDE and select a SQL model file under the **File Explorer**.

2. In the **Console** section (under the **File Editor**), select the **dbt Copilot** to view the available AI options.

3. Select the available options: **Documentation** or **Tests** to generate the YAML config.
   - To generate both for the same model, click each option separately. dbt Copilot intelligently saves the YAML config in the same file.

4. Verify the AI-generated code. You can update or fix the code as needed.

5. Click **Save** to save the code. You should see the file changes under the **Version control** section.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-assist-doc.gif" width="100%" title="Example of using dbt Copilot to automatically generate tests and documentation in the IDE" />
