---
title: "Product lifecycles"
id: "product-lifecycles"
hide_table_of_contents: true
description: "Learn about dbt Labs' product lifecycles."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

dbt Labs manages the lifecycle of features across the dbt platform, dbt Core, and the dbt Fusion engine. Each feature is assigned a lifecycle status that describes its stability, support level, and availability. Use the tabs below to find the lifecycle stages for the product you're using.

Service level objective (SLO) support varies between products and lifecycles.

<Tabs>
<TabItem value="platform" label="dbt platform">

dbt platform features adhere to the following lifecycle path:

<div className="grid--3-col" style={{gap: '1.5rem'}}>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-transform-orange-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-transform-orange-800)', fontSize: '1rem'}}>Beta</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    In active development. May not be fully stable and breaking changes can occur. Documentation may be incomplete, technical support is limited, and SLOs may not apply. Download the [Beta Terms and Conditions](/assets/beta-tc.pdf) for details. If marked `Private`, access must be enabled by dbt Labs.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-coalesce-purple-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-coalesce-purple-800)', fontSize: '1rem'}}>Preview</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Stable and functionally ready for production. Planned additions or non-backward-compatible changes may still occur before GA. Includes documentation, technical support, and SLOs. Available at no extra cost, though may become paid at GA. If marked `Private`, access must be enabled by dbt Labs.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-green-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-green-700)', fontSize: '1rem'}}>Generally available (GA)</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Stable features available to all qualified dbt accounts. SLOs, documentation, and technical support apply. Feature availability may depend on your environment's dbt version. Use a supported [release track](/docs/dbt-versions/dbt-release-tracks) to receive the latest GA features.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-yellow-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-yellow-800)', fontSize: '1rem'}}>Deprecated</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    No longer being actively developed or enhanced. Features continue to function as-is and documentation remains available until the removal date. Technical support no longer applies.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-pink-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-pink-800)', fontSize: '1rem'}}>Removed</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    No longer available on the platform in any capacity.
  </div>
</div>

</div>

</TabItem>
<TabItem value="core" label="dbt Core v1 and v2">

dbt Core releases follow semantic versioning. Read more in [About dbt versions](/docs/dbt-versions). dbt Core v1 and v2 releases both adhere to the following lifecycle path:

<div className="grid--3-col" style={{gap: '1.5rem', marginTop: '1rem'}}>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-terminal-black-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-terminal-black-600)', fontSize: '1rem'}}>Undocumented</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    dbt Core is an open source product, and the codebase may have visibility into internal, non-contracted, or intentionally undocumented functionality. Not considered part of the release's product surface area.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-terminal-black-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-terminal-black-700)', fontSize: '1rem'}}>Unreleased</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Planned for the next minor version prerelease. No commitments on behavior or implementation. Maintainers reserve the right to change or remove it entirely.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-terminal-black-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-terminal-black-700)', fontSize: '1rem'}}>Alpha</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    No commitments on behavior or implementation and not intended for any production work. Use at your own discretion. Maintainers reserve the right to change or remove it entirely.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-transform-orange-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-transform-orange-800)', fontSize: '1rem'}}>Beta</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    First glimpse of net-new features in an upcoming release. Code should work without regressions, but new features may be incomplete or have known edge cases. Changes are not locked and maintainers may still alter or remove them.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-blue-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-blue-700)', fontSize: '1rem'}}>Release Candidate</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    A 2-week window for production-level testing before final release. Features are expected to ship as-is, though maintainers may still address significant bugs before the final release.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-green-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-green-700)', fontSize: '1rem'}}>Generally Available</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Ready for use in production.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-yellow-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-yellow-800)', fontSize: '1rem'}}>Deprecated</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    No longer actively developed or enhanced. Continues to function as-is until its removal date.
  </div>
</div>
</div>

</TabItem>
<TabItem value="fusion" label="dbt Fusion engine">

The dbt Fusion engine and [VS Code extension](/docs/about-dbt-extension) are in various stages of development depending on deployment type. See the [Fusion Diaries](https://github.com/dbt-labs/dbt-core/discussions/categories/announcements?discussions_q=is:open+diaries+category:Announcements) for the latest updates, and our [Path to GA](/blog/dbt-fusion-engine-path-to-ga) blog post for what's required to reach GA.

<div className="grid--3-col" style={{gap: '1.5rem', marginTop: '1rem'}}>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-transform-orange-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-transform-orange-800)', fontSize: '1rem'}}>Beta</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Available to select customers only. Still in development, incomplete, and not fully stable. Breaking changes may occur, documentation may be limited, and SLOs may not apply. Download the [Beta Terms and Conditions](/assets/beta-tc.pdf) for details.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-coalesce-purple-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-coalesce-purple-800)', fontSize: '1rem'}}>Preview</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Stable and functionally ready for production deployments using supported features that don't depend on deprecated functionality.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-green-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-green-700)', fontSize: '1rem'}}>Generally available (GA)</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Learn what's required for the dbt Fusion engine to reach GA in our [Path to GA](/blog/dbt-fusion-engine-path-to-ga) blog post.
  </div>
</div>

</div>

</TabItem>
</Tabs>
