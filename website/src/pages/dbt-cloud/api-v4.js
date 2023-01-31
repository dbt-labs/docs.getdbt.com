import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';

import { RedocStandalone } from 'redoc';

function dbtCloudAPI() {
  const context = useDocusaurusContext();

  return (
    <Layout permalink="/">
        <RedocStandalone
            specUrl='https://raw.githubusercontent.com/fishtown-analytics/dbt-cloud-openapi-spec/master/openapi-v4.yaml'
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
