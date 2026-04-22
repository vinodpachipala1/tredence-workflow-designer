import { CheckCircle2, Clock, XCircle, Info, Flag, Circle } from 'lucide-react';

export const Sandbox = ({ workflow }) => {
  const { simulateWorkflow, executionLog, isSimulating } = workflow;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle2 size={16} color="#10b981" />;
      case 'pending': case 'waiting': return <Clock size={16} color="#f59e0b" />;
      case 'error': return <XCircle size={16} color="#ef4444" />;
      case 'info': return <Info size={16} color="#3b82f6" />;
      case 'done': return <Flag size={16} color="#8b5cf6" />;
      default: return <Circle size={16} color="#94a3b8" />;
    }
  };

  return (
    <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>Execution Logs</h3>
        <button
          onClick={simulateWorkflow}
          disabled={isSimulating}
          style={{
            padding: '6px 12px', backgroundColor: isSimulating ? '#94a3b8' : '#2563eb', color: 'white',
            border: 'none', borderRadius: '6px', cursor: isSimulating ? 'not-allowed' : 'pointer',
            fontWeight: '600', fontSize: '12px', transition: 'background 0.2s', display: 'flex', gap: '6px', alignItems: 'center'
          }}
        >
          {isSimulating ? 'Running...' : '▶ Run Test'}
        </button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {!executionLog && (
          <div style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', marginTop: '40px', padding: '20px', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
            Graph is empty or not simulated yet. Click "Run Test" to validate workflow against backend.
          </div>
        )}

        {executionLog && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {executionLog.map((log, index) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'flex-start', padding: '12px',
                backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}>
                <div style={{ marginRight: '12px', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(log.status)}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    Step {log.step}
                  </div>
                  <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                    {log.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};