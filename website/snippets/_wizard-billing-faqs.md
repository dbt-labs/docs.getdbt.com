### Wizard usage overview

<Expandable alt_header="How is Wizard usage measured and priced?">

Wizard usage with the dbt-<Term id="managed"/> inference will be measured per token. Every token is processed as input or output counts. Each model has its own unique per-token pricing.

Cost will depend on the model used, prompt length and complexity, and response size.

Refer to [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table) for the currently available models.

</Expandable>

<Expandable alt_header="What is the dbt Wizard usage consumption pool?">

The <Constant name="wizard"/> consumption pool is the usage balance available when using dbt-<Term id="managed"/> inference for <Constant name="wizard"/> &mdash; this includes Developer and Starter plan trial Wizard usage credits and the monthly Enterprise/Enterprise+ included usage credits.

As you use <Constant name="wizard" />, your token usage will automatically convert into a dollar amount and deducted from your active usage credit. Once your usage credit is depleted, additional usage must draw from a newly purchased consumption pool, if one exists. If your pool is depleted, use of Wizard will be disabled until it is refreshed.

</Expandable>

<Expandable alt_header="Is the Wizard consumption pool shared between dbt Wizard in the dbt platform and Wizard CLI?">

Yes. The consumption pool and usage credits will be shared across all users within an account and across Wizard in <Constant name="dbt_platform" /> and local Wizard CLI. Usage from either surface draws from the same account-level consumption pool.

</Expandable>

<Expandable alt_header="Which AI models are available for use through dbt managed inference?">

Refer to the [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table) for the models available as of September 1, 2026. dbt Labs bills usage of these models through your <Constant name="dbt" /> account.

</Expandable>

### Developer and Starter plan (self-serve free trial)

<Expandable alt_header="What does the dbt Wizard Developer and Starter plan free trial include?">

Developer and Starter plans get a $100/account usage credit for dbt-<Term id="managed"/> Wizard inference, free for 30 days. The credit covers Wizard usage across both the <Constant name="dbt_platform"/> and the CLI, and the trial ends when you hit $100 in usage or 30 days, whichever comes first.

On Starter, the $100 is per account, not per user. Everyone on the account shares the same credits. Since the Developer plan is a single-user plan, the pool covers that one user.

The trial credits can only be spent on <Constant name="wizard" />, not on dbt State or other consumption-based features.

</Expandable>

<Expandable alt_header="Who is eligible to start a dbt Wizard 30-day free trial?">

Developer or Starter plan accounts are eligible for the 30-day, $100/account free trial. Trials require a business email address, so personal email domains such as Gmail aren't eligible. An account admin or billing admin must start the trial.

</Expandable>

<Expandable alt_header="Do unused trial consumption pools roll over or expire?">

Unused trial usage credits don't roll over. Your trial ends when you deplete the entire $100 usage credit or 30 days pass, whichever happens first.

</Expandable>

<Expandable alt_header="What happens if I deplete my trial usage credit before the 30-day trial ends?">

Your trial ends when you reach 30 days or deplete the full $100 credits, whichever comes first. To continue using dbt <Term id="managed"/> providers, you will need to add a payment method and set a monthly spend limit.

You can also continue with your own AI provider ("Bring Your Own Key (BYOK)") if you configure credentials for a supported AI provider.

</Expandable>

<Expandable alt_header="What happens when my dbt Wizard trial ends?">

dbt-managed Wizard usage pauses unless paid access is configured by purchasing additional consumption pools.

Self-serve accounts will be able to add a payment method and choose a monthly spend limit.

Enterprise and Enterprise+ accounts should contact their dbt Labs account team. BYOK usage remains separate and is billed by your provider.

</Expandable>

<Expandable alt_header="Will dbt automatically charge me when my trial ends?">

No. Starting a trial doesn't automatically create paid usage. For self-serve access, you must add a payment method and choose a spend limit. If you set up payment while the trial is active, paid usage begins only after the trial ends or its credit is exhausted.

</Expandable>

### Enterprise & Enterprise+ plans

<Expandable alt_header="What does the dbt Wizard Enterprise plan monthly usage credits include?">

Enterprise plans automatically include a $100/month usage credits at no cost, and Enterprise+ includes a $200/month usage credits.

These amounts are per account, not per user. Everyone on the account draws from the same shared credits. No billing setup or opt-in is required to receive the monthly included consumption usage credits as it renews each billing period and doesn't roll over.

These included monthly credits can only be spent on <Constant name="wizard" />. They can't be used for dbt State or any other consumption-based feature.

</Expandable>

<Expandable alt_header="What happens when your account depletes its monthly usage credits limit?">

dbt Managed Wizard usage pauses until an authorized admin purchases additional usage credits through your account team or the next billing cycle begins. BYOK usage is unaffected because your AI provider bills it separately.

</Expandable>

### Consumption pool add-on

<Expandable alt_header="How does the consumption pool work?">

It's the balance that covers dbt-<Term id="managed"/> inference usage (which must be purchased once you have depleted any freely available monthly or trial usage credits that may be available), metered per token at cost. Pool dollars don't roll over at the end of a committed term.

Unlike free Wizard usage credits, purchased committed spend isn't limited to <Constant name="wizard" /> &mdash; it covers both <Constant name="wizard" /> and dbt State.
</Expandable>

<Expandable alt_header="Do I pay the full consumption pool or only for what I use?">

It depends on how you purchase <Constant name="wizard" />:

- **Pay-as-you-go (self-service):** You pay only for actual dbt-managed Wizard usage, up to your selected spend limit. The spend limit is a cap, not a prepaid charge. Typically for Developer, Starter, and self-hosted plans. 
- **Pre-committed spend:** You commit to a specific amount upfront through your account team and are billed for that amount. Your usage is deducted from the committed amount as you use <Constant name="wizard" />. Typically for Enterprise-tiered plans.

Talk to your account team to set up a pre-committed spend.

</Expandable>

<Expandable alt_header="Who can set or change the dbt Wizard consumption pool limit?">

An account admin or billing admin can manage Wizard billing and spend controls.

In the <Constant name="dbt_platform" />, go to **Billing & Usage** > **Usage-based features** > **Wizard** to view or update the limit.

</Expandable>

<Expandable alt_header="Is the consumption pool for dbt Wizard also shared with dbt State or dbt Copilot?">

It depends on which credits you're using:
- Free <Constant name="wizard" /> usage credits (The Developer and Starter trial pool, and the Enterprise and Enterprise+ monthly included usage credits) are scoped to <Constant name="wizard"/> only.
- Consumption pool add-on that you purchase covers both <Constant name="wizard"/> and dbt State, so usage from either feature draws down the same account-level pool.

Either way, Copilot Actions are metered separately on an actions-based model and never touch your dbt Wizard consumption pool. dbt Wizard also has its own feature-level spend limit, configured separately from dbt State.

</Expandable>

### Tracking usage & spend limits

<Expandable alt_header="Do I need a paid dbt plan or credit card to try dbt Wizard?">

No. You need a free <Constant name="dbt" /> account to manage usage, billing, and spend limits, but you don't need a paid <Constant name="dbt_platform" /> plan or credit card to start the trial. If you don't have an account, you can [create one](https://www.getdbt.com/signup) during setup.

</Expandable>

<Expandable alt_header="How can I track my dbt Wizard usage and remaining trial credit?">

From September 1st, 2026, you'll be able to track in <Constant name="dbt_platform" /> by going to **Account settings** > **Billing & Usage**.

The overview and Wizard usage-based feature pages will show your current consumption pool/usage, trial balance, and spend controls across the platform and CLI.

</Expandable>

<Expandable alt_header="Where can I find the current token rates for each supported model?">

Refer to the [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table), which includes the current input, cache-write, cached-read, and output token rates. Rates vary by model and can change over time.

</Expandable>

<Expandable alt_header="How does the spend limit work?">

You'll be able to set a monthly spend limit for <Constant name="wizard" /> in <Constant name="dbt_platform"/>. You'll be alerted as you approach it, and usage pauses if you reach it until the limit is raised or the next billing period begins.

</Expandable>


### Bring Your Own Key (BYOK)

<Expandable alt_header="Does bring your own key (BYOK) usage consume dbt Wizard consumption pools?">

No. With BYOK, your AI provider bills you directly. BYOK usage doesn't draw from your dbt-managed consumption pools.

</Expandable>

<Expandable alt_header="How does BYOK work?">

With BYOK, you connect your own AI provider credentials and pay the provider directly. BYOK usage doesn't consume your dbt Wizard consumption pool. Refer to the [BYOK setup guide](/docs/platform/wizard-byok-platform) for configuration details.

Refer to [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table) for more information.

</Expandable>

## dbt-managed inference

<Expandable alt_header="Why use dbt-managed inference instead of bringing my own key?">

With dbt-<Term id="managed"/> inference, there's nothing to configure or maintain. dbt Labs selects and maintains the underlying models for cost, speed, and accuracy, so your team focuses on data work, not agent upkeep.

Usage is billed through your existing dbt account and covered by your consumption pool, so there's one bill instead of a second vendor relationship to manage.

</Expandable>

<Expandable alt_header="Which models are available with dbt-managed inference, and who picks them?">

dbt-<Term id="managed"/> inference includes several frontier models, including models from OpenAI and Anthropic, plus a set of open weight models. dbt Labs maintains and updates this list, so new models become available without you having to evaluate or configure a new provider yourself.

Refer to [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table) for more information.

</Expandable>

<Expandable alt_header="Do I need to worry about rate limits or provider outages with dbt-managed inference?">

No &mdash; dbt manages the underlying provider relationships and infrastructure for dbt-<Term id="managed"/> inference. You interact with a single consumption pool and spend limit in <Constant name="dbt_platform"/>, regardless of which model is handling a given request.

</Expandable>


<Expandable alt_header="Can I mix dbt-managed inference and BYOK?">

Yes. BYOK usage is billed by your provider and never draws from your dbt-<Term id="managed"/> consumption pool, so you can use dbt-managed inference for some work and BYOK for other work without either affecting the other's usage or billing.
</Expandable>

<Expandable alt_header="Is dbt-managed inference more expensive than using my own provider key?">

Cost depends on the model and your usage pattern. dbt-<Term id="managed"/> inference is metered per token at the model's rate, while BYOK usage is billed directly by your provider at their own rates. Compare the two based on which models and volume you expect to use.

Refer to [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table) for more information.
</Expandable>
