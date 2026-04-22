# CodeAuto: HR Workflow Designer (Tredence Case Study)

A scalable, React-based workflow builder prototype designed for HR automation. This project was developed as a case study for the Tredence AI Agent Engineering role, focusing on architectural clarity, dynamic form generation, and clean API separation.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), React Flow, Lucide React (Icons), Axios, UUID
* **Backend:** Node.js, Express.js, CORS
* **State Management:** Custom React Hooks (`useWorkflow`)
* **Styling:** CSS (Inline / Custom Enterprise UI)

---

## ✨ Core Features
* **Interactive Canvas:** Drag-and-drop workflow builder supporting 5 distinct node types (Start, Task, Approval, Automated Step, End).
* **Metadata-Driven Forms:** Context-aware right-hand panel that dynamically renders specific input fields based on the selected node type using a configuration schema.
* **Dynamic API Integration:** "Automated Step" nodes fetch available actions from the backend and dynamically render exact required parameters (e.g., swapping `to`/`subject` for emails).
* **Workflow Simulation:** Serializes the graph into a clean JSON payload, sends it to the mock Express API, and returns a step-by-step execution log rendered in the Sandbox panel.
* **Undo/Redo History:** Custom history stack tracking graph mutations for a seamless user experience, complete with UI controls.

---

## 🚀 Quick Start

This project is separated into a Vite/React frontend and a lightweight Express mock server to demonstrate clean API decoupling.

### 1. Start the Mock API
Open a terminal and navigate to the backend directory:
```bash
cd mock-server
npm install
node server.js
```
*(The server will run on http://localhost:5000)*

### 2. Start the Frontend
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*(The application will run on http://localhost:5173)*

---

## 🏗️ Architectural Highlights

To ensure scalability and maintainability, several enterprise-grade patterns were implemented:

### Frontend (React + React Flow)
* **Config-Driven UI:** The right-hand configuration panel does not rely on hardcoded component rendering. Instead, it generates form inputs dynamically based on schema definitions (`src/config/nodeSchemas.js`). This makes adding new node types trivial and scalable.
* **Single Source of Truth:** Eliminated typing focus bugs by deriving the `selectedNode` directly from the React Flow `nodes` array rather than maintaining a redundant, parallel state.
* **Strict Serialization Layer:** React Flow nodes contain heavy visual metadata (X/Y coordinates, dragging state). The `serializeWorkflow` utility strips this away, ensuring the frontend only sends clean, business-logic payloads to the backend.

### Backend (Express Mock API)
* **Graph Traversal & Business Logic:** The `POST /simulate` endpoint executes a graph traversal (path-following) to evaluate the submitted graph-based workflow step-by-step.
* **Cycle Detection:** Implemented a `visited` Set during traversal to prevent infinite execution loops if a user accidentally connects a workflow end-to-end.
* **Robust Validation:** Safely rejects empty workflows, disconnected nodes, and workflows missing a designated `startNode`.