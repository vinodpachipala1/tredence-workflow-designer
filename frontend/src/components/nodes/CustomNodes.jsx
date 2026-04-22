import { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Base style mirroring the CodeAuto reference UI
const nodeStyle = {
  background: '#ffffff',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  minWidth: '240px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  fontFamily: '"Inter", sans-serif'
};

const Header = ({ title, icon, color }) => (
  <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ color, fontSize: '14px' }}>{icon}</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{title}</div>
  </div>
);

const Pill = ({ icon, text, color, bg }) => (
  <span style={{ backgroundColor: bg, color: color, padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
    {icon} {text}
  </span>
);

const handleStyle = { width: '8px', height: '8px', background: '#cbd5e1', border: '2px solid white' };

export const StartNode = memo(({ data, selected }) => (
  <div style={{ ...nodeStyle, outline: selected ? '2px solid #10b981' : 'none' }}>
    <Header title={data.title || 'Initialize Data'} icon="▶" color="#10b981" />
    <div style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>Workflow entry point.</div>
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

export const TaskNode = memo(({ data, selected }) => (
  <div style={{ ...nodeStyle, outline: selected ? '2px solid #3b82f6' : 'none' }}>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Header title={data.title || 'Data Collection'} icon="📅" color="#3b82f6" />
    <div style={{ padding: '12px' }}>
      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>{data.description || 'Gathering Data Connected'}</div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <Pill icon="👤" text={data.assignee || 'Unassigned'} color="#1d4ed8" bg="#dbeafe" />
        {data.dueDate && <Pill icon="⏱" text={data.dueDate} color="#b45309" bg="#fef3c7" />}
      </div>
    </div>
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

export const ApprovalNode = memo(({ data, selected }) => (
  <div style={{ ...nodeStyle, outline: selected ? '2px solid #f59e0b' : 'none' }}>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Header title={data.title || 'Data Validation'} icon="🛡️" color="#f59e0b" />
    <div style={{ padding: '12px' }}>
      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>Ensuring Data Accuracy</div>
      <Pill icon="⚖️" text={`Role: ${data.approverRole || 'Any'}`} color="#c2410c" bg="#ffedd5" />
    </div>
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

export const AutomatedNode = memo(({ data, selected }) => (
  <div style={{ ...nodeStyle, outline: selected ? '2px solid #8b5cf6' : 'none' }}>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Header title={data.title || 'Action Trigger'} icon="⚡" color="#8b5cf6" />
    <div style={{ padding: '12px' }}>
      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>Performing Tasks Conditions</div>
      <Pill icon="⚙️" text={data.actionId || 'Pending Action'} color="#6d28d9" bg="#ede9fe" />
    </div>
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

export const EndNode = memo(({ data, selected }) => (
  <div style={{ ...nodeStyle, outline: selected ? '2px solid #ef4444' : 'none' }}>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Header title="Finalize" icon="🏁" color="#ef4444" />
    <div style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>{data.endMessage || 'Automation Complete'}</div>
  </div>
));