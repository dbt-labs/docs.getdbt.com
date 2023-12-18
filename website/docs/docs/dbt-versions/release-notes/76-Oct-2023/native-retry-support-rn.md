---
title: "Enhancement: Native support for the dbt retry command"
description: "October 2023: Rerun errored jobs from start or from the failure point"
sidebar_label: "Enhancement: Support for dbt retry"
tags: [Oct-2023, Scheduler]
date: 2023-10-06
sidebar_position: 10
---

Previously in dbt Cloud, you could only rerun an errored job from start but now you can also rerun it from its point of failure. 

You can view which job failed to complete successully, which command failed in the run step, and choose how to rerun it. To learn more, refer to [Retry jobs](/docs/deploy/retry-jobs).


<Lightbox src="/img/docs/deploy/native-retry.gif" width="70%" title="Example of the Rerun options in dbt Cloud"/>
