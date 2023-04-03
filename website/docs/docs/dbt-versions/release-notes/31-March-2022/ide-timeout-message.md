---
title: "Spotty internet issues no longer cause a session time out message"
id: "ide-timeout-message"
description: "Mar 2022 release note: We fixed an issue where a spotty internet connection could cause the “IDE session timed out” message to appear unexpectedly. People using a VPN were most likely to see this issue."
sidebar_label: "Fix: Session time out"
tags: [v1.1.47, March-10-2022, IDE]
---

We fixed an issue where a spotty internet connection could cause the “IDE session timed out” message to appear unexpectedly. People using a VPN were most likely to see this issue.

We updated the health check logic so it now excludes client-side connectivity issues from the IDE session check. If you lose your internet connection, we no longer update the health-check state. Now, losing internet connectivity will no longer cause this unexpected message.

<Lightbox src="/img/docs/dbt-cloud/Fix Session Timeout.png" title="Fix Session Timeout"/>
