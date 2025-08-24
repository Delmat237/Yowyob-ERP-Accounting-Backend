# RT-COmOps (Frontend)

Built with [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/). 
The UI components are built using [Shadcn/UI](https://ui.shadcn.com/).

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) 14 (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Fetching:** Native `fetch` API
-   **Mock API (Development):** [json-server](https://github.com/typicode/json-server)
-   **Backend:** A separate Spring Boot & ScyllaDB backend.


## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   [npm](https://www.npmjs.com/) as your package manager.
-   A running instance of the **ComOps Backend API**. By default, the frontend expects the backend to be running on `http://localhost:8080`.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/IgorGreenIGM/RT-ComOps.git
cd RT-ComOps
git checkout ksm-frontend
```

### 2. Install Dependencies

Install the project dependencies using your preferred package manager:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will now be running and accessible at [http://localhost:3000](http://localhost:3000). Any changes you make to the source code will be automatically reflected in the browser.

## Project Structure

The project follows the standard Next.js App Router structure:

-   **/app:** Contains all the routes, pages, and layouts.
    -   **`/(dashboard)`:** Route group for all authenticated pages (dashboard, sales, stock, etc.).
    -   **`layout.tsx`:** The main root layout.
    -   **`page.tsx`:** The landing page.
-   **/components:** Contains all the UI components, organized by feature.
    -   **/ui:** Reusable, low-level components from Shadcn/UI (Button, Card, etc.).
    -   **/layout:** Components related to the main application layout (Header, Sidebar).
    -   **/landing:** Components for the public landing page.
    -   **`/customers`, `/products`, etc.:** Feature-specific components.
-   **/lib:** Utility functions, API communication logic.
    -   **`api.ts`:** Centralized functions for making requests to the backend API.
    -   **`utils.ts`:** General utility functions (like `cn` for class names).
-   **/hooks:** Custom React hooks for state management (e.g., `useSidebar.ts`).
-   **/public:** Static assets like images and fonts.
-   **/types:** TypeScript type definitions for the application's data structures.