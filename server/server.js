const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const automations = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "update_db", label: "Update Employee Record", params: ["employee_id", "status"] }
];

// GET /automations
app.get("/automations", (req, res) => {
  setTimeout(() => {
    res.json(automations);
  }, 500);
});

// POST /simulate
app.post("/simulate", (req, res) => {
  const { nodes, edges } = req.body;

  // Validation
  if (!nodes || nodes.length === 0) {
    return res.status(400).json({ error: "Workflow cannot be empty." });
  }

  if ((!edges || edges.length === 0) && nodes.length > 1) {
    return res.status(400).json({ error: "Workflow must have connections between nodes." });
  }

  const startNode = nodes.find(n => n.type === "startNode");
  if (!startNode) {
    return res.status(400).json({ error: "Workflow must begin with a Start Node." });
  }

  // Execution
  const executionLog = [];
  let currentStep = 1;
  let currentNodeId = startNode.id;
  let visited = new Set();

  while (currentNodeId && !visited.has(currentNodeId)) {
    visited.add(currentNodeId);

    const node = nodes.find(n => n.id === currentNodeId);

    if (node) {
      let message = "";
      let status = "success";

      switch (node.type) {
        case "startNode":
          message = `Workflow started: ${node.data?.title || "Entry Point"}`;
          break;

        case "taskNode":
          message = `Task assigned to ${node.data?.assignee || "Unassigned"}`;
          status = "pending";
          break;

        case "approvalNode":
          message = `Approval required from ${node.data?.approverRole || "Management"}`;
          status = "waiting";
          break;

        case "automatedNode":
          message = `Automated action: ${node.data?.actionId || "System Event"}`;
          break;

        case "endNode":
          message = `Workflow ended: ${node.data?.endMessage || "Done"}`;
          break;

        default:
          message = `Executed ${node.type}`;
      }

      executionLog.push({
        step: currentStep++,
        nodeId: node.id,
        message,
        status
      });
    }

    const outgoingEdges = edges.filter(e => e.source === currentNodeId);

    if (outgoingEdges.length > 1) {
      executionLog.push({
        step: currentStep++,
        nodeId: currentNodeId,
        message: "Branch detected (taking first path)",
        status: "info"
      });
      currentNodeId = outgoingEdges[0].target;
    } else if (outgoingEdges.length === 1) {
      currentNodeId = outgoingEdges[0].target;
    } else {
      currentNodeId = null;
    }
  }

  if (currentNodeId && visited.has(currentNodeId)) {
    executionLog.push({
      step: currentStep++,
      nodeId: currentNodeId,
      message: "Cycle detected. Execution stopped.",
      status: "error"
    });
  }

  executionLog.push({
    step: currentStep++,
    nodeId: null,
    message: "Workflow execution completed.",
    status: "done"
  });

  setTimeout(() => {
    res.json({
      status: "completed",
      executionLog
    });
  }, 500);
});

app.listen(5000, () => {
  console.log("Mock API running on http://localhost:5000");
});