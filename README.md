# GCF Refresh 2026

This is the Payload CMS + Next.js website rebuild for GCF.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the database (Docker):**
    ```bash
    npm run db:start
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

## Project Structure

-   `src/app`: Next.js App Router pages
-   `src/collections`: Payload CMS Collections (Projects, Pages, etc.)
-   `src/components`: React components (WorkSection, etc.)
-   `src/payload.config.ts`: Main CMS configuration
