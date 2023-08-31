---
title: Macro properties
id: macro-properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

Macro properties can be declared in `.yml` files, except in the `dbt_project.yml` files. <PropsCallout title={frontMatter.title}/>  <br /> 

 You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in sub-folders:

<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    arguments:
      - name: <arg name>
        [type](/reference/resource-properties/argument-type): <string>
        [description](/reference/resource-properties/description): <markdown_string>
      - ... # declare properties of additional arguments

  - name: ... # declare properties of additional macros

```

</File>

<Changelog>

* `v0.16.0`: The ability to declare macro properties was introduced.

</Changelog>
