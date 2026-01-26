Use dbt <Constant name="copilot" /> to analyze your data and get contextualized results in real time by asking natural language questions to the [<Constant name="query_page" />](/docs/explore/dbt-insights) Analyst agent. To request access to the Analyst agent, [join the waitlist](https://www.getdbt.com/product/dbt-agents#dbt-Agents-signup).

Before you begin, make sure you can [access <Constant name="query_page" />](/docs/explore/access-dbt-insights).

1. Click the **<Constant name="copilot" />** icon in the Query console sidebar menu.
2. Click **Agent**.
3. In the dbt <Constant name="copilot" /> prompt box, enter your question.
4. Click **↑** to submit your question.

   The agent then translates natural language questions into structured queries, executes queries against governed dbt models and metrics, and returns results with references, assumptions, and possible next steps.

   The agent can loop through these steps multiple times if it hasn't reached a complete answer, allowing for complex, multi-step analysis.⁠

5. Confirm the results or continue asking the agent for more insights about your data. 

Your conversation with the agent remains even if you switch tabs within dbt <Constant name="query_page" />. However, they disappear when you navigate out of <Constant name="query_page" /> or when you close your browser.

<Lightbox src="/img/docs/dbt-insights/insights-copilot-agent.png" width="60%" title="Using the Analyst agent in Insights" />
