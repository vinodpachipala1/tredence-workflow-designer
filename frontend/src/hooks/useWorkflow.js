import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import apiClient from '../api/client';
import { serializeWorkflow } from '../utils/transformers';

export const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const selectedNode = nodes.find(node => node.selected) || null;
  
  const [executionLog, setExecutionLog] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // --- UNDO / REDO STATE ---
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Save the current graph state before making a change
  const takeSnapshot = useCallback(() => {
    setPast((p) => [...p, { nodes, edges }]);
    setFuture([]); // Clear redo history on new action
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setFuture((f) => [{ nodes, edges }, ...f]); // Save current to future
    
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
  }, [past, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const nextState = future[0];
    const newFuture = future.slice(1);
    
    setPast((p) => [...p, { nodes, edges }]); // Save current to past
    setFuture(newFuture);
    
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  }, [future, nodes, edges, setNodes, setEdges]);

  // --- WRAPPED MUTATIONS (To capture history) ---
  const onConnect = useCallback((params) => {
    takeSnapshot();
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges, takeSnapshot]);

  const updateNodeData = useCallback((nodeId, newData) => {
    takeSnapshot();
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, ...newData } };
      }
      return node;
    }));
  }, [setNodes, takeSnapshot]);

  // Delete handlers to capture history before a node/edge is removed
  const onNodesDelete = useCallback(() => takeSnapshot(), [takeSnapshot]);
  const onEdgesDelete = useCallback(() => takeSnapshot(), [takeSnapshot]);

  const simulateWorkflow = async () => {
    setIsSimulating(true);
    setExecutionLog(null);
    try {
      const payload = serializeWorkflow(nodes, edges);
      const response = await apiClient.post('/simulate', payload);
      setExecutionLog(response.data.executionLog);
    } catch (error) {
      setExecutionLog([{ 
        step: 0, nodeId: null, status: "error",
        message: error.response?.data?.error || "Simulation failed."
      }]);
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    nodes, setNodes, onNodesChange, onNodesDelete,
    edges, setEdges, onEdgesChange, onConnect, onEdgesDelete,
    selectedNode, updateNodeData,
    simulateWorkflow, executionLog, isSimulating,
    undo, redo, canUndo: past.length > 0, canRedo: future.length > 0,
    takeSnapshot // Expose so Canvas can snapshot on drop
  };
};