Groups are defined in `.yml` files, nested under a `groups:` key. <VersionBlock firstVersion="1.10">You can add the `meta` config to add more information about the group.</VersionBlock>


<VersionBlock lastVersion="1.9">
<File name='models/marts/finance/finance.yml'>

```yaml
groups:
  - name: finance
    owner:
      # 'name' or 'email' is required; additional properties allowed
      email: finance@jaffleshop.com
      slack: finance-data
      github: finance-data-team
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.10">
<File name='models/marts/finance/finance.yml'>

```yaml
groups:
  - name: finance
    owner:
      # 'name' or 'email' is required; additional properties will no longer be allowed in a future release
      email: finance@jaffleshop.com
    config:
      meta: # optional
        data_owner: Finance team
```

</File>
</VersionBlock>