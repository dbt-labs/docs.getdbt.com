import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import styles from "./styles.module.css";

/**
 * A button that sends the reader from the docs into the dbt platform (or the
 * signup page). Use it only where the reader switches from the docs to the
 * product, one per step, with a "verb + destination" label.
 *
 *   <PlatformCta
 *     label="Create a dbt account"
 *     href="https://www.getdbt.com/signup"
 *     step="create-account"
 *   />
 *
 * What it does for you:
 * - Opens in a new tab (`target="_blank"`, `rel="noopener"`).
 * - Adds UTM parameters to dbt-owned URLs:
 *     utm_source=docs
 *     utm_medium=quickstart_cta
 *     utm_campaign=<guide file name, for example snowflake-qs>
 *     utm_content=<step>
 *   Parameters already on the URL win, so a link can override any of them.
 * - Is dropped from the generated .md (data-md-hide). Agents get the written
 *   steps, not a button. Always keep the written path next to the button.
 *
 * Props:
 * - label: button text (required)
 * - href: destination (required)
 * - step: short slug for utm_content, for example "open-platform"
 * - campaign: overrides utm_campaign (defaults to the page's file name)
 */

const DBT_HOST = /(^|\.)(getdbt\.com|dbt\.com)$/;

export function withUtm(href, { campaign, step }) {
  let url;
  try {
    url = new URL(href);
  } catch (e) {
    return href;
  }

  if (!DBT_HOST.test(url.hostname)) {
    return href;
  }

  const params = {
    utm_source: "docs",
    utm_medium: "quickstart_cta",
    utm_campaign: campaign,
    utm_content: step,
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

function campaignFromSource(source = "") {
  const file = source.split("/").pop() ?? "";
  return file.replace(/\.mdx?$/, "");
}

export default function PlatformCta({ label, href, step, campaign }) {
  const { metadata } = useDoc();

  if (!label || !href) {
    return null;
  }

  const finalHref = withUtm(href, {
    campaign: campaign ?? campaignFromSource(metadata.source),
    step,
  });

  return (
    <div className={styles.wrapper} data-md-hide="true">
      <a
        className="button button--primary"
        href={finalHref}
        target="_blank"
        rel="noopener"
      >
        {label}
        <span className={styles.arrow} aria-hidden="true">
          {" "}
          ↗
        </span>
        <span className={styles.srOnly}> (opens in a new tab)</span>
      </a>
    </div>
  );
}
