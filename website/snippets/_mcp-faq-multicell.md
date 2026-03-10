**Symptoms:** Connection errors when your account URL includes a prefix (for example, `abc123.us1.dbt.com`).

**Cause:** For multi-cell accounts, the account prefix must be set separately from the host.

**Solution:**

```bash
# ✅ Correct
DBT_HOST=us1.dbt.com
MULTICELL_ACCOUNT_PREFIX=abc123

# ❌ Wrong — don't include the prefix in DBT_HOST
DBT_HOST=abc123.us1.dbt.com
```

If your full URL is `abc123.us1.dbt.com`, split it as:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`
