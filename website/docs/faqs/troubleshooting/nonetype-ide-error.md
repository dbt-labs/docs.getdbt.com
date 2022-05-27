---
title: I'm receiving a NoneType object has no attribute error in the IDE?
description: "Copy SSH key to your warehouse"
sidebar_label: 'NoneType error in the IDE'
id: nonetype-ide-error

---

If you're unable to access the IDE due to the below error message, we'll do our best to get you unstuck with the below steps!

```shell
NoneType object has no attribute 
enumerate_fields'
```

Usually this errors indicates that you tried connecting your database via [SSH tunnel](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-via-an-ssh-tunnel). If you're seeing this error, double-check you have supplied the following items:

- the hostname
- username
- port of bastion server

If you've tried the step above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
