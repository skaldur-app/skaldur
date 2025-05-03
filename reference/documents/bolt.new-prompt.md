Okay, based on our detailed discussion, here is a comprehensive Software Specification Document (SSD) for the "Prompt Improver" application, designed for a full-stack Next.js (App Router) implementation.

---

Software Specification Document: Prompt Improver Web Application

Version: 1.0
Date: 2023-10-27

1. Detailed Application Description

## Purpose: The Prompt Improver is a web-based utility designed to help users iteratively refine and enhance text prompts intended for use with Large Language Models (LLMs). It provides a structured workflow for improving prompts based on user-selected criteria and targets specific destination LLMs.


## Core Features:


    *   Iterative Prompt Enhancement: Users input a prompt, select an 'Improvement Type' (e.g., "Enhance", "Summarize") and an optional 'Style' (e.g., "Concisely", "Formally"), and submit it for enhancement by a configurable backend 'Interaction LLM'.
    *   Targeted Output: Users specify a 'Prompt Destination LLM' (Provider and Model) before starting an improvement session. This target influences the enhancement process and is locked per session.
    *   Session-Based Workflow: All interactions occur within distinct sessions. Each session tracks the conversation history (user inputs, LLM responses), the locked Interaction LLM settings (Provider, Model, Temperature, Max Tokens), and the locked Destination LLM settings.
    *   Dynamic Configuration: Improvement Types and Styles are defined and served by the backend, allowing for flexible updates without frontend redeployment. Interaction LLM settings and Destination LLM are selected once per session and locked.
    *   Chat-like History: The interaction history for the current session is displayed visually as scrollable chat bubbles above the input area. The LLM's improved prompt populates the input area for further editing.
    *   Session Management: A retractable left sidebar lists all saved sessions (initially named by timestamp, then auto-named by the LLM). Users can switch between sessions, preserving their state. A "+" button creates new sessions.
    *   Session Forking: Users can duplicate an existing session (including its history and last prompt) into a new session, allowing them to target a different Destination LLM or use different Interaction LLM settings.
    *   Configuration Panel: A retractable right sidebar allows users to select Interaction and Destination LLM settings before locking them for a session and displays the locked settings afterward.
    *   Local Persistence: All session data (history, settings) is persisted in the browser's local storage, allowing users to resume work across browser sessions on the same device.
    *   Backend API: A dedicated backend handles secure LLM API calls (using pre-configured keys), serves improvement configurations, and performs session naming.
## Target Audience: Developers, writers, researchers, AI enthusiasts, and anyone who frequently interacts with LLMs and seeks a systematic way to optimize their prompts for specific models and desired outcomes.



2. Technology Stack

## Framework: Next.js (v13.4+ / v14+) - Chosen for its App Router, integrated backend capabilities (Route Handlers), Server Components, performance optimizations (SSR, RSC), and strong ecosystem.

- Justification:* Provides a robust full-stack foundation, simplifying development and deployment with its file-based routing and API route handling within the same project structure. App Router enables modern React features and improved data fetching patterns.

## Language: TypeScript - Used throughout the frontend and backend.

- Justification:* Enhances code reliability, maintainability, and developer experience through static typing, catching errors early, and improving code completion. Essential for building robust applications.

## UI Library: React (v18+) - The foundation of Next.js.

- Justification:* Leverages the component-based architecture, hooks, and vast ecosystem of React for building interactive UIs.

## Styling: Tailwind CSS - Utility-first CSS framework.

- Justification:* Enables rapid UI development, ensures consistency, promotes maintainability by colocation of styles (via classes), and integrates seamlessly with Next.js and component libraries like Shadcn/ui.

## UI Components: Shadcn/ui (or similar headless component library like Radix UI primitives)

- Justification:* Provides accessible, unstyled, composable components (Dropdowns, Modals, Sidebars, Buttons, Textarea) built on Tailwind CSS, accelerating development while allowing full style control. Reduces boilerplate for common UI patterns.

## State Management: Zustand - Lightweight, hook-based state management library.

- Justification:* Offers a simple API for managing global state (sessions, active session data, UI state) with minimal boilerplate compared to alternatives like Redux. Its middleware support is ideal for integrating local storage persistence.

## Data Fetching (Client-Side): SWR (Stale-While-Revalidate) - React Hooks library for data fetching.

- Justification:* Simplifies client-side data fetching (e.g., for improvement options), providing caching, automatic revalidation, loading/error state management, and a hook-based API that fits well with React.

## Backend Logic: Next.js Route Handlers (within the `/app/api/` directory).

- Justification:* Keeps backend logic colocated with the frontend, leverages the Next.js environment, and simplifies deployment. Suitable for handling API requests, interacting with external LLM APIs, and managing backend configurations.

## LLM Interaction: Standard `fetch` API or lightweight HTTP client (e.g., `node-fetch` or `axios`) within Route Handlers.

- Justification:* Sufficient for making calls to external LLM provider APIs from the backend. Keys managed via environment variables.

## Persistence: Browser Local Storage - Used for storing session data.

- Justification:* Meets the requirement for client-side persistence without needing a database or user accounts for V1. Zustand middleware (`persist`) will manage synchronization.

## Authentication/Authorization: None (V1). API keys for LLMs are managed exclusively on the backend via environment variables (`.env`).

- Justification:* The current scope does not include user accounts or cross-device synchronization. Security relies on backend key management and potentially CORS/rate limiting on API routes.

3. File and Folder Structure

```
.
├── app/
│   ├── api/                     # Backend API Route Handlers
│   │   ├── improve/route.ts     # Endpoint for prompt improvement
│   │   ├── name-session/route.ts# Endpoint for session naming
│   │   └── config/
│   │       └── improvement-options/route.ts # Endpoint for types/styles
│   ├── (main)/                  # Main application UI route group
│   │   ├── layout.tsx           # Main layout (includes sidebars, main area)
│   │   └── page.tsx             # Main application page component
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # Low-level UI primitives (from Shadcn/ui or custom)
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx            # For errors
│   │   ├── sheet.tsx            # For sidebars
│   │   └── textarea.tsx
│   ├── layout/                  # Structural components
│   │   ├── AppLayout.tsx
│   │   ├── ConfigSidebar.tsx
│   │   └── SessionSidebar.tsx
│   └── feature/                 # Feature-specific components
│       ├── ChatMessage.tsx
│       ├── HistoryDisplay.tsx
│       ├── ImprovementSelectors.tsx # Container for Type/Style dropdowns
│       ├── LlmConfiguration.tsx   # Component for selecting/displaying LLM settings
│       ├── PromptInputArea.tsx    # Textarea + ImprovementSelectors + Submit
│       └── SessionListItem.tsx
├── config/                      # Application-level static config (if any)
│   └── index.ts
├── hooks/                       # Custom React hooks
│   └── useSessionManager.ts     # Hook abstracting session logic (CRUD, active)
├── lib/                         # Utility functions, constants
│   ├── llmProviders.ts          # Definitions of supported LLM providers/models
│   ├── localStorage.ts        # Helpers for local storage interaction (if needed beyond Zustand)
│   ├── utils.ts                 # General utility functions
│   └── validation.ts            # Shared validation schemas/functions
├── store/                       # Zustand state management
│   ├── index.ts                 # Main store export
│   └── sessionStore.ts          # Store/slice for session management & UI state
├── styles/                      # Global styles, fonts
├── types/                       # TypeScript definitions
│   ├── api.ts                   # API request/response types
│   ├── index.ts                 # General application types
│   └── session.ts               # Session data structures
├── .env.local                   # Environment variables (API keys - DO NOT COMMIT)
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── prettier.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Reasoning: This structure promotes modularity and separation of concerns: `app` for routing and API, `components` for reusable UI elements (categorized by scope), `lib` for shared logic, `hooks` for custom stateful logic, `store` for global state, `types` for type safety, and config/style files at the root. The `(main)` route group allows a dedicated layout for the core application UI.



4. API Endpoints

*(Base URL assumed: `/api`)*

1.  Fetch Improvement Options
    *   Endpoint: `/config/improvement-options`
    *   Method: `GET`
    *   Purpose: Retrieve the list of available Improvement Types and Styles from the backend.
    *   Request Params: None
    *   Request Body: None
    *   Response Schema (Success - 200 OK):
        ```typescript
        interface ImprovementType {
          id: string; // e.g., 'enhance-basic'
          name: string; // e.g., 'Enhance Prompt'
          icon: string; // e.g., '✨'
          description: string; // e.g., 'Improve clarity and detail.'
          // SystemPrompt and PromptTemplate are used internally by backend
        }
        interface ImprovementOptionsResponse {
          types: ImprovementType[];
          styles: string[]; // e.g., ['No Style', 'Concisely', 'Formally']
        }
        ```
    *   Response Schema (Error - 500 Internal Server Error): `{ error: { message: string } }`
    *   Example Response (Success):
        ```json
        {
          "types": [
            { "id": "enhance-v1", "name": "Enhance Prompt", "icon": "✨", "description": "General prompt enhancement." },
            { "id": "summarize-v1", "name": "Summarize Text", "icon": "📄", "description": "Create a prompt to summarize text." }
          ],
          "styles": ["No Style", "Concisely", "Explanatory", "Formally"]
        }
        ```

2.  Improve Prompt
    *   Endpoint: `/improve`
    *   Method: `POST`
    *   Purpose: Submit a user prompt, selected options, and session context to the backend for improvement using the locked Interaction LLM.
    *   Request Body Schema:
        ```typescript
        interface ImprovePromptRequest {
          sessionUUID: string; // UUID of the current session
          userInput: string;   // The prompt text entered/edited by the user
          improvementTypeId: string; // ID of the selected Improvement Type
          improvementStyle: string; // Selected style (e.g., 'Concisely' or 'No Style')
        }
        ```
    *   Validation: `sessionUUID` (valid UUID), `userInput` (non-empty string), `improvementTypeId` (valid ID from `/config/improvement-options`), `improvementStyle` (valid style).
    *   Response Schema (Success - 200 OK):
        ```typescript
        interface ImprovePromptResponse {
          improvedPrompt: string; // The enhanced prompt from the LLM
          sessionUUID: string;   // UUID of the session this response belongs to
        }
        ```
    *   Response Schema (Error - 400 Bad Request, 500 Internal Server Error): `{ error: { message: string, code?: string } }`
    *   Example Request:
        ```json
        {
          "sessionUUID": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
          "userInput": "Explain quantum physics",
          "improvementTypeId": "enhance-v1",
          "improvementStyle": "Like im 5"
        }
        ```
    *   Example Response (Success):
        ```json
        {
          "improvedPrompt": "Explain quantum physics like you're talking to a five-year-old. Use simple words and maybe an analogy with toys.",
          "sessionUUID": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890"
        }
        ```

3.  Name Session
    *   Endpoint: `/name-session`
    *   Method: `POST`
    *   Purpose: Request the backend (using the Interaction LLM) to generate a concise name for a session based on its initial interaction. Triggered automatically by the frontend after the first successful `/improve` response for a session.
    *   Request Body Schema:
        ```typescript
        interface NameSessionRequest {
          sessionUUID: string;
          initialPrompt: string; // The very first prompt submitted by the user in this session
          firstResponse: string; // The first improved prompt returned by the LLM
        }
        ```
    *   Validation: `sessionUUID` (valid UUID), `initialPrompt` (non-empty), `firstResponse` (non-empty).
    *   Response Schema (Success - 200 OK):
        ```typescript
        interface NameSessionResponse {
          sessionName: string; // e.g., "Quantum Physics Explanation"
          sessionUUID: string;
        }
        ```
    *   Response Schema (Error - 400 Bad Request, 500 Internal Server Error): `{ error: { message: string, code?: string } }`
    *   Example Request:
        ```json
        {
          "sessionUUID": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
          "initialPrompt": "Explain quantum physics",
          "firstResponse": "Explain quantum physics like you're talking to a five-year-old. Use simple words and maybe an analogy with toys."
        }
        ```
    *   Example Response (Success):
        ```json
        {
          "sessionName": "Quantum Physics (ELI5)",
          "sessionUUID": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890"
        }
        ```

5. Component Architecture

## `AppLayout` (app/(main)/layout.tsx): Root component for the main application view. Renders the `SessionSidebar`, `ConfigSidebar`, and the main content area (`MainChatArea` rendered via `page.tsx`). Manages sidebar visibility state.


## `SessionSidebar` (components/layout/): Displays the list of sessions (`SessionListItem`), handles session selection (updating global state), triggers new session creation via "+", fetches session list from global state.


## `SessionListItem` (components/feature/): Renders individual session names/timestamps, handles click events to switch active session.


## `ConfigSidebar` (components/layout/): Conditionally renders selection components (`LlmConfiguration`) for Interaction/Destination LLMs if the session is new/unlocked, or displays the locked settings if the session is active. Contains the "Fork Session" button.


## `LlmConfiguration` (components/feature/): Reusable component containing dropdowns/inputs for selecting LLM Provider, Model, Temperature, Max Tokens. Used for both Interaction and Destination LLM setup. Handles state updates before locking.


## `MainChatArea` (app/(main)/page.tsx): Main content view. Fetches active session data from global state. Renders `HistoryDisplay` and `PromptInputArea`. Coordinates the overall interaction flow for the active session.


## `HistoryDisplay` (components/feature/): Renders the scrollable list of `ChatMessage` components based on the active session's message history.


## `ChatMessage` (components/feature/): Renders a single chat bubble (user prompt or LLM response).


## `PromptInputArea` (components/feature/): Contains the main multi-line `textarea`, the `ImprovementSelectors` (Type/Style dropdowns), and the Submit button. Manages local input state and triggers the `/api/improve` call on submit. Receives the improved prompt from the parent (`MainChatArea`) to populate the textarea.


## `ImprovementSelectors` (components/feature/): Groups the Type and Style dropdowns. Fetches options using SWR (`/api/config/improvement-options`). Manages local selection state.


## `ErrorModal` (components/ui/modal.tsx wrapper): Generic modal component used to display errors returned from API calls or other exceptions. Triggered via global state or context.



Interaction: User actions in sidebars or input area update Zustand state. Components re-render based on state changes. API calls are triggered from `PromptInputArea` (improve) or `SessionSidebar` (new session) / `ConfigSidebar` (fork), potentially updating state upon completion/error. Session naming is triggered automatically by `MainChatArea` after the first successful improvement.

Reusability: `LlmConfiguration` is reused. UI primitives from `components/ui/` are used throughout. Hooks like `useSessionManager` encapsulate logic.

6. State Management Strategy

## Library: Zustand


## Store Structure: A single primary store (`sessionStore`) likely managed in `/store/sessionStore.ts`. Middleware (`persist` from `zustand/middleware`) will be used to sync the store with Local Storage.


## Global State Managed by Zustand:


    *   `sessions`: An object or map containing metadata for all sessions (`{ [uuid: string]: { name: string, createdAt: number, lockedSettings: LockedSettings } }`).
    *   `activeSessionUUID`: The UUID of the currently displayed session (or `null`).
    *   `activeSessionMessages`: An array of messages for the active session (`{ role: 'user' | 'assistant', content: string }[]`).
    *   `availableImprovementTypes`: Array of `ImprovementType` fetched from the API.
    *   `availableImprovementStyles`: Array of `string` fetched from the API.
    *   `isSessionSidebarOpen`, `isConfigSidebarOpen`: Boolean flags for UI state.
    *   `currentError`: Information about the last critical error for display in the modal (`{ message: string } | null`).
## Local State (React `useState`):


    *   Input value within `PromptInputArea`'s textarea.
    *   Selected Type/Style in `ImprovementSelectors` before submission.
    *   Loading/pending states for individual API requests within the components that trigger them (e.g., submit button disabled state).
    *   Temporary state within modals or forms before they are committed globally.
## Data Flow: Components read data from the Zustand store using selectors. Actions (functions defined within the store) are called by components to update the state (e.g., `setActiveSession(uuid)`, `addMessageToActiveSession(message)`, `updateSessionName(uuid, name)`, `createNewSession()`, `forkSession(uuid)`). Persistence middleware automatically saves relevant parts of the store to Local Storage on change.



7. Authentication and Authorization

## V1 Implementation: No user authentication or authorization.


## Security:


    *   LLM API keys are stored securely on the backend using environment variables (`.env.local`) and are never exposed to the client.
    *   Backend API routes handle all interactions with external LLM services.
    *   Recommended: Implement CORS policies on API routes (`/api/*`) to restrict requests to the allowed frontend origin(s).
    *   Recommended: Consider implementing basic rate limiting on the backend API endpoints to prevent abuse.
## Future Considerations: If user accounts, cross-device synchronization, or sharing become requirements, NextAuth.js would be the recommended library to integrate traditional authentication (OAuth, email, credentials). This would require adding a database to store user information and linking sessions to users.



8. Data Fetching Strategy

## Fetching Initial Configuration (Types/Styles):


    *   Use SWR (`useSWR('/api/config/improvement-options', fetcher)`) within a high-level component (e.g., `AppLayout` or `ImprovementSelectors`) to fetch the available types and styles once.
    *   SWR will handle caching (`stale-while-revalidate`), ensuring the data is available to relevant components without redundant fetching. Loading and error states are provided by the hook.
## Submitting Prompts for Improvement (`/api/improve`):


    *   Use standard `fetch` within an async function triggered by the Submit button's `onClick` handler in `PromptInputArea`.
    *   Manually manage loading state (e.g., disable submit button) and handle success/error responses. On success, update the Zustand store with the new assistant message. On error, update the error state in Zustand to trigger the `ErrorModal`.
## Triggering Session Naming (`/api/name-session`):


    *   Use standard `fetch` triggered automatically after the *first* successful `/api/improve` response for a session.
    *   This logic likely resides within the component handling the `/api/improve` response flow (e.g., `MainChatArea` or a custom hook).
    *   On success, update the session's name in the Zustand store. Errors should be logged but might not need explicit user notification unless naming consistently fails.
## Backend Data Fetching (LLM APIs):


    *   Within Next.js Route Handlers (`/app/api//*.ts`), use standard Node.js `fetch` or a lightweight HTTP client to call the external LLM provider APIs.
    *   Securely include API keys from environment variables in the requests.
    *   Implement appropriate error handling for LLM API responses (network errors, rate limits, API errors).

9. Error Handling

## Client-Side:


    *   Input Validation: Perform basic validation within components (e.g., check for empty prompt) before calling the API.
    *   API Call Errors: Wrap `fetch` calls in `try...catch` blocks. Use SWR's `error` state for configuration fetching.
    *   Displaying Errors: When a significant error occurs (e.g., failed prompt improvement), update the `currentError` state in Zustand. An `ErrorModal` component listens to this state and displays the error message clearly to the user. Provide options to dismiss the modal. Use less intrusive methods (like inline messages or toasts) for minor validation errors.
    *   UI Feedback: Clearly indicate loading states (e.g., disable buttons, show spinners) during API calls.
## Server-Side (API Routes):


    *   Request Validation: Validate incoming request bodies (params, schema) rigorously at the beginning of each route handler. Return `400 Bad Request` with a clear error message if validation fails.
    *   External API Errors: Wrap calls to LLM APIs in `try...catch`. Handle specific error codes (e.g., 429 Rate Limit, 401 Unauthorized, 4xx/5xx) gracefully.
    *   Internal Errors: Catch any unexpected errors during processing.
    *   Consistent Error Responses: Return standardized JSON error responses (e.g., `{ error: { message: "User-friendly message", code: "INTERNAL_ERROR" } }`) with appropriate HTTP status codes (4xx for client errors, 5xx for server/LLM errors).
    *   Logging: Implement robust server-side logging (e.g., using `pino` or Next.js default logging configured appropriately). Log detailed error information (stack traces, request context) for debugging purposes. Do not expose sensitive details or stack traces in API responses sent to the client.

10. Code Style and Conventions

## Linting: Configure ESLint using `eslint-config-next`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`. Enforce rules strictly in the CI pipeline.


## Formatting: Use Prettier for automatic code formatting. Configure rules (semi-colons: true, single quotes: false, trailing commas: es5, print width: 80-100) in `.prettierrc` and integrate with IDEs and pre-commit hooks.


## Naming Conventions:


    *   Components: PascalCase (`PromptInputArea.tsx`)
    *   Files (non-component): kebab-case (`session-manager.ts`)
    *   Variables/Functions: camelCase (`activeSession`, `handleImprovePrompt`)
    *   Types/Interfaces: PascalCase (`SessionState`, `ImprovePromptRequest`)
    *   Constants: UPPER_SNAKE_CASE (`DEFAULT_TEMPERATURE`)
## TypeScript: Utilize strict mode. Define clear types/interfaces for props, state, API payloads (`/types/`). Avoid `any` where possible. Use utility types effectively.


## Components: Prefer functional components with Hooks. Keep components small and focused on a single responsibility. Prop drilling should be minimized by leveraging state management or component composition.


## Comments: Write clear comments for complex logic, non-obvious code sections, and `// TODO:` markers. Use TSDoc for documenting functions and types where appropriate.


## Git: Follow Conventional Commits standard for commit messages (e.g., `feat: add session forking button`, `fix: correct api error handling`). Use feature branches and Pull Requests for code review.



---