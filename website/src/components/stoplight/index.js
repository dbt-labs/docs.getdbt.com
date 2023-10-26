import { API } from "@stoplight/elements";
import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
export default function Stoplight({ version }) {
  if (!["v1", "v2", "v3", "private"].includes(version)) {
    return null;
  }
  return (
    <API
      apiDescriptionUrl={
        "https://raw.githubusercontent.com/dbt-labs/dbt-cloud-openapi-spec/master/openapi-" +
        version +
        ".yaml"
      }
      platformUrl={useBaseUrl("/")}
      basePath={useBaseUrl("/dbt-cloud/api-" + version) + "#"}
      hideSchemas
    />
  );
}
