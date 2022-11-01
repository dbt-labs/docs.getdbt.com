---
title: "Service tokens and bug fixes"
is: "service-tokens-more"
description: "Service tokens can now be assigned granular permissions to enforce least privilege access."
sidebar_label: "Service tokens and more"
tags: [v1.1.45, February-16-2022]
---

Service tokens can now be assigned granular permissions to enforce least privilege access. If you're on Enterprise, you can assign any enterprise permission set to newly issued service tokens. If you're on Teams, you can assign the Job Admin permission set to newly issued service tokens. We highly recommend you re-issue service tokens with these new permissions to increase your security posture! See docs [here](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).

#### New products and features

- We are joining the [GitHub secret scanning partner program](https://docs.github.com/en/developers/overview/secret-scanning-partner-program) to better secure your token against accidental public exposure and potential fraudulent usage.

#### Bug fixes

- Credentials are no longer accidentally deleted when a user updates an environment setting.
