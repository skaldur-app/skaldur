# Skaldur File/Folder Architecture

## Project Structure Overview

This architecture uses a feature-oriented approach within the standard Next.js App Router structure. It prioritizes separation of concerns by organizing code into distinct directories for API routes (`app/api`), UI components (`components`), state management (`store`), utility functions (`lib`, `hooks`), configuration (`config`), types (`types`), and testing (`tests`). Components are further categorized by scope (`ui`, `layout`, `feature`) to promote reusability and maintainability. Backend configuration resides in a root `config` directory, while API routes leverage shared utilities from `lib`. This structure supports scalability by making it clear where to add new features, components, API endpoints, or tests. Naming conventions follow Next.js and React community standards.

## Directory Tree Structure

```
skaldur/
├── .env.example                     # Example environment variables
├── .env.local                       # Local development variables (DO NOT COMMIT)
├── .env.production                  # Production environment variables (Managed via hosting)
├── .eslintignore                    # Files/folders ignored by ESLint
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Files/folders ignored by Git
├── .prettierignore                  # Files/folders ignored by Prettier
├── .prettierrc.json                 # Prettier configuration
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Continuous Integration workflow
│       ├── deploy-preview.yml       # Preview Deployment workflow
│       └── deploy-prod.yml          # Production Deployment workflow
├── app/
│   ├── (main)/                      # Main application UI route group
│   │   ├── layout.tsx               # Layout specific to the main app view
│   │   └── page.tsx                 # Main application page component (renders chat UI)
│   ├── api/                         # Backend API Route Handlers
│   │   ├── config/
│   │   │   └── improvement-options/
│   │   │       └── route.ts         # GET /api/config/improvement-options
│   │   ├── improve/
│   │   │   └── route.ts             # POST /api/improve
│   │   └── name-session/
│   │       └── route.ts             # POST /api/name-session
│   ├── favicon.ico                  # Application icon
│   ├── globals.css                  # Global styles (Tailwind base, components, utilities)
│   └── layout.tsx                   # Root application layout (html, body)
├── components/
│   ├── feature/                     # Feature-specific components
│   │   ├── ChatMessage.tsx          # Renders a single chat bubble
│   │   ├── HistoryDisplay.tsx       # Renders the scrollable chat history
│   │   ├── ImprovementSelectors.tsx # Dropdowns for Type and Style
│   │   ├── LlmConfiguration.tsx     # Inputs for selecting LLM settings
│   │   ├── PromptInputArea.tsx      # Main textarea, selectors, and submit button
│   │   └── SessionListItem.tsx      # Renders an item in the session list sidebar
│   ├── layout/                      # Structural components for page layout
│   │   ├── AppLayoutClient.tsx      # Optional client wrapper for main layout state
│   │   ├── ConfigSidebar.tsx        # Right retractable sidebar component
│   │   └── SessionSidebar.tsx       # Left retractable sidebar component
│   └── ui/                          # UI primitives (from Shadcn/ui)
│       ├── button.tsx
│       ├── dialog.tsx               # Modal component
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx                # Sidebar component
│       ├── textarea.tsx
│       └── tooltip.tsx
├── components.json                  # Shadcn/ui configuration
├── config/                          # Backend configuration files
│   ├── improvement-options.json     # Definitions for Improvement Types/Styles
│   └── llm-options.json             # Definitions for available LLMs
├── constants/                       # Application-wide constant values
│   ├── defaults.ts                  # Default settings (e.g., temperature)
│   ├── llm-providers.ts             # LLM provider identifiers
│   └── storage-keys.ts              # Local Storage keys
├── docs/                            # Project documentation
│   ├── ARCHITECTURE.md              # Architecture overview and decisions
│   ├── API_GUIDE.md                 # Backend API documentation
│   └── SETUP_GUIDE.md               # Developer setup instructions
├── hooks/                           # Custom React hooks
│   ├── use-local-storage.ts         # Optional generic LS hook
│   ├── use-session-manager.ts       # Hook for session state logic
│   └── use-sidebar-toggle.ts        # Hook for managing sidebar state
├── lib/                             # Utility functions and shared logic
│   ├── api-client.ts                # Frontend utility for calling backend API
│   ├── llm-utils.server.ts          # Backend utilities for LLM API interaction
│   ├── session-utils.ts             # Client-side helpers for session data
│   ├── utils.ts                     # General utilities (incl. Shadcn's cn function)
│   └── validation.ts                # Validation schemas/functions (e.g., Zod)
├── next-env.d.ts                    # Next.js TypeScript environment types
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Project dependencies and scripts
├── postcss.config.js                # PostCSS configuration (for Tailwind)
├── public/                          # Static assets served from the root
│   └── icons/                       # Directory for any static icon assets
├── README.md                        # Top-level project documentation
├── store/                           # Zustand state management files
│   ├── config-slice.ts              # Slice for fetched configuration state
│   ├── index.ts                     # Main store setup and export
│   ├── session-slice.ts             # Slice for session data and persistence
│   └── ui-slice.ts                  # Slice for UI state (sidebars, modals)
├── styles/                          # Additional global styles
│   └── fonts.css                    # Custom font definitions (if any)
├── tailwind.config.ts               # Tailwind CSS configuration
├── tests/                           # Automated tests
│   ├── e2e/                         # End-to-end tests (Playwright)
│   │   ├── improvement.spec.ts
│   │   └── session.spec.ts
│   ├── integration/                 # Integration tests
│   │   └── api/                     # API route integration tests
│   │       ├── improve.integration.spec.ts
│   │       └── name-session.integration.spec.ts
│   ├── setup/                       # Test setup files
│   │   ├── msw-server.ts            # Mock Service Worker setup
│   │   └── vitest.setup.ts          # Vitest global setup
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
├── types/                           # TypeScript type definitions
│   ├── api.ts                       # API request/response types
│   ├── config.ts                    # Configuration data types
│   ├── environment.d.ts             # Environment variable types
│   ├── index.ts                     # Main type exports/re-exports
│   ├── session.ts                   # Session, Message, Settings types
│   └── utility.ts                   # Reusable utility types
├── vitest.config.ts                 # Vitest configuration
└── playwright.config.ts             # Playwright configuration
```