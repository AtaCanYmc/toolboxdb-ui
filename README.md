<div align="center">
  <h1>🧰 ToolboxDB UI</h1>
  <p><strong>Smart Electronics Inventory Dashboard & AI Hardware Consultant</strong></p>

  <!-- Badges -->
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-Strict-4B32C3?style=for-the-badge&logo=eslint" alt="ESLint" /></a>
</div>

---

**ToolboxDB UI** is a highly modern, professional, and responsive Single Page Application (SPA) dashboard designed to manage an **AI-Powered Smart Electronics Inventory & IoT Component Tracker**. It connects to a FastAPI backend to provide seamless inventory tracking, AI-powered invoice processing, and creative project suggestions via a conversational agent.

## ✨ Features

- 📊 **Dashboard Overview**
  High-level metrics showing total unique components, active categories, and a recent activity feed with color-coded low-stock warnings.

- 📄 **AI-Powered Invoice Processing**
  Drag-and-drop file upload zone for PDF invoices. Features a side-by-side split view simulating PDF metadata while providing an editable dynamic form table populated by AI-extracted components.

- 📦 **Inventory & Component Management**
  A clean, responsive data table presenting current stock levels, categories, and creation dates fetched directly from the backend.

- 🤖 **Hardware Consultant Agent (Chat)**
  A modern, markdown-supported conversational interface powered by LangGraph. Instead of a static form, users chat with an AI assistant that dynamically searches active inventory, fetches live market prices from electronics stores, optimizes shipping carts, and provides step-by-step project code snippets. Includes a stateless memory approach utilizing `sessionStorage`.

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Code Quality**| ESLint, Prettier, Husky (Pre-commit hooks), lint-staged |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn` installed on your machine.
- The **ToolboxDB API** (FastAPI backend server) running locally or remotely.

### Installation

1. **Clone the repository** and navigate to the project directory:
   ```bash
   git clone <REPO_URL> toolboxdb-ui
   cd toolboxdb-ui
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and configure your backend API base URL:

```env
VITE_BACKEND_BASE_URL=http://127.0.0.1:8000/api/v1
```

> **Note**: Ensure your backend is configured with CORS allowing `http://localhost:5173` if running locally.

### Running the Application

To start the Vite development server:

```bash
npm run dev
```

Your application will be up and running at [http://localhost:5173](http://localhost:5173).

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and bundles the application for production. |
| `npm run lint` | Runs ESLint to catch and fix code quality issues. |
| `npm run preview` | Bootstraps a local web server to preview the production build. |

## 🛡️ Pre-commit Hooks

This project enforces code quality right from your local machine using **Husky** and **lint-staged**.
Before every commit, any modified `.ts` and `.tsx` files are automatically linted using `eslint --fix`. If the linting fails, the commit will be safely aborted, preventing bad code from entering the repository.

---
<div align="center">
  <i>Built with ❤️ for Makers and IoT Developers</i>
</div>
