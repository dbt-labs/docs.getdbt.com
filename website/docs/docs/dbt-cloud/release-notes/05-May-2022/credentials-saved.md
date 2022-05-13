---
title: "Credentials no longer accidentally wiped when editing an environment"
id: "credentials-saved"
description: ""
sidebar_label: "Fix: Credentials saved"
tags: [April-26-2022]
---

We resolved a bug where when updating unencrypted fields (e.g. threads, schema name) in an environment setting would cause secret fields (e.g. password, keypair, credential details) to be deleted from that environment. Now users can freely update environment settings without fear of unintentionally wiping credentials.
