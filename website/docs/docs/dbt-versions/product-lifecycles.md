---
title: "Product lifecycles"
id: "product-lifecycles"
hide_table_of_contents: true
description: "Learn about dbt Labs' product lifecycles."
availability: all_users
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

dbt Labs manages lifecycles for two things: features of the dbt platform, and the dbt engine (v1 and v2) that runs in it. Each is assigned a lifecycle status that describes its stability, support level, and availability. Use the tabs below to find the stages that apply.

Service level objective (SLO) support varies between lifecycles.

<Tabs>
<TabItem value="platform" label="dbt platform features">

Features of the cloud-hosted dbt platform move through the following lifecycle:

<div className="grid--3-col" style={{gap: '1.5rem'}}>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-coalesce-purple-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-coalesce-purple-800)', fontSize: '1rem'}}>Private preview</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Invite-only experimental stage. Free to use, with minimal documentation, no SLA, and limited support. Not for production workflows.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-coalesce-purple-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-coalesce-purple-800)', fontSize: '1rem'}}>Public preview</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Open broad selection of dbt customers. Free to use, with public documentation, limited support, and no SLA. Expected pricing may be shared. Not for production workflows.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-transform-orange-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-transform-orange-800)', fontSize: '1rem'}}>Beta</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Ready to prove in production. Billing may begin. Complete documentation and support apply, but uptime and delivery SLAs do not. Minor bugs may occur.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-green-100)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-green-700)', fontSize: '1rem'}}>Generally available (GA)</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    Validated and fully supported for all qualified dbt accounts. Full SLAs, documentation, and technical support apply. Use a supported [release track](/docs/dbt-versions/dbt-release-tracks) to receive the latest GA features.
  </div>
</div>

<div style={{border: '1px solid var(--border-neutral-tertiary)', borderRadius: '16px', overflow: 'hidden'}}>
  <div style={{background: 'var(--color-yellow-50)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-neutral-tertiary)'}}>
    <strong style={{color: 'var(--color-yellow-800)', fontSize: '1rem'}}>Deprecated</strong>
  </div>
  <div style={{padding: '1.25rem 1.5rem', background: 'var(--ifm-background-color)'}}>
    No longer being actively developed or enhanced. Features continue to function as-is until the removal date. Technical support no longer applies.
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
<TabItem value="engine" label="dbt engine (v1 and v2)">

This tab covers the dbt engine (v1 and v2) that runs in the dbt platform. These stages don't apply to the platform features in the first tab. Engine releases follow semantic versioning. Read more in [About dbt versions](/docs/dbt-versions). Both v1 and v2 releases adhere to the following lifecycle path:

<div className="grid--3-col" style={{gap: '1.5rem', marginTop: '1rem'}}>

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
</Tabs>
