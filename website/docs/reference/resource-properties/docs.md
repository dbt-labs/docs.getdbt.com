#### docs

<Changelog> Added in v0.16.0 </Changelog>

The `docs` field can be used to provide documentation-specific configuration to models. The only currently supported `docs` attribute is `show`, which controls whether or not models are shown in the auto-generated documentation website. **Note:** hidden models will still appear in the dbt DAG visualization, but will be identified as "hidden".

```yml
models:
  - name: sessions__tmp
    docs:
      show: false
```
