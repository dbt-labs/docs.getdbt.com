/*
 * Full Documentation at: 
 * https://www.notion.so/dbtlabs/Versioning-on-Docusaurus-c6a4a41a66cd4ea2970854cc42cb5b70#1803b9cb666442e5ac8885cf0bba321f
 *
 */ 

exports.dbtVariables = {
  // Example global variable with versioning
  // If version 0.21 or lower is selected
  // "Old Example String" will replace "Example String"
  exampleString: {
    name: "Example String",
    versions: [
      {
        "name": "Old Example String",
        "version": "0.21"
      }
    ]
  },
    dbtTheProduct: {
    name: "dbt"
  },
    dbtCore: {
    name: "dbt Core"
  },
    dbtCloud: {
    name: "dbt Cloud"
  },
    dbtIDE: {
    name: "dbt Cloud IDE"
  },
}
