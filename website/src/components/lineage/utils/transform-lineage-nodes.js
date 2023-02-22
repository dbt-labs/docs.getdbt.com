/**
 * The manifest represents nodes in one format,
 * while the DAG expects nodes in
 * [another format](https://github.com/dbt-labs/react-dbt-dag/blob/main/src/dag/InternalDagInterfaces.ts#L34-L48).
 */
export const transformLineageNodes = (nodes) => {
    const dagNodes = Object.entries(nodes || {}).map(([nodeId, node]) => {
        return {
            id: nodeId,
            parents: node.depends_on?.nodes || [],
            label: node.name,
            resourceType: node.resource_type,
            data: {
                package_name: node.package_name,
                resource_type: node.resource_type,
                node_name: nodeId,
                file_name: node.name,
            },
        }
    });

    return dagNodes;
}