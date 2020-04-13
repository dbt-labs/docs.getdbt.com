
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import styles from './styles.module.css';

const files = require.context(
    '../../docs',
    false,
    /homepage.md$/
);

if (files.keys().length != 1) {
    throw "Could not find homepage"
}

const homepage = files('./homepage.md').default({})

function Home() {
  const context = useDocusaurusContext();

  return (
    <Layout permalink="/">
        <div className={styles.section}>
            <div className="container">
              <div className="row">
                <div className="col">
                { homepage }
                </div>
              </div>
            </div>
        </div>
    </Layout>
  );
}

export default Home;
