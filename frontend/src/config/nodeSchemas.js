export const NodeSchemas = {
  startNode: [
    { name: 'title', label: 'Start Title', type: 'text', placeholder: 'e.g., Onboarding Start' },
    { name: 'metadata', label: 'Optional Metadata (JSON)', type: 'textarea', placeholder: '{"dept": "Engineering"}' }
  ],
  taskNode: [
    { name: 'title', label: 'Task Title (Required)', type: 'text', placeholder: 'e.g., Collect ID' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'assignee', label: 'Assignee', type: 'text' },
    { name: 'dueDate', label: 'Due Date', type: 'date' },
    { name: 'customFields', label: 'Custom Fields (JSON)', type: 'textarea' }
  ],
  approvalNode: [
    { name: 'title', label: 'Approval Step', type: 'text' },
    { name: 'approverRole', label: 'Approver Role', type: 'select', options: ['Manager', 'HRBP', 'Director'] },
    { name: 'threshold', label: 'Auto-approve Threshold', type: 'number' }
  ],
  automatedNode: [
    { name: 'title', label: 'Action Title', type: 'text' },
    { name: 'actionId', label: 'System Action', type: 'asyncSelect' }
  ],
  endNode: [
    { name: 'endMessage', label: 'End Message', type: 'text', placeholder: 'Workflow Complete' },
    { name: 'summaryFlag', label: 'Generate Summary', type: 'checkbox' }
  ]
};