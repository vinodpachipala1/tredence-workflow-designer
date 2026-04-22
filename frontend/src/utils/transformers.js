export const serializeWorkflow = (reactFlowNodes, reactFlowEdges) => {
  return {
    nodes: reactFlowNodes.map(node => ({
      id: node.id,
      type: node.type,
      data: node.data // Only send business logic data
    })),
    edges: reactFlowEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target
    }))
  };
};