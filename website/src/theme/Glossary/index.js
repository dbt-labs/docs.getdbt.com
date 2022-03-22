
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

function Glossary({ termData }) {
  console.log('termData', termData)

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0" />
      </Head>

      <Layout permalink="/">
          <div className="container glossary" style={{"padding": "10px 0"}}>
          	<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(5vh) auto calc(2vh)"}}>
          		<div className="col">
                {termData.map(term => (
          			 <h1>{term.data.title}</h1>
                ))}
	  			    </div>
	  		    </div>
          </div>
      </Layout>
    </>
  );
}

export default Glossary;
