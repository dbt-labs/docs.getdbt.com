| <div style={{width:'240px'}}>Guide</div> | <div style={{width:'250px'}}>Information</div> | <div style={{width:'200px'}}>Audience</div> |
|------------|-------------|----------|
| [Move from dbt Core to <Constant name="dbt_platform" />: What you need to know](/guides/dbt-migration-2) | Understand the considerations and methods needed in your move from dbt Core to <Constant name="dbt_platform" />. | Team leads <br /> Admins |
| [Move from dbt Core to <Constant name="dbt_platform" />: Get started](/guides/dbt-migration-1?step=1) | Learn the steps needed to move from dbt Core to <Constant name="dbt_platform" />. | Developers <br /> Data engineers <br /> Data analysts |
| [Move from dbt Core to <Constant name="dbt_platform" />: Optimization tips](/guides/dbt-migration-3) | Learn how to optimize your <Constant name="dbt" /> experience with common scenarios and useful tips. | Everyone |

### Why move to the dbt platform?

If your team is using dbt Core today, you could be reading this guide because:

- You've realized the burden of maintaining that deployment.
- The person who set it up has since left.
- You're interested in what <Constant name="dbt" /> could do to better manage the complexity of your dbt deployment, democratize access to more contributors, or improve security and governance practices.
- You need a governed data foundation for AI—shared definitions, lineage, and testing so analytics and AI give answers the business can trust.

Self-hosting hides its true cost in engineer hours and wasted compute. dbt platform eliminates that overhead with managed infrastructure and browser-based development so more people can contribute without you being the bottleneck.

:::caution State-aware orchestration is now dbt State
[dbt State](/docs/deploy/dbt-state-about) works with all engines and environments: <Constant name="core" />, the <Constant name="dbt_platform" />, and <Constant name="fusion_engine" />.

If you were using state-aware orchestration prior to June 1, 2026, you can continue using it. Once you start your free dbt State trial, it will be extended beyond the standard 30-day period. If the extension isn't applied to your account, contact your account team. To get started, refer to [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration).
::: 

The data layer is the AI layer—make sure it's tested, defined, and trusted end to end.

Moving from dbt Core to <Constant name="dbt" /> simplifies workflows by providing a fully managed environment that improves collaboration, security, and orchestration. With <Constant name="dbt" />, you gain access to features like cross-team collaboration ([dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro)), version management, streamlined CI/CD, [<Constant name="catalog" />](/docs/explore/explore-projects) for comprehensive insights, and more &mdash; making it easier to manage complex dbt deployments and scale your data workflows efficiently. 

It's ideal for teams looking to reduce the burden of maintaining their own infrastructure while enhancing governance and productivity.
