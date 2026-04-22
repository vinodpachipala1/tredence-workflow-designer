# CodeAuto: HR Workflow Designer (Tredence Case Study)

A scalable, React-based workflow builder prototype designed for HR automation. This project was developed as a case study for the Tredence AI Agent Engineering role, focusing on architectural clarity, dynamic form generation, and clean API separation.

## 🚀 Quick Start

This project is separated into a Vite/React frontend and a lightweight Express mock server to demonstrate clean API decoupling.

**Terminal 1: Start the Mock API**
\`\`\`bash
cd mock-server
npm install
node server.js
# Runs on http://localhost:5000
\`\`\`

**Terminal 2: Start the Frontend**
\`\`\`bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
\`\`\`

## 🏗️ Architectural Highlights

To ensure scalability and maintainability, several enterprise-grade patterns were implemented:

### Frontend (React + React Flow)
* **Metadata-Driven UI (Config-Driven Forms):** The right-hand configuration panel does not rely on hardcoded `if/else` component rendering. Instead, it generates form inputs dynamically based on schema definitions (`src/config/nodeSchemas.js`). This makes adding new node types trivial and scalable.
* **Dynamic Action Parameters:** When an "Action Trigger" is selected, the UI parses the API response and dynamically generates the exact required input fields (e.g., swapping between `to`/`subject` for emails, or `employee_id`/`status` for database updates).
* **Single Source of Truth:** Eliminated typing focus bugs (React race conditions) by deriving the `selectedNode` directly from the React Flow `nodes` array rather than maintaining a redundant, parallel `useState`.
* **Strict Serialization Layer:** React Flow nodes contain heavy visual metadata (X/Y coordinates, dragging state). The `serializeWorkflow` utility strips this away, ensuring the frontend only sends clean, business-logic payloads to the backend.

### Backend (Express Mock API)
* **Graph Traversal & Business Logic:** The `POST /simulate` endpoint doesn't just return static text; it executes a true Path-Following algorithm to traverse the submitted Directed Acyclic Graph (DAG) step-by-step.
* **Cycle Detection:** Implemented a `visited` Set during traversal to prevent infinite execution loops if a user accidentally connects a workflow end-to-end.
* **Robust Validation:** Safely rejects empty workflows, disconnected nodes, and workflows missing a designated `startNode`.

## ✨ Bonus Features Implemented
* **History Stack (Undo/Redo):** Implemented a custom snapshot architecture inside the `useWorkflow` hook to track `past` and `future` states, allowing full Undo/Redo capabilities for node drops, deletions, edge connections, and text edits.
* **Enterprise UI Polish:** Replicated the "CodeAuto" reference UI, utilizing clean inline SVGs, contextual navigation sidebars, and styled interactive nodes with dynamic status pills.

## 🔮 Future Improvements (With More Time)
* **Database Persistence:** Swap the in-memory arrays for a PostgreSQL/Prisma backend to save workflow definitions across sessions.
* **Branching UI:** Add conditional edge types to visually map out "Approved" vs "Rejected" paths from the Approval Gate node.
* **Canvas Minimap & Auto-Layout:** Implement Dagre.js to automatically organize messy graphs into clean, top-down tree structures.