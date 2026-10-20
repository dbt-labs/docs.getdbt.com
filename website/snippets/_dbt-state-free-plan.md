Every account gets a monthly allowance of free daily active target tables (DATT). Usage within your allowance doesn’t appear on your invoice.

When your trial ends, you move to your plan's monthly allowance:

- Self-hosted dbt users move to the free plan, which includes 1,000 DATT each month indefinitely.
- Developer plan users also get 1,000 DATT each month indefinitely.
- Paid dbt platform plans get a temporary monthly allowance. Check out [paid plans with a temporary allowance](#paid-plans-with-a-temporary-allowance) for more details.

The allowance works the same way on every plan:

- It resets on the 1st of each month.
- Unused DATT don't carry over.
- Your first month gets the full allowance for your plan. Usage during your trial doesn't count against it.


#### Plans with a permanent allowance

<SimpleTable>

| Plan | Monthly allowance | When you reach the limit |
|------|-------------------|--------------------------|
| Self-hosted dbt (free plan) | 1,000 DATT | dbt State stops reusing nodes until the next reset. [Set up usage-based billing](#setting-up-usage-based-billing) to resume. |
| Developer | 1,000 DATT | dbt State stops reusing nodes until the next reset. [Set up usage-based billing](#setting-up-usage-based-billing) to resume, which moves your account to the Developer (Usage) plan. |

</SimpleTable>

#### Paid plans with a temporary allowance

Paid <Constant name="dbt_platform"/> plans also get a monthly allowance for a limited time.

<SimpleTable>

| Plan | Monthly allowance | Available until | When you reach the limit |
|------|-------------------|-----------------|--------------------------|
| Starter | 1,000 DATT | March 31, 2027 | **Card on file:** dbt State keeps running and bills your card for usage past the limit. <br />**No card on file:** dbt State stops reusing nodes until the next reset. |
| Enterprise, Enterprise+, legacy Enterprise | 2,000 DATT | March 31, 2027 | **Prepaid State contract:** dbt State keeps running and draws from your contract. <br />**No prepaid contract:** dbt State stops reusing nodes until the next reset. |
| Legacy Teams | 1,000 DATT | December 31, 2026 | dbt State stops reusing nodes until the next reset. To continue past the limit, migrate to Starter. |

</SimpleTable>

:::tip
On Starter, you can pause dbt State at the limit by turning off card billing for State on the **Usage-based features** page.
:::

If you cancel paid access, dbt State keeps running on your plan's monthly allowance.

### Viewing your allowance

Go to **Account settings** > **Billing & Usage** > **Usage-based features** > **State** tab to see your current consumption, remaining allowance, and reset date.

dbt sends an email to your admin when you've used up 80% of your DATT allowance, and again if dbt State pauses at the limit.
