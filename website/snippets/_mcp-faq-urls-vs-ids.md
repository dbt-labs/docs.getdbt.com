<Expandable alt_header="Pasting full URLs instead of IDs">

**Symptoms:** Authentication errors, unexpected behavior, or the server failing to connect to the right environment.

**Cause:** Environment variables like `DBT_PROD_ENV_ID`, `DBT_USER_ID`, and `DBT_ACCOUNT_ID` expect numeric integers, not full browser URLs.

**Solution:**

```bash
# ✅ Correct
DBT_HOST=cloud.getdbt.com            # https://cloud.getdbt.com also works
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Wrong — IDs must be numeric, not full URLs
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```

See [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for step-by-step instructions.

</Expandable>
