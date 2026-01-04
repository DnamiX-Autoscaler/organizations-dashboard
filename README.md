# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Organizations Dashboard

A React-based dashboard application built with **Vite**, **Tailwind CSS**, and **Recharts**.  
This project provides fast development, hot-module reload, and an optimized production build.

---

## 🛠 Tech Stack

- **React 19**
- **Vite 7**
- **Tailwind CSS 3**
- **Recharts**
- **jsPDF & jsPDF-autotable**
- **Iconify**

---

## 📦 Prerequisites

Make sure you have the following installed:

- **Node.js (v18 or later recommended)**
- **npm** (comes bundled with Node.js)

Check versions:

node -v
npm -v


# Getting Started

1️⃣ Clone the Repository

git clone <your-repo-url>
cd organizations-dashboard

2️⃣ Install Dependencies

npm install

# Run in Development Mode

### Start the local development server:

npm run dev

### Then open the URL displayed in your terminal (usually):

http://localhost:5173

# Build for Production

### Create an optimized production build:

npm run build

### Preview the production build locally:

npm run preview

# Linting

### To run ESLint:

npm run lint

# Notes

This project uses Vite for lightning-fast development.
Tailwind CSS is already configured.
Hot Module Reloading (HMR) is enabled.
