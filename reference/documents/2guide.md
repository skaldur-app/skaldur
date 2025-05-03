# Skaldur Implementation Guide

## Implementation Approach

This guide provides a step-by-step plan for developing the Skaldur application, following the established blueprint and file architecture. It breaks the process into logical phases, starting with project initialization and configuration, moving through backend API development, state management setup, frontend UI construction, feature integration, testing, and finally deployment. Each step lists the specific files to create or modify in a recommended sequence, ensuring a structured development workflow.

**Phase 1: Project Setup & Core Configuration**

1.  **Initialize Next.js Project:** Use `create-next-app` with options for TypeScript, Tailwind CSS, ESLint, and App Router.
    *   Creates: Base project files (`package.json`, `next.config.mjs`, `tsconfig.json`, `app/`, `public/`, etc.).
2.  **Setup Git & Ignore:** Initialize Git repository.
    *   Create: `.gitignore` (Add `.env.local`, `.env.production`, `node_modules/`, `.next/`, `*.log`).
3.  **Configure ESLint:** Define linting rules.
    *   Create/Modify: `.eslintrc.json` (Extend `eslint-config-next/core-web-vitals`, add TypeScript/React rules).
    *   Create: `.eslintignore` (Ignore build outputs, config files).
4.  **Configure Prettier:** Define formatting rules.
    *   Create: `.prettierrc.json` (Set rules like `semi`, `singleQuote`, `tabWidth`, `printWidth`).
    *   Create: `.prettierignore` (Ignore `package-lock.json`, build outputs).
5.  **Configure Tailwind CSS:** Set up Tailwind.
    *   Create/Modify: `tailwind.config.ts` (Configure `content` paths for `app/` and `components/`, potentially theme extensions).
    *   Create/Modify: `postcss.config.js` (Ensure `tailwindcss`, `autoprefixer` plugins).
    *   Modify: `app/globals.css` (Add `@tailwind base`, `@tailwind components`, `@tailwind utilities`).
6.  **Initialize Shadcn/ui:** Set up the component library.
    *   Run: `npx shadcn-ui@latest init`.
    *   Creates/Modifies: `components.json`, `lib/utils.ts`, potentially updates `globals.css`, `tailwind.config.ts`.
7.  **Setup Environment Variables:** Define structure.
    *   Create: `.env.example` (List required vars like `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` with placeholders).
    *   Create: `.env.local` (Add actual dev keys - DO NOT COMMIT).
8.  **Initialize Documentation:** Create basic docs.
    *   Create/Modify: `README.md` (Project title, overview, setup).
    *   Create: `docs/` directory.
    *   Create: `docs/SETUP_GUIDE.md`.
    *   Create: `docs/ARCHITECTURE.md` (Placeholder).
    *   Create: `docs/API_GUIDE.md` (Placeholder).
9.  **Setup Basic CI Workflow:** Initialize CI pipeline.
    *   Create: `.github/` directory.
    *   Create: `.github/workflows/` directory.
    *   Create: `.github/workflows/ci.yml` (Basic workflow: checkout, setup node, install deps, lint).

**Phase 2: Core Types & Constants**

1.  **Create Types Directory & Index:** Centralize type definitions.
    *   Create: `types/` directory.
    *   Create: `types/index.ts` (For re-exporting types).
2.  **Define Utility Types:** Create reusable type helpers.
    *   Create: `types/utility.ts`.
3.  **Define Session Types:** Model session-related data structures.
    *   Create: `types/session.ts` (Interfaces: `SessionMetadata`, `SessionDetails`, `Message`, `LockedSettings`, `InteractionLLMSettings`, `DestinationLLMSettings`).
4.  **Define Config Types:** Model configuration data structures.
    *   Create: `types/config.ts` (Interfaces: `ImprovementTypePublic`, `LLMOption`, `LLMOptionGroup`, `ImprovementOptionsResponse`). Also include backend-only `ImprovementType` definition.
5.  **Define API Types:** Model API request/response payloads.
    *   Create: `types/api.ts` (Interfaces: `ImprovePromptRequest`, `ImprovePromptResponse`, `NameSessionRequest`, `NameSessionResponse`).
6.  **Define Environment Types:** Type definitions for environment variables.
    *   Create: `types/environment.d.ts` (Declare types for `process.env`).
7.  **Create Constants Directory:** Centralize constant values.
    *   Create: `constants/` directory.
8.  **Define Default Constants:** Set default application values.
    *   Create: `constants/defaults.ts` (e.g., `DEFAULT_TEMPERATURE`).
9.  **Define LLM Provider Constants:** Standardize provider identifiers.
    *   Create: `constants/llm-providers.ts`.
10. **Define Storage Key Constants:** Define keys for Local Storage.
    *   Create: `constants/storage-keys.ts`.

**Phase 3: Backend API Implementation**

1.  **Create Backend Config Files:** Store dynamic option data.
    *   Create: `config/` directory.
    *   Create: `config/improvement-options.json` (Populate with `ImprovementType` definitions, including backend fields).
    *   Create: `config/llm-options.json` (Populate with `interactionLlmOptions` and `destinationLlmOptions`).
2.  **Create Validation Utilities:** Implement API input validation.
    *   Create: `lib/` directory (if not already present).
    *   Create: `lib/validation.ts` (Define Zod schemas or validation functions for API requests).
3.  **Create Server-Side LLM Utilities:** Abstract LLM API interactions.
    *   Create: `lib/llm-utils.server.ts` (Functions to call external LLMs securely using env vars).
4.  **Implement Config API Route:** Endpoint to serve frontend options.
    *   Create: `app/api/` directory.
    *   Create: `app/api/config/` directory.
    *   Create: `app/api/config/improvement-options/` directory.
    *   Create: `app/api/config/improvement-options/route.ts` (Implement GET handler to read JSON configs and return `ImprovementOptionsResponse`).
5.  **Implement Improve API Route:** Endpoint for prompt refinement.
    *   Create: `app/api/improve/` directory.
    *   Create: `app/api/improve/route.ts` (Implement POST handler: validate request, construct meta-prompt using config/context, call LLM via `llm-utils.server.ts`, return `ImprovePromptResponse`).
6.  **Implement Name Session API Route:** Endpoint for auto-naming.
    *   Create: `app/api/name-session/` directory.
    *   Create: `app/api/name-session/route.ts` (Implement POST handler: validate request, construct naming prompt, call LLM via `llm-utils.server.ts`, return `NameSessionResponse`).

**Phase 4: State Management Setup (Zustand)**

1.  **Install Zustand:** Add dependency (`npm install zustand` or `yarn add zustand`).
2.  **Create Store Directory:** Organize state management files.
    *   Create: `store/` directory.
3.  **Create UI Slice:** Define state and actions for UI elements.
    *   Create: `store/ui-slice.ts` (State: sidebar visibility, modals, loading. Actions: toggles, setters).
4.  **Create Config Slice:** Define state and actions for fetched config.
    *   Create: `store/config-slice.ts` (State: improvement types, styles, LLM options, loading/error. Actions: setter).
5.  **Create Session Slice:** Define state and actions for session data.
    *   Create: `store/session-slice.ts` (State: `sessions`, `sessionDetails`, `activeSessionUUID`. Actions: CRUD, locking. Implement `persist` middleware here).
6.  **Create Store Index:** Combine slices and export store hook.
    *   Create: `store/index.ts` (Combine slices using slice pattern, export `useStore`).

**Phase 5: Frontend Core Layout & UI Primitives**

1.  **Setup Root Layout:** Define base HTML structure.
    *   Modify: `app/layout.tsx` (Setup `<html>`, `<body>`, apply global styles/fonts).
2.  **Create Main App Layout:** Define structure for the core app view.
    *   Create: `app/(main)/` directory.
    *   Create: `app/(main)/layout.tsx` (Render sidebars and `{children}`).
3.  **Create Main App Page:** Entry point for the main UI.
    *   Create: `app/(main)/page.tsx` (Initial structure, mark as `'use client'`).
4.  **Add UI Primitives:** Install required Shadcn/ui components.
    *   Run: `npx shadcn-ui@latest add [component-name]` for `button`, `sheet`, `dialog`, `dropdown-menu`, `textarea`, `input`, `select`, `scroll-area`, `separator`, `tooltip`, `label`.
    *   Creates: Files in `components/ui/`.
5.  **Add Custom Fonts (Optional):** Define and import custom fonts.
    *   Create: `styles/` directory (if needed).
    *   Create: `styles/fonts.css`.
    *   Modify: `app/layout.tsx` to import fonts.
6.  **Add Favicon & Icons:** Replace default assets.
    *   Modify: `app/favicon.ico`.
    *   Create: `public/` directory (if needed).
    *   Create: `public/icons/` directory (add static icons).

**Phase 6: Feature Implementation - UI Components**

1.  **Create Layout Components Directory:** Organize layout components.
    *   Create: `components/layout/` directory.
2.  **Implement Session Sidebar:** Create left sidebar UI.
    *   Create: `components/layout/SessionSidebar.tsx` (Use `Sheet`, render list, "+" button).
3.  **Implement Config Sidebar:** Create right sidebar UI.
    *   Create: `components/layout/ConfigSidebar.tsx` (Use `Sheet`, render config/display, fork button).
4.  **Implement App Layout Client Wrapper (Optional):** Client boundary for layout state.
    *   Create: `components/layout/AppLayoutClient.tsx`.
5.  **Create Feature Components Directory:** Organize feature-specific components.
    *   Create: `components/feature/` directory.
6.  **Implement Session List Item:** Component for session list entries.
    *   Create: `components/feature/SessionListItem.tsx`.
7.  **Implement Chat Message:** Component for chat bubbles.
    *   Create: `components/feature/ChatMessage.tsx`.
8.  **Implement History Display:** Component for scrollable chat history.
    *   Create: `components/feature/HistoryDisplay.tsx` (Use `ScrollArea`).
9.  **Implement LLM Configuration:** Reusable LLM settings form.
    *   Create: `components/feature/LlmConfiguration.tsx`.
10. **Implement Improvement Selectors:** Dropdowns for Type/Style.
    *   Create: `components/feature/ImprovementSelectors.tsx`.
11. **Implement Prompt Input Area:** Main text area and controls.
    *   Create: `components/feature/PromptInputArea.tsx`.

**Phase 7: Frontend Logic & Integration**

1.  **Create Hooks Directory:** Organize custom hooks.
    *   Create: `hooks/` directory.
2.  **Implement Sidebar Toggle Hook:** Manage sidebar visibility state.
    *   Create: `hooks/use-sidebar-toggle.ts`.
3.  **Implement Session Manager Hook:** Facade for session state logic.
    *   Create: `hooks/use-session-manager.ts`.
4.  **Implement Local Storage Hook (Optional):** Generic LS interaction hook.
    *   Create: `hooks/use-local-storage.ts`.
5.  **Implement API Client Utilities:** Typed frontend API callers.
    *   Create: `lib/api-client.ts` (Functions: `fetchImprovementOptions`, `improvePrompt`, `nameSession`).
6.  **Implement Session Utilities:** Client-side session data helpers.
     *   Create: `lib/session-utils.ts`.
7.  **Integrate State:** Connect components to Zustand store.
    *   Modify: `SessionSidebar.tsx`, `ConfigSidebar.tsx`, `HistoryDisplay.tsx`, `PromptInputArea.tsx`, etc., to use `useStore` and `useSessionManager`.
8.  **Implement Initial Data Fetching:** Load config on startup.
    *   Modify: `app/(main)/page.tsx` (or layout client component) to call `fetchImprovementOptions` via `api-client.ts` on mount, update `config-slice`.
9.  **Implement Core Workflow:** Connect the main interaction loop.
    *   Modify: `app/(main)/page.tsx` to orchestrate components.
    *   Modify: `PromptInputArea.tsx` to handle submit, call API, update state.
    *   Modify: `ConfigSidebar.tsx` to handle locking display and forking.
10. **Implement Session Locking & Naming:** Add logic triggered by first improvement.
    *   Modify: State update logic (likely within `useSessionManager` or component handling API response) to set `lockedSettings` and trigger `nameSession` API call.

**Phase 8: Testing Setup & Implementation**

1.  **Install Testing Dependencies:** Add Vitest, RTL, MSW, Playwright.
2.  **Configure Test Runners:** Set up config files.
    *   Create: `vitest.config.ts`.
    *   Create: `playwright.config.ts`.
3.  **Create Test Setup Files:** Configure global test environment.
    *   Create: `tests/` directory.
    *   Create: `tests/setup/` directory.
    *   Create: `tests/setup/vitest.setup.ts` (Import matchers, configure MSW).
    *   Create: `tests/setup/msw-server.ts` (Define API mocks).
4.  **Write Unit Tests:** Test individual units.
    *   Create: `tests/unit/` directory and subdirectories (`components`, `hooks`, `lib`, `store`).
    *   Create: `*.spec.ts`/`*.spec.tsx` files for key units.
5.  **Write Integration Tests:** Test interactions.
    *   Create: `tests/integration/` directory and subdirectories (`api`).
    *   Create: `*.integration.spec.ts` files for API routes.
6.  **Write E2E Tests:** Test user flows.
    *   Create: `tests/e2e/` directory.
    *   Create: `*.spec.ts` files for critical workflows (`session.spec.ts`, `improvement.spec.ts`).

**Phase 9: Deployment & Finalization**

1.  **Finalize CI/CD Workflows:** Add testing and deployment steps.
    *   Modify: `.github/workflows/ci.yml` (Add test step).
    *   Create: `.github/workflows/deploy-preview.yml`.
    *   Create: `.github/workflows/deploy-prod.yml`.
2.  **Configure Production Environment:** Set production env vars on hosting platform.
    *   Create: `.env.production` (Reference only, manage secrets via platform).
3.  **Final Testing:** Perform thorough testing on preview/staging environment.
4.  **Deploy to Production:** Trigger production deployment pipeline.
5.  **Update Documentation:** Ensure all docs are complete and accurate.
    *   Modify: `README.md`, `docs/ARCHITECTURE.md`, `docs/API_GUIDE.md`, `docs/SETUP_GUIDE.md`.
6.  **Setup Monitoring:** Integrate error tracking, analytics, uptime monitoring.