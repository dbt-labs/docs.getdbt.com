import React, { setState } from "react";

import { useState, useEffect } from 'react'

const queriesQuery = `{
  __schema {
    queryType {
      fields {
        name
        type {
          name
          description
        }
        description
        args {
          name
          description
          defaultValue
          type {
            name
            description
            kind
            ofType { name description }
          }
        }
      }
    }
  }
}`


export const ArgsTable = ({ queryName }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      fetch('https://metadata.cloud.getdbt.com/graphql', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queriesQuery }),        
      })
        .then((result) => result.json())
        .then((data) => setData(data))
    }
    fetchData()
  }, [])

  if (!data) {
    return <h1>Fetching data...</h1>
  }

  return (
    <table>
      <thead>
        <tr>
          <td>Field</td>
          <td>Type</td>
          <td>Required?</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        {data.data.__schema.queryType.fields.find(d=>d.name===queryName).args.map(function ({name, description, type} ) {
          return (
            <tr key={name}>
              <td><code>{name}</code></td>
              {type.ofType ? 
                <td><code title={type.description}>{type.ofType.name}</code></td> :
                <td><code title={type.description}>{type.name}</code></td> 
              }
              <td>{type.kind === 'NON_NULL' ? `Yes` : `No`}</td>
              <td>{description || `No description provided`}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}



export const SchemaTable = ({ nodeName }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      fetch('https://metadata.cloud.getdbt.com/graphql', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `{
          __type(name: "${nodeName}") {
            fields {
              name
              description
              type { 
                name 
                description 
                kind 
                ofType { 
                  name 
                  description
                  ofType { 
                    name 
                    description
                  }                   
                } 
              }
            }
          }
        }`}),        
      })
        .then((result) => result.json())
        .then((data) => setData(data))
    }
    fetchData()
  }, [])

  if (!data) {
    return <h1>Fetching data...</h1>
  }

  return (
    <table>
      <thead>
        <tr>
          <td>Field</td>
          <td>Type</td>
          <td>Description</td>
        </tr>
      </thead>      
      <tbody>
        {data.data.__type.fields.map(function ({name, description, type} ) {
          return (
            <tr key={name}>
              <td><code>{name}</code></td>
              {type.kind==='LIST' ? 
                <td><code title={type.description}>[{type.ofType.ofType ? type.ofType.ofType.name : type.ofType.name }]</code></td> :
                (type.ofType ? 
                  <td><code title={type.description}>{type.ofType.name}</code></td> :
                  <td><code title={type.description}>{type.name}</code></td> 
                ) 
              }
              <td>{description}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

