Every new account gets free {props.product} usage credits to start. What you get, and how you keep going, depends on your plan.

<SimpleTable>
| Plan | What you get | How it renews | When it runs out |
|---|---|---|---|
| Developer and Starter, or self-hosted dbt with a free dbt account | 30-day trial with $100 in usage credits per account | One-time | Add a credit card and set a monthly spend limit or contact your account team. |
| Enterprise, including [legacy Enterprise](/docs/platform/billing/plans-and-billing#legacy-plans) | $100/month in usage credits per account | Resets each billing month | {props.product} isn't paused. [Contact your account team](https://www.getdbt.com/contact) to add committed spend |
| Enterprise+ | $200/month in usage credits per account | Resets each billing month | {props.product} isn't paused. [Contact your account team](https://www.getdbt.com/contact) to add committed spend |
| [Legacy Team](/docs/platform/billing/plans-and-billing#legacy-plans) | No access to {props.product} | &mdash; | Move to a [Starter, Enterprise, or Enterprise+ plan](https://www.getdbt.com/pricing) |
</SimpleTable>

- On Developer and Starter plans, the trial is opt-in, so it won't start automatically. It ends when you use up the $100 in credits or after 30 days, whichever comes first, and unused credits don't carry over.
- Legacy Enterprise plans get the same {props.product} access and monthly usage credits as current Enterprise. Only legacy Team has no access.
- Enterprise and Enterprise+ usage credits are granted automatically &mdash; there's no trial to start and no credit card required. Credits don't roll over or get prorated, and if you downgrade out of Enterprise or Enterprise+, any unused credits are removed at the plan change.
- Enterprise and Enterprise+ accounts without a committed spend amount can keep using {props.product} past included usage credits without interruption &mdash; you'll be prompted to connect with your account rep about adding a spend amount. If you've set an optional monthly {props.product} spend limit, that still applies and pauses usage once reached.

:::info Running {props.product} from the CLI against a self-hosted dbt project?
Run `dbt login` (or `wizard login`) to get the same 30-day trial. The command creates your free dbt account and provisions the trial together, and that account is where you manage usage and spend limits. 
:::
