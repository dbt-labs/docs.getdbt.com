---
title: How do I write long-form explanations in my descriptions?
description: "Write long descriptions in your documentation"
sidebar_label: 'Write long descriptions'
id: long-descriptions
---
If you need more than a sentence to explain a model, you can:
1. Split your description over multiple lines using `>`. Interior line breaks are removed and Markdown can be used. This method is recommended for simple, single-paragraph descriptions:
```yml
  version: 2

  models:
  - name: customers
    description: >
      Lorem ipsum **dolor** sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
```

2. Split your description over multiple lines using `|`. Interior line breaks are maintained and Markdown can be used. This method is recommended for more complex descriptions:
```yml
  version: 2

  models:
  - name: customers
    description: |
      ### Lorem ipsum

      * dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      * tempor incididunt ut labore et dolore magna aliqua.
```

3. Use a [docs block](/docs/collaborate/documentation#using-docs-blocks) to write the description in a separate Markdown file.
