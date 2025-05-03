# Skaldur Implementation Guide

## Implementation Approach

This guide outlines the steps to build the Skaldur application sequentially, following the blueprint and file architecture previously defined. It adopts a phased approach, starting with project setup, building the backend API and core frontend structure, implementing state management, developing UI components, integrating features, adding tests, and finally deploying. Each phase lists the files to be created or modified in a logical order.

**Phase 1: Project Setup & Core Configuration**

1.  **Initialize Project:** Use `create-next-app` with TypeScript, Tailwind CSS, ESLint, and App Router options.
    *   Creates: Initial project structure including `package.json`, `next.config.mjs`, `tsconfig.json`, `app/`, `public/`, etc.
2.  **Git Setup:** Initialize a Git repository.
    *   Create: `.gitignore` (ensure `.env.local`, `.env.production`, `node_modules`, `.next` are included).
3.  **Linting & Formatting:** Configure ESLint and Prettier.
    *   Create/Modify: `.eslintrc.json` (configure rules based on `eslint-config-next/core-web-vitals`).
    *   Create: `.eslintignore`
    *   Create: `.prettierrc.json` (define formatting rules).
    *   Create: `.prettierignore`
4.  **Tailwind CSS Setup:** Ensure Tailwind is correctly configured.
    *   Create/Modify: `tailwind.config.ts` (configure theme, plugins).
    *   Create/Modify: `postcss.config.js` (ensure tailwindcss and autoprefixer are included).
    *   Modify: `app/globals.css` (include Tailwind directives: `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`).
5.  **Shadcn/ui Setup:** Initialize Shadcn/ui.
    *   Run: `npx shadcn-ui@latest init` (configures `components.json`, `lib/utils.ts`, potentially modifies `globals.css`, `tailwind.config.ts`).
    *   Create: `components.json`
6.  **Environment Variables:** Define structure and local defaults.
    *   Create: `.env.example` (list required variables like `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc., with placeholder values).
    *   Create: `.env.local` (add actual development keys - DO NOT COMMIT).
7.  **Basic Documentation:** Create initial project documentation.
    *   Create/Modify: `README.md` (project overview, setup instructions).
    *   Create: `docs/` directory.
    *   Create: `docs/SETUP_GUIDE.md`
    *   Create: `docs/ARCHITECTURE.md` (can be populated later).
    *   Create: `docs/API_GUIDE.md` (can be populated later).
8.  **Basic CI Setup:** Create a basic CI workflow for linting and testing.
    *   Create: `.github/` directory.
    *   Create: `.github/workflows/` directory.
    *   Create: `.github/workflows/ci.yml` (initial version: checkout, setup node, install deps, lint).

**Phase 2: Core Types & Constants**

1.  **Define Base Types:** Establish core data structures.
    *   Create: `types/` directory.
    *   Create: `types/index.ts` (for re-exporting).
    *   Create: `types/utility.ts` (common utility types).
    *   Create: `types/session.ts` (define `SessionMetadata`, `SessionDetails`, `Message`, `LockedSettings`, `InteractionLLMSettings`, `DestinationLLMSettings`).
    *   Create: `types/config.ts` (define `ImprovementType`, `LLMOptionGroup`, `ImprovementOptionsResponse`).
    *   Create: `types/api.ts` (define request/response types for API endpoints: `ImprovePromptRequest`, `ImprovePromptResponse`, `NameSessionRequest`, `NameSessionResponse`).
    *   Create: `types/environment.d.ts` (declare types for `process.env`).
2.  **Define Constants:** Set up application-wide constants.
    *   Create: `constants/` directory.
    *   Create: `constants/defaults.ts` (e.g., `DEFAULT_TEMPERATURE`, `DEFAULT_MAX_TOKENS`).
    *   Create: `constants/llm-providers.ts` (enum or object for provider names/IDs).
    *   Create: `constants/storage-keys.ts` (key for Local Storage persistence).

**Phase 3: Backend API Implementation**

1.  **Backend Configuration Data:** Store definitions for dynamic options.
    *   Create: `config/` directory.
    *   Create: `config/improvement-options.json` (structure according to `ImprovementType` definition, including backend-only fields like `systemPrompt`, `template`).
    *   Create: `config/llm-options.json` (structure according to `LLMOptionGroup` for Interaction and Destination LLMs).
2.  **Backend Utilities:** Create helper functions for API logic.
    *   Create: `lib/` directory (if not created by Shadcn).
    *   Create: `lib/validation.ts` (implement Zod schemas or functions for API request validation).
    *   Modify: `lib/utils.ts` (add any general server-safe utilities).
    *   Create: `lib/llm-utils.server.ts` (functions to interact with different LLM provider APIs, securely using env vars). Ensure `.server.` naming convention if mixing client/server utils.
3.  **API Route - Configuration:** Endpoint to serve frontend options.
    *   Create: `app/api/` directory.
    *   Create: `app/api/config/` directory.
    *   Create: `app/api/config/improvement-options/` directory.
    *   Create: `app/api/config/improvement-options/route.ts` (implement GET handler: read from `config/` files, format according to `ImprovementOptionsResponse`, return).
4.  **API Route - Improve Prompt:** Endpoint for the core enhancement logic.
    *   Create: `app/api/improve/` directory.
    *   Create: `app/api/improve/route.ts` (implement POST handler: validate request (`ImprovePromptRequest`), handle first-request locking logic, retrieve session settings, load `ImprovementType` config, construct meta-prompt, call Interaction LLM via `llm-utils.server.ts`, handle errors, return `ImprovePromptResponse`).
5.  **API Route - Name Session:** Endpoint for automatic naming.
    *   Create: `app/api/name-session/` directory.
    *   Create: `app/api/name-session/route.ts` (implement POST handler: validate request (`NameSessionRequest`), retrieve session settings, construct naming prompt, call Interaction LLM via `llm-utils.server.ts`, handle errors, return `NameSessionResponse`).

**Phase 4: State Management Setup (Zustand)**

1.  **Install Zustand:** Add Zustand to project dependencies.
2.  **Store Structure:** Set up the Zustand store.
    *   Create: `store/` directory.
    *   Create: `store/index.ts` (setup main store, combine slices, apply middleware).
    *   Create: `store/ui-slice.ts` (state and actions for sidebar visibility, modals, global loading states).
    *   Create: `store/config-slice.ts` (state and actions for storing fetched `improvementOptions`, `llmOptions`).
    *   Create: `store/session-slice.ts` (state and actions for `sessions`, `sessionDetails`, `activeSessionUUID`; implement `persist` middleware here, potentially using `storage: createJSONStorage(() => localStorage)` and filtering which parts of the state to persist).

**Phase 5: Frontend Core Layout & UI Primitives**

1.  **Root Layout:** Define the base HTML structure.
    *   Modify: `app/layout.tsx` (setup HTML, body tags, include global providers if any).
2.  **Main Layout:** Define the structure for the primary application view.
    *   Create: `app/(main)/` directory (route group).
    *   Create: `app/(main)/layout.tsx` (import and render `SessionSidebar`, `ConfigSidebar`, and the `children` prop which will be `page.tsx`). Might need a client component wrapper if managing state here.
3.  **Main Page:** Create the entry point for the main application UI.
    *   Create: `app/(main)/page.tsx` (initial structure, likely a client component to orchestrate child components and state).
4.  **UI Primitives (Shadcn/ui):** Add necessary low-level components.
    *   Run: `npx shadcn-ui@latest add [component-name]` for each required component.
    *   Creates: `components/ui/button.tsx`, `components/ui/sheet.tsx`, `components/ui/dialog.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/textarea.tsx`, `components/ui/input.tsx`, `components/ui/select.tsx`, `components/ui/scroll-area.tsx`, `components/ui/separator.tsx`, `components/ui/tooltip.tsx`, `components/ui/label.tsx`.
5.  **Global Styles/Assets:** Add custom fonts or static assets.
    *   Create: `styles/` directory (if needed beyond `globals.css`).
    *   Create: `styles/fonts.css` (if using custom fonts).
    *   Modify: `app/layout.tsx` (to import fonts if necessary).
    *   Create: `public/` directory (if not present).
    *   Create: `public/icons/` directory (add any needed static icons).
    *   Modify: `app/favicon.ico` (replace default).

**Phase 6: Feature Implementation - UI Components**

1.  **Layout Components:** Implement the main structural elements.
    *   Create: `components/layout/` directory.
    *   Create: `components/layout/SessionSidebar.tsx` (renders session list, "+" button).
    *   Create: `components/layout/ConfigSidebar.tsx` (renders LLM config/display, fork button).
    *   Create: `components/layout/AppLayoutClient.tsx` (if needed as a client boundary for the main layout, potentially managing sidebar state).
2.  **Feature Components:** Implement components specific to Skaldur's features.
    *   Create: `components/feature/` directory.
    *   Create: `components/feature/SessionListItem.tsx` (displays session name/timestamp, handles click).
    *   Create: `components/feature/ChatMessage.tsx` (displays user/assistant message bubble).
    *   Create: `components/feature/HistoryDisplay.tsx` (displays list of `ChatMessage`s in a scrollable area).
    *   Create: `components/feature/LlmConfiguration.tsx` (reusable form for selecting LLM provider, model, temp, tokens).
    *   Create: `components/feature/ImprovementSelectors.tsx` (dropdowns for Improvement Type and Style).
    *   Create: `components/feature/PromptInputArea.tsx` (main textarea, integrates `ImprovementSelectors`, submit button).

**Phase 7: Frontend Logic & Integration**

1.  **Custom Hooks:** Encapsulate reusable stateful logic.
    *   Create: `hooks/` directory.
    *   Create: `hooks/use-sidebar-toggle.ts` (logic for opening/closing sidebars, interacting with `ui-slice`).
    *   Create: `hooks/use-session-manager.ts` (facade hook interacting with `session-slice` for CRUD operations, active session logic).
    *   Create: `hooks/use-local-storage.ts` (optional generic hook if direct LS access is needed beyond Zustand).
2.  **API Client:** Create a typed wrapper for frontend API calls.
    *   Create: `lib/api-client.ts` (functions like `fetchImprovementOptions`, `improvePrompt`, `nameSession` using `fetch`, handling request/response types, basic error handling).
3.  **State Integration:** Connect Zustand store to components.
    *   Modify components (`SessionSidebar`, `ConfigSidebar`, `HistoryDisplay`, `PromptInputArea`, etc.) to select data from the store using hooks (`useStore(state => state...)`).
    *   Modify components to call actions defined in store slices to update state (e.g., `setActiveSessionUUID`, `addMessage`, `updateSessionName`, `toggleSidebar`).
4.  **Initial Data Fetching:** Load configuration on app start.
    *   Modify: `app/(main)/layout.tsx` or `app/(main)/page.tsx` (or a dedicated client component) to call `fetchImprovementOptions` on mount and store results in `config-slice`.
5.  **Core Workflow Logic:** Implement the main interaction flow.
    *   Modify: `app/(main)/page.tsx` (orchestrate the main view).
    *   Modify: `components/layout/SessionSidebar.tsx` (use `useSessionManager` to display list, handle selection/creation).
    *   Modify: `components/feature/HistoryDisplay.tsx` (display messages for active session from `session-slice`).
    *   Modify: `components/feature/PromptInputArea.tsx` (handle input, call `improvePrompt` via `api-client`, trigger state updates on success/error).
    *   Modify: `components/layout/ConfigSidebar.tsx` (conditionally render `LlmConfiguration` or read-only display based on active session's locked status from `session-slice`, handle fork action using `useSessionManager`).
    *   Implement session locking logic (update `lockedSettings` in `session-slice` after first successful `improvePrompt` call).
    *   Implement automatic session naming (trigger `nameSession` call after first successful `improvePrompt` and update state).
    *   Implement error display (trigger modal via `ui-slice` state from API call error handlers).

**Phase 8: Testing Setup & Implementation**

1.  **Install Testing Tools:** Add Vitest, RTL, MSW, Playwright as dev dependencies.
2.  **Configure Testing:** Set up configuration files.
    *   Create: `vitest.config.ts`
    *   Create: `playwright.config.ts`
3.  **Test Setup:** Create utility/setup files.
    *   Create: `tests/` directory.
    *   Create: `tests/setup/` directory.
    *   Create: `tests/setup/vitest.setup.ts` (global mocks, etc.).
    *   Create: `tests/setup/msw-server.ts` (configure MSW handlers for mocking API calls in tests).
4.  **Write Unit Tests:** Test isolated pieces.
    *   Create: `tests/unit/` directory.
    *   Create: `tests/unit/components/`, `tests/unit/hooks/`, `tests/unit/lib/`, `tests/unit/store/` subdirectories.
    *   Create: `*.spec.ts` or `*.spec.tsx` files for key components (`PromptInputArea.spec.tsx`, `SessionListItem.spec.tsx`), hooks (`useSessionManager.spec.ts`), utils (`session-utils.spec.ts`), and store slices (`session-slice.spec.ts`).
5.  **Write Integration Tests:** Test interactions between units.
    *   Create: `tests/integration/` directory.
    *   Create: `tests/integration/api/` directory.
    *   Create: `*.integration.spec.ts` files for API routes (`improve.integration.spec.ts`, `name-session.integration.spec.ts`), potentially testing component interactions using MSW.
6.  **Write E2E Tests:** Test user flows in a browser.
    *   Create: `tests/e2e/` directory.
    *   Create: `*.spec.ts` files for critical user flows (`improvement.spec.ts`, `session.spec.ts`).

**Phase 9: Deployment & Finalization**

1.  **Finalize CI/CD:** Complete deployment workflows.
    *   Modify: `.github/workflows/ci.yml` (add test execution step).
    *   Create: `.github/workflows/deploy-preview.yml` (configure deployment to staging/preview on pushes to specific branches).
    *   Create: `.github/workflows/deploy-prod.yml` (configure deployment to production on merges/tags to `main`).
2.  **Production Configuration:** Set up production environment.
    *   Create: `.env.production` (define production variables - managed securely via hosting platform, DO NOT COMMIT).
3.  **Final Testing:** Thoroughly test on staging/preview environments.
4.  **Deploy:** Trigger production deployment via the CI/CD pipeline.
5.  **Update Documentation:** Ensure all documentation is accurate and complete.
    *   Modify: `README.md`
    *   Modify: `docs/ARCHITECTURE.md`
    *   Modify: `docs/SETUP_GUIDE.md`
    *   Modify: `docs/API_GUIDE.md`
6.  **Monitoring:** Set up error tracking (Sentry), analytics, and uptime monitoring as needed.