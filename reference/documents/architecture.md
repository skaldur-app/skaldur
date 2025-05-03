# Skaldur File/Folder Architecture

## Project Structure Overview

This architecture follows a feature-driven and domain-oriented approach within a standard Next.js App Router structure. Key principles include:

1.  **Separation of Concerns:** Clear separation between UI (`components`, `app`), state (`store`), utilities (`lib`, `hooks`), API logic (`app/api`), configuration (`config`), types (`types`), and testing (`tests`).
2.  **Modularity:** Components are organized by scope (`ui`, `layout`, `feature`) to enhance reusability and maintainability.
3.  **Colocation:** API routes are colocated within the `app` directory as per Next.js convention. Backend configuration specific to API routes is placed in a root `config` directory.
4.  **Scalability:** The structure allows for easy addition of new features, API endpoints, components, and tests.
5.  **Type Safety:** Centralized `types` directory ensures consistent data structures across the application.
6.  **Testability:** Dedicated `tests` directory with subfolders for unit, integration, and E2E tests, alongside necessary configuration and setup files.

## Directory Tree Structure

```
skaldur/
├── .env.example                     # Example environment variables structure
├── .env.local                       # Local environment variables (DO NOT COMMIT)
├── .env.production                  # Production environment variables (Managed via hosting)
├── .eslintignore                    # Files/folders ignored by ESLint
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Files/folders ignored by Git
├── .prettierignore                  # Files/folders ignored by Prettier
├── .prettierrc.json                 # Prettier configuration
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Continuous Integration workflow (lint, test, build)
│       ├── deploy-preview.yml       # Preview deployment workflow (e.g., Vercel previews)
│       └── deploy-prod.yml          # Production deployment workflow
├── app/
│   ├── (main)/                      # Route group for the main application UI
│   │   ├── layout.tsx               # Layout for the main application view
│   │   └── page.tsx                 # Main application page component (chat interface)
│   ├── api/                         # Backend API Route Handlers
│   │   ├── config/
│   │   │   └── improvement-options/
│   │   │       └── route.ts         # GET endpoint for types/styles/LLM options
│   │   ├── improve/
│   │   │   └── route.ts             # POST endpoint for prompt improvement
│   │   └── name-session/
│   │       └── route.ts             # POST endpoint for automatic session naming
│   ├── favicon.ico                  # Application favicon
│   ├── globals.css                  # Global CSS styles (Tailwind base/layers)
│   └── layout.tsx                   # Root application layout
├── components/
│   ├── feature/                     # Feature-specific components
│   │   ├── ChatMessage.tsx          # Renders a single chat bubble
│   │   ├── HistoryDisplay.tsx       # Renders the scrollable chat history
│   │   ├── ImprovementSelectors.tsx # Container for Type/Style dropdowns
│   │   ├── LlmConfiguration.tsx     # Component for selecting/displaying LLM settings
│   │   ├── PromptInputArea.tsx      # Textarea + ImprovementSelectors + Submit button
│   │   └── SessionListItem.tsx      # Renders an item in the session list
│   ├── layout/                      # Structural layout components
│   │   ├── AppLayoutClient.tsx      # Client component wrapper for main layout (if state needed)
│   │   ├── ConfigSidebar.tsx        # Right sidebar for configuration/forking
│   │   └── SessionSidebar.tsx       # Left sidebar for session management
│   └── ui/                          # Low-level UI primitives (Shadcn/ui)
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── components.json                  # Shadcn/ui configuration file
├── config/                          # Backend configuration data
│   ├── improvement-options.json     # Definitions for Improvement Types and Styles
│   └── llm-options.json             # Definitions for available Interaction/Destination LLMs
├── constants/                       # Application-wide constants
│   ├── defaults.ts                  # Default values (e.g., initial temperature)
│   ├── llm-providers.ts             # Constants related to LLM providers/models
│   └── storage-keys.ts              # Keys used for Local Storage
├── docs/                            # Project documentation
│   ├── ARCHITECTURE.md              # Detailed architecture decisions/reasoning
│   ├── API_GUIDE.md                 # Guide for using the backend API (if needed)
│   └── SETUP_GUIDE.md               # Developer setup instructions
├── hooks/                           # Custom React hooks
│   ├── use-local-storage.ts         # Generic hook for local storage interaction (if needed)
│   ├── use-session-manager.ts       # Hook abstracting session CRUD and active state logic
│   └── use-sidebar-toggle.ts        # Hook for managing sidebar open/close state
├── lib/                             # Utility functions, shared logic
│   ├── api-client.ts                # Typed fetch wrapper for frontend API calls
│   ├── llm-utils.server.ts          # Backend utilities for interacting with LLM APIs
│   ├── session-utils.ts             # Client-side helpers for session data manipulation
│   ├── utils.ts                     # General shared utility functions (client/server safe)
│   └── validation.ts                # Shared Zod schemas or validation functions
├── next-env.d.ts                    # Next.js environment TypeScript definitions
├── next.config.mjs                  # Next.js configuration file (using .mjs for ESM)
├── package.json                     # Project metadata and dependencies
├── postcss.config.js                # PostCSS configuration (for Tailwind CSS)
├── public/                          # Static assets
│   └── icons/                       # Directory for any static icon files
├── README.md                        # Project overview, setup, and usage instructions
├── store/                           # Zustand state management
│   ├── index.ts                     # Main store export combining slices
│   ├── config-slice.ts              # Slice for fetched configuration state
│   ├── session-slice.ts             # Slice for session list, details, active session
│   └── ui-slice.ts                  # Slice for UI state (sidebars, modals, loading)
├── styles/                          # Additional global styles or fonts
│   └── fonts.css                    # Example for custom font imports/definitions
├── tailwind.config.ts               # Tailwind CSS configuration
├── tests/                           # Automated tests
│   ├── e2e/                         # End-to-end tests (Playwright)
│   │   ├── improvement.spec.ts      # E2E tests for the core improvement workflow
│   │   └── session.spec.ts          # E2E tests for session management (create, switch, fork)
│   ├── integration/                 # Integration tests
│   │   └── api/                     # API route integration tests
│   │       ├── improve.integration.spec.ts
│   │       └── name-session.integration.spec.ts
│   ├── setup/                       # Test setup files
│   │   ├── msw-server.ts            # Mock Service Worker setup for API mocking
│   │   └── vitest.setup.ts          # Vitest global setup (e.g., mocks, extensions)
│   └── unit/                        # Unit tests (Vitest + RTL)
│       ├── components/
│       │   ├── PromptInputArea.spec.tsx
│       │   └── SessionListItem.spec.tsx
│       ├── hooks/
│       │   └── useSessionManager.spec.ts
│       ├── lib/
│       │   └── session-utils.spec.ts
│       └── store/
│           └── session-slice.spec.ts
├── tsconfig.json                    # TypeScript configuration
├── types/                           # TypeScript definitions
│   ├── api.ts                       # Types for API requests and responses
│   ├── config.ts                    # Types for improvement/LLM configuration data
│   ├── environment.d.ts             # Type definitions for process.env
│   ├── index.ts                     # General application types / re-exports
│   ├── session.ts                   # Types for Session, Message, Settings
│   └── utility.ts                   # Reusable utility types
├── vitest.config.ts                 # Vitest configuration file
└── playwright.config.ts             # Playwright configuration file
```