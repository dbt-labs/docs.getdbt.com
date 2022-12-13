import React from 'react'

let Dag = null;

try {
    /** As a private package, not every developer will have access to this repo. */
    const DagImport = require('@dbt-labs/react-dbt-dag');
    require('@dbt-labs/react-dbt-dag/dag.css');
    require('@dbt-labs/react-dbt-dag/dag.standalone.css');

    Dag = DagImport.Dag;
} catch (err) {
    /**
     * react-dbt-dag is a private repo. Not all developers of the
     * open source docs will have access to this repo.
     */
}

/**
 * This can be used to hide the lineage button or
 * for whatever purpose makes sense!
 * 
 * Currently, this function is unused.
 */
export const canShowLineage = () => Dag !== null;

export const Lineage = ({ dagNodes, currentNodeId, onNodeSelect }) => {
    if (!Dag) {
        return <div>Lineage Not Available!</div>
    }

    return <Dag 
        nodes={dagNodes}
        primaryNodeId={currentNodeId}
        onNodeInteraction={({ targetNode }) => {
            onNodeSelect(targetNode)
        }} />
}