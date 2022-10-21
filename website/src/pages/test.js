
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

import pythonScript from '../../python/main.py'

function Test() {
  const [ pyodide, setPyodide ] = useState()
  const [ output, setOutput ] = useState('...Waiting')

  useEffect(async () => {
    let pyodideObject = await window.loadPyodide();
    setPyodide(pyodideObject)

    // Show python details
    // console.log(await pyodide.runPythonAsync(`
    //   import sys
    //   sys.version
    // `));
  }, [])
  
  const runPython = async () => {
    const out = await pyodide.runPythonAsync(pythonScript);
    setOutput(out)
  }

  return (
    <>
      <Layout permalink="/">
        <div className='container'>
          {pyodide && (
            <button onClick={() => runPython()}>Test Pyodide</button>
          )}
          <div>5 + 7 = {output}</div>
        </div>
      </Layout>
    </>
  );
}

export default Test;
