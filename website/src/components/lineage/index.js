import React from 'react'
import '@dbt-labs/react-dbt-dag/dag.css';
import '@dbt-labs/react-dbt-dag/dag.standalone.css';

/** As a private package, not every devleoper will have access to this repo. */
const DagExports = require('@dbt-labs/react-dbt-dag');

export const Lineage = ({ dagNodes, currentNodeId }) => {
    if (!DagExports) {
        return <div>Lineage Not Available!</div>
    }

    return <DagExports.Dag 
        nodes={dagNodes}
        toolbarItems={[]}
        primaryNodeId={currentNodeId} />
}