---
title: "Why do model and source yml files always start with `version: 2`?"
description: ".yml file structure more extensible with version 2."
sidebar_label: 'Why does yml file start with version 2'
id: why-version-2

---

<VersionBlock firstVersion="1.5">

Once upon a time, the structure of these `.yml` files was very different (s/o to anyone who was using dbt back then!). Adding `version: 2` allowed us to make this structure more extensible.

Currently this config is not required for resource yml files. If specified, `version: 2` is the only supported version. While we don't anticipate updating yml files to `version: 3` any time soon, if we need to introduce a new structure for these files, we'll be able to do this more easily with this config.

</VersionBlock>

<VersionBlock lastVersion="1.4">

Once upon a time, the structure of these `.yml` files was very different (s/o to anyone who was using dbt back then!). Adding `version: 2` allowed us to make this structure more extensible.

Currently, Version 2 is the only supported version for these files. We kept `version:` around as a required key so that in the future, if we need to introduce a new structure for these files, we'll be able to do this more easily.

</VersionBlock>
