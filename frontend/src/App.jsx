import { Play, Calendar, Shield, Zap, Flag, Undo2, Redo2 } from 'lucide-react';
import { useWorkflow } from './hooks/useWorkflow';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeConfigPanel } from './components/forms/NodeConfigPanel';
import { Sandbox } from './components/layout/Sandbox';

function App() {
  const workflow = useWorkflow();

  const nodeTypes = [
    { type: 'startNode', label: 'Start Initialization', desc: 'Entry point', icon: <Play size={16} color="#ef4444" /> },
    { type: 'taskNode', label: 'Data Collection', desc: 'Human task', icon: <Calendar size={16} color="#3b82f6" /> },
    { type: 'approvalNode', label: 'Data Validation', desc: 'Approval step', icon: <Shield size={16} color="#f59e0b" /> },
    { type: 'automatedNode', label: 'Action Trigger', desc: 'System event', icon: <Zap size={16} color="#8b5cf6" /> },
    { type: 'endNode', label: 'Action Completion', desc: 'Workflow end', icon: <Flag size={16} color="#10b981" /> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', margin: 0, overflow: 'hidden', fontFamily: '"Inter", sans-serif', backgroundColor: '#f8fafc' }}>

      {/* Left Sidebar (Mimicking CodeAuto Nav) */}
      <aside style={{ width: '220px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '16px', color: '#ef4444', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>C</div> CodeAuto
        </div>
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '15px' }}>Resources (Drag to Canvas)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nodeTypes.map(({ type, label, icon }) => (
              <div
                key={type} draggable onDragStart={(e) => e.dataTransfer.setData('application/reactflow', type)}
                style={{ padding: '10px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '500', color: '#334155' }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>

        {/* Top Header */}
        <header style={{ height: '60px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '8px', position: 'absolute', left: '20px' }}>
            
            {/* Working Undo Button */}
            <button 
              onClick={workflow.undo}
              disabled={!workflow.canUndo}
              style={{ 
                backgroundColor: workflow.canUndo ? '#ffffff' : '#f8fafc', 
                border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px', 
                cursor: workflow.canUndo ? 'pointer' : 'not-allowed', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: workflow.canUndo ? 1 : 0.4,
                transition: 'all 0.2s'
              }}
            >
              <Undo2 size={14} stroke="#64748b" strokeWidth="2.5" />
            </button>

            {/* Working Redo Button */}
            <button 
              onClick={workflow.redo}
              disabled={!workflow.canRedo}
              style={{ 
                backgroundColor: workflow.canRedo ? '#ffffff' : '#f8fafc', 
                border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px', 
                cursor: workflow.canRedo ? 'pointer' : 'not-allowed', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: workflow.canRedo ? 1 : 0.4,
                transition: 'all 0.2s'
              }}
            >
              <Redo2 size={14} stroke="#64748b" strokeWidth="2.5" />
            </button>

          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '14px', margin: 0, color: '#0f172a' }}>User Automation</h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Overview of User Workflows.</span>
          </div>
        </header>

        {/* Main Canvas */}
        <main style={{ flexGrow: 1, position: 'relative' }}>
          <WorkflowCanvas workflow={workflow} />
        </main>
      </div>

      {/* Right Sidebar (Mimicking CodeAuto "Flow Objectives" & config) */}
      <aside style={{ width: '320px', backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>
          Node Configuration
        </div>
        <div style={{ flex: 1, overflowY: 'auto', borderBottom: '4px solid #f1f5f9' }}>
          <NodeConfigPanel selectedNode={workflow.selectedNode} updateNodeData={workflow.updateNodeData} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#ffffff' }}>
          <Sandbox workflow={workflow} />
        </div>
      </aside>
    </div>
  );
}

export default App;