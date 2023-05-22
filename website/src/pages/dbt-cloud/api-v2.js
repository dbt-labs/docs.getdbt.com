import React from 'react';
import Layout from '@theme/Layout';

import { RedocStandalone } from 'redoc';

function dbtCloudAPI() {

  return (
    <Layout permalink="/">
        <RedocStandalone
            specUrl='https://raw.githubusercontent.com/fishtown-analytics/dbt-cloud-openapi-spec/master/openapi-v3.yaml'
            options={{
                requiredPropsFirst: true,
                noAutoAuth: true,
                hideDownloadButton: true,
                onlyRequiredInSamples: true,
                scrollYOffset: 60,
                expandResponses: "200",
                hideHostname: false,
                pathInMiddlePanel: true,
                theme: {
                    colors: {
                        primary: {
                            main: "#033744"
                        },
                    },
                },
            }}
        />
    </Layout>
  );
}

export default dbtCloudAPI;
