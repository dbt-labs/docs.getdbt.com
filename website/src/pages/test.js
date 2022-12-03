
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

import pythonScript from '../../python/main.py'
import dbowserScript from '../../python/dbowser.py'

function Test() {
  const [ pyodide, setPyodide ] = useState()
  const [ output, setOutput ] = useState('...Waiting')

  useEffect(async () => {

    let py = await window.loadPyodide({
      stdin: () => {
        let result = prompt();
        echo(result);
        return result;
      },
    });
    await py.loadPackage("micropip");
    await py.pyimport("micropip");
    setPyodide(py)
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
