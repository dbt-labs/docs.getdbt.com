<Lightbox src="/img/docs/dbt-platform/wizard-architecture-platform.png" width="100%" title="How data flows when dbt Wizard runs in the dbt platform, and what is and isn't shared with the AI provider." />

Your prompt, project metadata, and any query results you approve are sent to the AI provider over TLS. Warehouse credentials are never shared, queries run only after you approve them, and dbt Labs-managed providers can't retain your data or train on it.
