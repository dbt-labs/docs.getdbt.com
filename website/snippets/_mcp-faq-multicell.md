<Expandable alt_header="Multi-cell or static subdomain account connection issues">

**Symptoms:** Connection errors when your account URL includes a prefix (for example, `abc123.us1.dbt.com`).

**Solution (as of v1.14.0):** Set `DBT_HOST` to the full hostname including the prefix. If you're using PAT-based auth, also set `DBT_ACCOUNT_ID`.

```bash
# ✅ Correct
DBT_HOST=abc123.us1.dbt.com
DBT_ACCOUNT_ID=12345  # required for PAT-based auth
```

You no longer need to set `MULTICELL_ACCOUNT_PREFIX` or `DBT_HOST_PREFIX`. If you have these set from an older configuration, remove them.
</Expandable>
