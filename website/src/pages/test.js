
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

import pythonScript from '../../python/main.py'
import dbowserScript from '../../python/dbowser.py'
import initialScript from '../../python/initial.py'

function Test() {
  const [ pyodide, setPyodide ] = useState()
  const [ output, setOutput ] = useState('...Waiting')

  useEffect(async () => {
    let pyodideObject = await window.loadPyodide();
    setPyodide(pyodideObject)

    pyodideObject.runPythonAsync(initialScript);
    // Show python details
    // console.log(await pyodide.runPythonAsync(`
    //   import sys
    //   sys.version
    // `));
  }, [])
  
  const runPython = async () => {
    const out = await pyodide.runPythonAsync(dbowserScript);
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
