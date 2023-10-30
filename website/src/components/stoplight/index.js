import { API } from "@stoplight/elements";
import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import baseStyles from "./baseStyles.module.css";
import customStyles from "./customStyles.module.css";

export default function Stoplight({ version }) {
  if (!["v1", "v2", "v3", "private"].includes(version)) {
    return null;
  }

  return (
    //<div className={`${baseStyles} ${customStyles}`}>
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
    //</div>
  );
}
