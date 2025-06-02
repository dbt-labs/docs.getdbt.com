---
title: How do I preserve leading zeros in a seed?
description: "Use column types to include leading zeros in seed"
sidebar_label: 'Include leading zeroes in your seed file'
id: leading-zeros-in-seed

---

If you need to preserve leading zeros (for example in a zipcode or mobile number), include leading zeros in your seed file, and use the `column_types` [configuration](reference/resource-configs/column_types.md) with a varchar datatype of the correct length.
