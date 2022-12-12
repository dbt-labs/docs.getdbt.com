import React from 'react'

import('@dbt-labs/react-dbt-dag/dag.css');
import('@dbt-labs/react-dbt-dag/dag.standalone.css');

/** As a private package, not every devleoper will have access to this repo. */
const DagExports = import('@dbt-labs/react-dbt-dag');

let Dag = null;

DagExports.then((resolved) => {
    Dag = resolved.Dag;
});

export const Lineage = ({ dagNodes, currentNodeId }) => {
    if (!Dag) {
        return <div>Lineage Not Available!</div>
    }

    return <Dag 
        nodes={dagNodes}
        toolbarItems={[]}
        primaryNodeId={currentNodeId} />
}