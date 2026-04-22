import { useState, useEffect } from 'react';
import { NodeSchemas } from '../../config/nodeSchemas';
import apiClient from '../../api/client';

export const NodeConfigPanel = ({ selectedNode, updateNodeData }) => {
  const [automationOptions, setAutomationOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch automations from our Express backend if an Automated Node is selected
  useEffect(() => {
    if (selectedNode?.type === 'automatedNode') {
      setIsLoading(true);
      apiClient.get('/automations')
        .then(res => setAutomationOptions(res.data))
        .catch(err => console.error("Failed to fetch automations", err))
        .finally(() => setIsLoading(false));
    }
  }, [selectedNode?.type]);

  if (!selectedNode) {
    return (
      <div style={{ padding: '20px', color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
        Select a node on the canvas to configure its properties.
      </div>
    );
  }

  const schema = NodeSchemas[selectedNode.type];
  if (!schema) return <div style={{ padding: '20px' }}>No configuration available.</div>;

  // Handle standard input changes safely
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // CRITICAL: Checkboxes use 'checked' instead of 'value'
    const finalValue = type === 'checkbox' ? checked : value;
    updateNodeData(selectedNode.id, { [name]: finalValue });
  };

  // Find the selected automation object from the API to extract its dynamic params
  const selectedAutomation = automationOptions.find(opt => opt.id === selectedNode.data.actionId);

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px', fontFamily: '"Inter", sans-serif' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#334155' };

  return (
    <div style={{ padding: '20px' }}>
      
      {schema.map((field) => (
        <div key={field.name}>
          {field.type !== 'checkbox' && <label style={labelStyle}>{field.label}</label>}

          {/* 1. Standard Text Inputs */}
          {field.type === 'text' && (
            <input type="text" name={field.name} value={selectedNode.data[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} style={inputStyle} />
          )}

          {/* 2. Number Inputs (FIXED) */}
          {field.type === 'number' && (
            <input type="number" name={field.name} value={selectedNode.data[field.name] || ''} onChange={handleChange} style={inputStyle} />
          )}

          {/* 3. Date Inputs (FIXED) */}
          {field.type === 'date' && (
            <input type="date" name={field.name} value={selectedNode.data[field.name] || ''} onChange={handleChange} style={inputStyle} />
          )}

          {/* 4. Textarea Inputs (FIXED) */}
          {field.type === 'textarea' && (
            <textarea name={field.name} value={selectedNode.data[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} style={{...inputStyle, resize: 'vertical', minHeight: '60px'}} />
          )}

          {/* 5. Checkbox Inputs (FIXED) */}
          {field.type === 'checkbox' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', marginBottom: '15px', fontWeight: '500', cursor: 'pointer' }}>
              <input type="checkbox" name={field.name} checked={!!selectedNode.data[field.name]} onChange={handleChange} style={{ cursor: 'pointer' }} />
              {field.label}
            </label>
          )}

          {/* 6. Static Select */}
          {field.type === 'select' && (
            <select name={field.name} value={selectedNode.data[field.name] || ''} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select {field.label.toLowerCase()}...</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          )}

          {/* 7. Async Select (Mock API Integration) */}
          {field.type === 'asyncSelect' && (
            <select name={field.name} value={selectedNode.data[field.name] || ''} onChange={handleChange} style={inputStyle} disabled={isLoading}>
              <option value="" disabled>{isLoading ? 'Loading actions...' : 'Select an action...'}</option>
              {automationOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* 🚀 ELITE FEATURE: DYNAMIC PARAMS RENDERING */}
      {/* If the user selected an action, and that action has required params, generate the inputs! */}
      {selectedAutomation && selectedAutomation.params && selectedAutomation.params.length > 0 && (
        <div style={{ marginTop: '5px', padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '10px' }}>
            Required Action Parameters
          </div>
          
          {selectedAutomation.params.map(param => (
            <div key={param}>
              <label style={labelStyle}>{param} <span style={{color: '#ef4444'}}>*</span></label>
              <input
                type="text"
                name={`param_${param}`}
                value={selectedNode.data[`param_${param}`] || ''}
                onChange={handleChange}
                placeholder={`Enter ${param}...`}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};