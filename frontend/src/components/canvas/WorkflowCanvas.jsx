import { useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import 'reactflow/dist/style.css';

import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from '../nodes/CustomNodes';

// Registered all 5 nodes
const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

export const WorkflowCanvas = ({ workflow }) => {
  const reactFlowWrapper = useRef(null);
  
  // 🚀 ADDED: takeSnapshot, onNodesDelete, onEdgesDelete for Undo/Redo support
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, 
    takeSnapshot, onNodesDelete, onEdgesDelete 
  } = workflow;

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      // 🚀 Take a snapshot of the graph right before adding the new node
      takeSnapshot();

      const position = {
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      };

      // Enterprise UI default data
      const defaultData = {
        startNode: { title: 'Initialize Data', metadata: '' },
        taskNode: { title: 'Data Collection', description: '', assignee: '', dueDate: '', customFields: '' },
        approvalNode: { title: 'Data Validation', approverRole: '', threshold: 0 },
        automatedNode: { title: 'Action Trigger', actionId: '' },
        endNode: { title: 'Finalize', endMessage: 'Automation Complete', summaryFlag: false }
      };

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: defaultData[type] || {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, takeSnapshot]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete} // 🚀 ADDED: Captures history when you delete a node
          onEdgesDelete={onEdgesDelete} // 🚀 ADDED: Captures history when you delete an edge
          onInit={(instance) => instance.fitView()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#f1f5f9" gap={16} size={2} />
          <Controls />
          <MiniMap nodeStrokeColor="#e2e8f0" nodeColor="#ffffff" maskColor="rgba(248, 250, 252, 0.7)" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};