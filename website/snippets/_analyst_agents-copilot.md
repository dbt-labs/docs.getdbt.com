Use dbt <Constant name="copilot" /> to analyze your data and get contextualized results in real time by asking natural language questions to the [<Constant name="query_page" />](/docs/explore/dbt-insights) Analyst agent. 

1. Click the **<Constant name="copilot" />** icon in the Query console sidebar menu.
2. In the dropdown menu above the <Constant name="copilot" /> prompt box, select **Agent**.
3. In the dbt <Constant name="copilot" /> prompt box, enter your question.
4. Click **↑** to submit your question.

   The agent then translates natural language questions into structured queries, executes queries against governed dbt models and metrics, and returns results with references, assumptions, and possible next steps.

   The agent can loop through these steps multiple times if it hasn't reached a complete answer, allowing for complex, multi-step analysis.⁠

   dbt <Constant name="query_page" /> automatically executes the SQL query suggested by the Analyst agent, and you can preview the SQL results in the **Data** tab.

5. Confirm the results or continue asking the agent for more insights about your data. 

Your conversation with the agent remains even if you switch tabs within dbt <Constant name="query_page" />. However, they disappear when you navigate out of <Constant name="query_page" /> or when you close your browser.

<Lightbox src="/img/docs/dbt-insights/insights-copilot-agent.png" width="90%" title="Using the Analyst agent in Insights" />
