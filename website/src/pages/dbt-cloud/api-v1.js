import React from "react";
import Layout from "@theme/Layout";

import { API } from "@stoplight/elements";
import "@stoplight/elements/styles.min.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
function dbtCloudAPI() {
  return (
    <Layout permalink="/">
      <API
        //   todo: update this url
        apiDescriptionUrl="https://raw.githubusercontent.com/dbt-labs/dbt-cloud-openapi-spec/mbarker/generated-docs/openapi-v1.yaml"
        platformUrl={useBaseUrl("/")}
        basePath={useBaseUrl("/dbt-cloud/api-v1") + "#"}
      />
    </Layout>
  );
}

export default dbtCloudAPI;
