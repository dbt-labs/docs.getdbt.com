---
title: How do I preserve leading zeros in a seed?
description: "Use column types to include leading zeros in seed"
sidebar_label: 'Include leading zeroes in your seed file'
id: leading-zeros-in-seed

---

If you need to preserve leading zeros (for example in a zipcode or mobile number):

1. v0.16.0 onwards: Include leading zeros in your seed file, and use the `column_types` [configuration](reference/resource-configs/column_types.md) with a varchar datatype of the correct length.
2. Prior to v0.16.0: Use a downstream model to pad the leading zeros using SQL, for example: `lpad(zipcode, 5, '0')`
