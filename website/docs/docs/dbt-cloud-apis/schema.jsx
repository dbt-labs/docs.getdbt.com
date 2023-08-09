import React from "react";
import { useState, useEffect } from 'react'

const getTypeString = (typeStructure) => {
  // Helper function to represent GraphQL type
  if (!typeStructure) return ''

  if (typeStructure.kind === 'NON_NULL') {
    return `${getTypeString(typeStructure.ofType)}!`;
  } else if (typeStructure.kind === 'LIST') {
    return `[${getTypeString(typeStructure.ofType)}]`;
  } else if (['OBJECT', 'SCALAR'].includes(typeStructure.kind)) {
    return `${typeStructure.name}${getTypeString(typeStructure.ofType)}`;
  } else {
    return '';
  }
}

export const ArgsTable = ({ data, name }) => {
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
        {data.fields.find(d => d.name === name).args.map(function ({ name, description, type }) {
          return (
            <tr key={name}>
              <td><code>{name}</code></td>
              <td><code title={type.description}>{getTypeString(type)}</code></td>
              <td>{type.kind === 'NON_NULL' ? `Yes` : `No`}</td>
              <td>{description || `No description provided`}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const metadataUrl = 'http://localhost:3333/graphql'
const metadataBetaUrl = 'http://localhost:3333/beta/graphql'
// const metadataUrl = 'https://metadata.cloud.getdbt.com/graphql'
// const metadataBetaUrl = 'https://metadata.cloud.getdbt.com/beta/graphql'

const queryArgsQuery = `{
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
            ofType { kind name description }
          }
        }
      }
    }
  }
}`

export const QueryArgsTable = ({ queryName, useBetaAPI }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      fetch(useBetaAPI ? metadataBetaUrl : metadataUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryArgsQuery }),
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
    <ArgsTable name={queryName} data={data.data.__schema.queryType} />
  )
}

export const NodeArgsTable = ({ parent, name, useBetaAPI }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      fetch(useBetaAPI ? metadataBetaUrl : metadataUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query {
            __type(name: "${parent}") {
              ...FullType
            }
          }

          fragment FullType on __Type {
            kind
            fields(includeDeprecated: true) {
              name
              description
              args {
                name
                description
                defaultValue
                type {
                  ...TypeRef
                }
              }
            }
          }

          # get several levels
          fragment TypeRef on __Type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `})
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
    <ArgsTable name={name} data={data.data.__type} />
  )
}

export const SchemaTable = ({ nodeName, useBetaAPI }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      fetch(useBetaAPI ? metadataBetaUrl : metadataUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query {
            __type(name: "${nodeName}") {
              ...FullType
            }
          }

          fragment FullType on __Type {
            kind
            name
            description
            fields(includeDeprecated: true) {
              name
              description
              type {
                ...TypeRef
              }
            }
          }

          # get several levels
          fragment TypeRef on __Type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `}),
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
        {data.data.__type.fields.map(function ({ name, description, type }) {
          return (
            <tr key={name}>
              <td><code>{name}</code></td>
              <td><code title={type.description}>{getTypeString(type)}</code></td>
              <td>{description}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
