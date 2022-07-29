---
title: Use the dbt Cloud IDE
id: use-cloud-ide
---

Developing in the IDE means you can compile dbt code into SQL and execute it against your database directly. The IDE leverages the open-source [dbt-rpc](reference/commands/rpc) to intelligently recompile only the parts of your project that have changed. This brings the cycle time for dbt project development down from minutes to seconds.

In dbt, SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures (e.g. `if`
 statements and `for` loops) in your queries. It also enables repeated SQL to be shared through `macros`.

You can invoke dbt commands, compile jinja into query, preview data from warehouse, visualize a directed acyclic graph (DAG) and more!

**Hot and Cold Start**

difference between cold start and hot start: 

1) first time you start IDE will be slower and 

2) we turn off session after 3 hours of idle on dbt-rpc

**Save your work**

The dbt Cloud IDE needs an explicit action to save your changes. There are three ways your work is stored:

1. **Unsaved, local code:** Any code you write will automatically be available in your browser storage. 
    
    So that means if you refresh the IDE → exit and come back → restart the development pod:
    - You should be able to see your work.
    - If you switch a branch, you will lose this work (with a warning).
    - If you switch a browser (other laptop or other browser), you will lose this work.
    
2. **Saved but uncommitted code:** This is treated like a local branch and when you save a file, the data gets stored in your "local" storage (EFS storage). Once you have saved code in the dbt Cloud IDE, you cannot switch to another branch:
    - If you switch a branch, you will lose this work (with a warning).
   
3. **Committed code:** This is stored in the branch with git provider:
    - You should be able to check out other (remote) branches without losing work

**Run Projects**

In addition to compiling and executing SQL, you can also *run* *and test* dbt projects directly in the dbt IDE using our ‘Build’ feature. You can use dbt's [rich model selection syntax](reference/node-selection/syntax) to [run dbt commands](reference/dbt-commands) directly in your browser, bringing convenience and control right to your fingertips. 

The IDE updates in real-time as models, tests, seeds, and operations are run. If a model or tests fails, you can dig into the logs to find and fix the issue.

<p align=“center”>
<Lightbox src=“/img/docs/dbt-cloud/cloud-ide/build.png” title="Building in the dbt Cloud IDE"/>
</p>

**Lineage Tab**

When you develop in the IDE, the lineage tab visual adds more context to dependencies and directional flow. You get insight into how models are used as building blocks from left to right to transform your data from crude or normalized raw sources, into cleaned-up modular derived pieces, and finally into the final outputs on the far right of the DAG, ready to be used by the analyst in infinite combinations to present it in ways to help clients, customers, and organizations make better decisions.

<p align=“center”>
<Lightbox src=“/img/docs/dbt-cloud/cloud-ide/lineage.png” title="Lineage in the dbt Cloud IDE"/>
</p>

**Command bar + Status** 

To type in commands and execute your code, you can use the command bar at the bottom of the IDE. Use dbt's [rich model selection syntax](reference/node-selection/syntax) to [run dbt commands](reference/dbt-commands) directly in your browser, bringing convenience and control right to your fingertips.  You can give it a try in your project and type `dbt run`, click **Enter.**

You can also view the history, status, and logs of previous runs by clicking the ‘History’ button to expand your options.

The status icon on the bottom-right side of the IDE gives you an indicator of the health of your project. You can instantly identify any errors by clicking on the status icon to open up more details or Restart the IDE.

**Generating and Viewing documentation** 

To generate documentation (docs) in the IDE, type `docs generate` in the Command Bar in the IDE. This command will generate the docs for your dbt project as it exists in development in your IDE session. 

:::info 📌 Note -  Don’t worry about typing `dbt` at the start of your command. The IDE will automatically include the prefix ‘`dbt`’, allowing you to only type in the necessary command.
:::

Once you generate a successful run,  the dbt Cloud IDE makes it possible to view [documentation](docs/building-a-dbt-project/documentation) for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

In the IDE, you can click the "View Docs" button on top of the File Explorer to see the latest version of your documentation rendered in a new browser window.

<p align=“center”>
<Lightbox src=“/img/docs/dbt-cloud/cloud-ide/view-docs.png” title="View Documentation in the dbt Cloud IDE"/>
</p>

