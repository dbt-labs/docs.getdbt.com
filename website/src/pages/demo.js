import React from 'react';
import axios from 'axios'
import Layout from '@theme/Layout';

const triggerFunction = async () => {
  await axios.post('http://localhost:8888/.netlify/functions/update-algolia')
}

function Demo() {
  return (
    <Layout>
      <div className='container'>
        <a className='button button--primary' onClick={() => triggerFunction()}>Trigger Function</a>
      </div>
    </Layout>
  );
}

export default Demo;
