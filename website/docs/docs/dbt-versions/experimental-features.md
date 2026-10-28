---
title: "Preview new and experimental features in the dbt platform"
id: "experimental-features"
sidebar_label: "Preview new dbt platform features"
description: "Gain early access to many new dbt Labs experimental features by enabling this in your profile."
pagination_next: null
availability: platform_login
---

dbt Labs often tests experimental features before deciding to continue on the [Product lifecycle](/docs/dbt-versions/product-lifecycles).

You can access experimental features to preview beta features that haven’t yet been released to <Constant name="dbt" />. You can toggle on or off all experimental features by clicking your account name in the bottom left, selecting **Your profile**, and finding the toggle under **User profile**. Experimental features:

- May not be feature-complete or fully stable as we’re actively developing them.
- Could be discontinued at any time.
- May require feedback from you to understand their limitations or impact. Each experimental feature collects feedback directly in <Constant name="dbt" />, which may impact dbt Labs' decisions to implement. 
- May have limited technical support and be excluded from our Support SLAs.
- May not have public documentation available.

To enable or disable experimental features:

1. Click your account name in the bottom left and select **Your profile**.
2. Under **User profile**, find **Experimental features**.
3. Click **Beta** to toggle the features on or off as shown in the following image.
   <Lightbox src="/img/docs/dbt-versions/experimental-feats.png" title="Experimental features" />

## Experimental features in v2

Significant new features in dbt v2 may ship as `experimental` first. These features are gated behind an experimental flag or config so they don't impact projects that haven't explicitly opted in. Experimental features can be introduced during an alpha or beta [prerelease](/docs/dbt-versions/dbt-versions#prerelease-stages) phases, and may be promoted to standard features during those same phases, never during the release candidate or at general availability (GA) stages.

## Beta terms and conditions

By using or enabling features that are not yet in general release ("Beta Features"), you agree to the [Beta Features Terms and Conditions](/assets/beta-tc.pdf).
