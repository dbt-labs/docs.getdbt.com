
1. Open <Constant name="wizard" /> and set the mode picker (bottom-left) to **Explore only** if needed.
2. Type your question and press **Enter**. Make sure you're specific and include the time period, grouping, and filter you care about:
    - `what was total revenue in Q2 2026, by month?`
    - `how many new customers signed up in July?`
    - `which regions grew fastest this year?`
3. <Constant name="wizard" /> gives a plain-language summary of what it did, then the result. Switch between **Chart**, **Table**, and **SQL** to see the data your way.
4. Validate the data by using the **SQL** view to review the query or governed metric behind the answer. Note that you can't edit the SQL query but you can copy it.
5. Keep going by asking a follow-up in the same conversation. For example, `now break that out by region` works after your first question.

Explore mode uses dbt-<Term id="managed" /> <Term id="inference"/>, so questions draw from your account's <Constant name="wizard" /> [consumption pool](/docs/dbt-ai/wizard-billing-faqs) like any other <Constant name="wizard" /> usage. 

