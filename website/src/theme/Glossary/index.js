
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './styles.module.css';

function Glossary({ termData }) {
  console.log('termData', termData)

  function capitalizeId(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0" />
      </Head>

      <Layout permalink="/">
          <div className="container glossary" style={{"padding": "10px 0"}}>
          	<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(5vh) auto calc(2vh)"}}>
          		<div className="col">
                <h1>Glossary</h1>
                {/* If title not set, default to filename of term */}
                {termData.map(term => (
                  <Link to={`/terms/${term.data.id}`} className={styles.termLink} key={term.data.id}>
                    <h2>{term.data.title ? term.data.title : capitalizeId(term.data.id)}</h2>
                    <p>{term.data.hoverSnippet}</p>
                  </Link>
                ))}
	  			    </div>
	  		    </div>
          </div>
      </Layout>
    </>
  );
}

export default Glossary;
