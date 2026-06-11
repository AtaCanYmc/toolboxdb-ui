# ToolboxDB UI - Smart Electronics Inventory Dashboard

ToolboxDB UI is a highly modern, professional, and responsive Single Page Application (SPA) dashboard designed to manage an AI-Powered Smart Electronics Inventory & IoT Component Tracker. It connects to a FastAPI backend to provide seamless inventory tracking, AI-powered invoice processing, and creative project suggestions.

## ✨ Features

- **Dashboard Overview**: High-level metrics showing total unique components, active categories, and a recent activity feed with color-coded low-stock warnings.
- **AI-Powered Invoice Processing**: Drag-and-drop file upload zone for PDF invoices. Features a side-by-side split view simulating PDF metadata while providing an editable dynamic form table populated by AI-extracted components.
- **Inventory & Component Management**: A clean, responsive data table presenting current stock levels, categories, and creation dates fetched directly from the backend.
- **AI Project Suggestion Hub**: A dedicated creative zone where users can provide available components, difficulty level, and custom prompts to generate step-by-step project recipe cards (including missing vs. available parts breakdown).

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: ESLint, Prettier, Husky (Pre-commit hooks), and lint-staged.

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and npm installed on your machine.
Ensure the FastAPI backend server (`ToolboxDB API`) is running locally or remotely.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure your backend API base URL:

```env
VITE_BACKEND_BASE_URL=http://127.0.0.1:8000/api/v1
```

*(Ensure your backend is configured with CORS allowing `http://localhost:5173` if running locally.)*

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and bundles the application for production.
- `npm run lint`: Runs ESLint to catch and fix code quality issues.
- `npm run preview`: Bootstraps a local web server to preview the production build.

## 🛡️ Pre-commit Hooks

This project uses **Husky** and **lint-staged** to enforce code quality. Before every commit, modified `.ts` and `.tsx` files are automatically linted (`eslint --fix`). If linting fails, the commit will be aborted.
