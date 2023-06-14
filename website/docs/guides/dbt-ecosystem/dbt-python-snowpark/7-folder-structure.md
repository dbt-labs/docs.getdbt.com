---
title: "Folder structure" 
id: "7-folder-structure"
description: "Folder structure"
---
dbt Labs has developed a [project structure guide](/guides/best-practices/how-we-structure/1-guide-overview/) that contains a number of recommendations for how to build the folder structure for your project. Do check out that guide if you want to learn more. Right now we are going to create some folders to organize our files:

- Sources &mdash; This is our Formula 1 dataset and it will be defined in a source YAML file.
- Staging models &mdash; These models have a 1:1 with their source table.
- Intermediate &mdash; This is where we will be joining some Formula staging models.
- Marts models &mdash; Here is where we perform our major transformations. It contains these subfolders:
    - aggregates
    - core
    - ml
1. In your file tree, use your cursor and hover over the `models` subdirectory, click the three dots **…** that appear to the right of the folder name, then select **Create Folder**. We're going to add two new folders to the file path, `staging` and `formula1` (in that order) by typing `staging/formula1` into the file path.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure/1-create-folder.png" title="Create folder"/>
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure/2-file-path.png" title="Set file path"/>
    
    - If you click into your `models` directory now, you should see the new `staging` folder nested within `models` and the `formula1` folder nested within `staging`.
2. Create two additional folders the same as the last step. Within the `models` subdirectory, create new directories `marts/core`.

3. We will need to create a few more folders and subfolders using the UI. After you create all the necessary folders, your folder tree should look like this when it's all done:

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure/3-tree-of-new-folders.png" title="File tree of new folders"/>

Remember you can always reference the entire project in [GitHub](https://github.com/dbt-labs/python-snowpark-formula1/tree/python-formula1) to view the complete folder and file strucutre.  