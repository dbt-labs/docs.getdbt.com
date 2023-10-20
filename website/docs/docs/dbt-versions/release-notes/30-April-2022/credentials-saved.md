---
title: "Credentials no longer accidentally wiped when editing an environment"
id: "credentials-saved"
description: "Credentials are now saved when editing an environment."
sidebar_label: "Fix: Credentials saved"
tags: [April-29-2022, v1.1.51]
---

We resolved a bug where when updating unencrypted fields (e.g. threads, schema name) in an environment setting would cause secret fields (e.g. password, keypair, credential details) to be deleted from that environment. Now users can freely update environment settings without fear of unintentionally wiping credentials.
