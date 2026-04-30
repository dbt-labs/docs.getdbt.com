---
title: "Networking requirements"
id: "fusion-networking"
description: "Outbound network access requirements for the dbt Fusion engine, including adapter drivers, telemetry, and manifest downloads."
---

# Networking requirements <Lifecycle status="preview" />

<Constant name="fusion" /> requires outbound HTTPS access to several endpoints depending on your usage. This page describes each requirement and provides guidance for enterprise environments that restrict outbound traffic.

The following table summarizes all endpoints. See each section below for details.

| Resource | URL | Required for |
| --- | --- | --- |
| [Adapter drivers](#adapter-drivers) | `https://public.cdn.getdbt.com` | All users |
| [Telemetry](#telemetry) | `https://p.vx.dbt.com` | All users (can be disabled) |
| [Manifest downloads](#manifest-downloads) | Cloud provider storage URLs (varies by region) | <Constant name="dbt_platform" /> users only |

## Adapter drivers {#adapter-drivers}

The <Constant name="fusion" /> binary does _not_ bundle database drivers. Instead, <Constant name="fusion" /> automatically downloads the correct [ADBC](https://arrow.apache.org/adbc/) driver for your data platform the first time you run a dbt command (such as `dbt run`, `dbt debug`, or `dbt compile`). <Constant name="fusion" /> detects which driver you need based on your `profiles.yml` configuration and downloads it from the dbt Labs CDN. <Constant name="fusion" /> distributes all checksums with the binary itself to guarantee authenticity of the downloaded drivers.

Adapter driver downloads require outbound HTTPS access to the dbt CDN:

| Resource | URL | Purpose |
| --- | --- | --- |
| **Adapter drivers** | `https://public.cdn.getdbt.com` | Downloads ADBC adapter driver libraries (`.dylib`, `.so`, `.dll`) on first use or when running `dbt system install-drivers` |

:::info
<Constant name="fusion" /> handles driver download automatically on first use. The `dbt system install-drivers` command downloads **all** supported drivers (Snowflake, BigQuery, Postgres, Databricks, Redshift, DuckDB, and Salesforce) at once. This is useful if you work across multiple data platforms and want to pre-cache every driver before going offline or switching projects.
:::

### Enterprise proxy considerations

Adapter drivers are native shared libraries (`.dylib` on macOS, `.so` on Linux, `.dll` on Windows). Some enterprise proxy filters and security tools classify these file types as executables and may block the download &mdash; even if you allowlist `public.cdn.getdbt.com` at the domain level.

If your organization's proxy blocks adapter driver downloads, work with your IT team to ensure both:

1. You allowlist the domain `public.cdn.getdbt.com`.
2. Content inspection rules permit downloading native library file types (`.dylib`, `.so`, `.dll`) from that domain.

If you cannot change your proxy configuration, see [Restricted network installation](#restricted-network-installation).

### Restricted network installation

If your environment cannot access `public.cdn.getdbt.com` for adapter driver downloads, you can pre-build a bundle of the <Constant name="fusion" /> binary and the adapter drivers into a single `.tar.gz` or Docker image and host it on an internally approved fileshare.

For supported adapters, refer to [Fusion requirements](/docs/fusion/supported-features#requirements).

## Telemetry {#telemetry}

<Constant name="fusion" /> sends anonymous usage [telemetry](/docs/fusion/telemetry) to help improve the product. If the telemetry endpoint is unreachable (for example, blocked by a firewall or proxy), <Constant name="fusion" /> logs errors on each invocation.

| Resource | URL | Purpose |
| --- | --- | --- |
| **Telemetry** | `https://p.vx.dbt.com` | Sends anonymous usage statistics |

To suppress these errors without allowlisting the URL, disable anonymous telemetry by setting the environment variable:

```shell
export DBT_SEND_ANONYMOUS_USAGE_STATS=false
```

You can also add this to your `.env` file in your project root:

```env
DBT_SEND_ANONYMOUS_USAGE_STATS=false
```

For more details on `.env` file usage, refer to [Environment variables](/docs/local/install-dbt?version=2#environment-variables).

## Manifest downloads (dbt platform only) <Lifecycle status="enterprise" /> {#manifest-downloads} 

For [<Constant name="dbt_platform" />](/docs/platform/about-platform/dbt-cloud-features) customers using <Constant name="fusion" /> locally, <Constant name="fusion" /> downloads production manifests from <Constant name="dbt_platform" /> to enable features like [deferral](/reference/node-selection/defer) and [cross-project references](/docs/mesh/govern/project-dependencies). The [cloud storage provider](/docs/platform/about-platform/access-regions-ip-addresses) hosting your <Constant name="dbt_platform" /> cell serves these manifests via **pre-signed URLs**.

The specific hostnames depend on your <Constant name="dbt_platform" /> deployment region and the underlying cloud provider. To ensure <Constant name="fusion" /> can download manifests, allowlist the appropriate storage domain for your region:

| Cloud provider | URL pattern | Example |
| --- | --- | --- |
| **AWS (S3)** | `https://s3.<region>.amazonaws.com` | `https://s3.ap-northeast-1.amazonaws.com` (JP1) |
| **Azure (Blob Storage)** | `https://<account>.blob.core.windows.net` | `https://prodeu2.blob.core.windows.net` (EU2) |
| **GCP (Cloud Storage)** | `https://storage.googleapis.com` | `storage.googleapis.com` |

Because pre-signed URLs contain region and account-specific hostnames that may change over time, we recommend allowlisting the **base storage domain** for your cloud provider rather than individual URLs:

- **AWS** &mdash; `s3.*.amazonaws.com`
- **Azure** &mdash; `*.blob.core.windows.net`
- **GCP** &mdash; `storage.googleapis.com`
