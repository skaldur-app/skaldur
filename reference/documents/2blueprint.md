# Skaldur Technical Blueprint

**Version:** 1.0
**Date:** 2025-05-03

## 1. Project Overview

*   **High-level description:** Skaldur is a web-based workbench application designed to assist users in the systematic, iterative refinement of text prompts intended for Large Language Models (LLMs). It provides a structured interface and AI-driven assistance to enhance prompt quality and effectiveness for specific target models.
*   **Core functionalities:**
    *   Iterative prompt input, enhancement selection (Type/Style), and AI-assisted refinement.
    *   Targeting specific destination LLMs (e.g., GPT-4o, Claude 3 Opus) to tailor improvements.
    *   Session-based workflow with visual chat history tracking prompt evolution.
    *   Session management including creation, switching, automatic naming, and forking.
    *   Configuration of Interaction LLM settings (Provider, Model, Temp, Max Tokens) locked per session.
    *   Dynamic loading of backend-defined Improvement Types and Styles.
    *   Dual retractable sidebar interface for session management and configuration.
    *   Persistence of all session data within the browser's Local Storage.
*   **Target users/use cases:** Developers, writers, content creators, researchers, marketers, educators, AI enthusiasts – anyone frequently interacting with LLMs who seeks a structured method to optimize prompts for better and more consistent results. Use cases include refining prompts for text generation, coding assistance, data analysis, chatbot interactions, creative writing, etc.
*   **Technical approach:** A Single Page Application (SPA) built using the Next.js App Router, leveraging React for the UI, TypeScript for type safety, Tailwind CSS and Shadcn/ui for styling and components, Zustand for state management, and SWR for client-side data fetching. Backend logic is handled via Next.js Route Handlers, interacting with external LLM APIs. Data persistence for V1 relies exclusively on Browser Local Storage.

## 2. System Architecture

*   **Architecture diagram (text description):**
    Skaldur employs a client-server architecture facilitated by the Next.js full-stack framework:
    1.  **Client (Browser - Next.js Frontend):** The user interacts with the Skaldur SPA. This component, built with React, TypeScript, and Shadcn/ui, manages the UI rendering, captures user inputs, handles client-side state via Zustand, persists session data to Local Storage, and communicates with the backend API via SWR and fetch.
    2.  **Backend (Next.js API Routes):** A set of RESTful API endpoints defined using Next.js Route Handlers within the same project (`/app/api`). This layer handles business logic, validates requests, securely manages and utilizes LLM API keys (stored in environment variables), interacts with external LLM services, serves dynamic configuration (Improvement Types, Styles, LLM options), and processes prompt improvement and session naming requests.
    3.  **Browser Local Storage:** Acts as the primary data store for V1. The client-side Zustand store is configured to persist session metadata, message history, and locked settings here, enabling session resumption on the same browser.
    4.  **External LLM APIs:** Third-party services (e.g., OpenAI API, Anthropic API, Google Gemini API) invoked by the Skaldur backend to perform AI-driven tasks like prompt refinement (using the configured Interaction LLM) and session naming.

*   **Key components and their relationships:**
    *   `UI Components (React/Shadcn)`: Render the layout (sidebars, main area), input elements (textarea, dropdowns), history display, and modals. Trigger state changes and API calls based on user interaction.
    *   `State Management (Zustand)`: Central store holding global application state: list of all sessions (`sessions` metadata), detailed data for active/loaded sessions (`sessionDetails`), active session identifier (`activeSessionUUID`), fetched configuration (`configOptions`), and UI state (`uiState`).
    *   `Persistence Middleware (Zustand)`: Automatically synchronizes specified parts of the Zustand store with Browser Local Storage.
    *   `API Client Logic (SWR/fetch)`: Frontend utilities (`lib/api-client.ts`) responsible for making typed requests to the backend API endpoints, handling responses, and managing client-side caching for configuration data (SWR).
    *   `Backend API Routes (Next.js Route Handlers)`: Server-side functions handling specific HTTP requests. They parse requests, validate data, interact with configuration files or backend logic, call external LLM APIs via `LLM Interaction Utilities`, and format responses.
    *   `LLM Interaction Utilities (Backend)`: Server-side helper functions (`lib/llm-utils.server.ts`) abstracting the communication details with various external LLM providers, ensuring secure API key handling.
    *   `Configuration Store (Backend)`: Simple backend storage (e.g., JSON files in `config/`) holding definitions for Improvement Types, Styles, and available LLM options. Served via an API endpoint.

*   **Data flow between components:**
    1.  **App Load:** Frontend requests `/api/config/improvement-options`. Backend reads JSON config files and returns options. Frontend stores options in Zustand (`config-slice`). Zustand hydrates session state (`session-slice`) from Local Storage. UI renders session list and potentially the last active session.
    2.  **New Session:** User clicks "+". Zustand action (`session-slice`) creates a new session entry with a timestamp name and unique UUID, sets it as active. Right sidebar shows unlocked LLM configuration inputs.
    3.  **First Improvement:** User inputs prompt, selects Type/Style, configures Interaction/Destination LLMs. Clicks Submit. Frontend sends data (`ImprovePromptRequest`, including LLM settings) to `/api/improve`. Backend validates, *conceptually* locks settings for the session UUID (locking is enforced by client not resending settings), constructs meta-prompt, calls Interaction LLM via utils, gets improved prompt. Backend returns `ImprovePromptResponse`. Frontend updates active session details (adds messages, stores locked settings) in Zustand (`session-slice`), populates input area.
    4.  **Session Naming:** After first successful improvement, frontend triggers call to `/api/name-session` with initial prompt/response. Backend calls Interaction LLM for a name, returns `NameSessionResponse`. Frontend updates session metadata (name) in Zustand (`session-slice`).
    5.  **Subsequent Improvement:** User edits prompt, selects Type/Style, clicks Submit. Frontend sends data (`ImprovePromptRequest`, *without* LLM settings) to `/api/improve`. Backend identifies session via UUID, retrieves locked settings context (implicitly, as client doesn't resend), performs improvement, returns result. Frontend updates session details.
    6.  **Switch Session:** User clicks session in left sidebar. Zustand action updates `activeSessionUUID`. UI re-renders, displaying the selected session's history and locked settings from `sessionDetails`.
    7.  **Fork Session:** User clicks "Fork". Zustand action duplicates active session's details into a new session object (new UUID, `lockedSettings: null`), adds it to state, and sets it as active. Right sidebar shows unlocked configuration inputs for the new session.

*   **Integration points with external systems:**
    *   External LLM Provider APIs (e.g., OpenAI, Anthropic, Google AI) via secure backend requests.

## 3. Technology Stack

*   **Frontend Technologies and Libraries:**
    *   **Framework:** Next.js (v14+ with App Router) - *Justification: Provides integrated full-stack capabilities, optimized performance (RSC, SSR), file-based routing, and a robust ecosystem.*
    *   **Language:** TypeScript (v5+) - *Justification: Enhances code reliability, maintainability, and developer experience through static typing.*
    *   **UI Library:** React (v18+) - *Justification: Core of Next.js, enables component-based architecture and rich ecosystem.*
    *   **Styling:** Tailwind CSS (v3+) - *Justification: Utility-first approach enables rapid UI development, consistency, and maintainability.*
    *   **Component Library:** Shadcn/ui - *Justification: Provides accessible, unstyled, composable components built on Radix UI & Tailwind, accelerating development while allowing full style control.*
    *   **State Management:** Zustand (v4+) - *Justification: Simple API, minimal boilerplate, hook-based, excellent middleware support for persistence.*
    *   **Data Fetching (Client):** SWR (v2+) - *Justification: Efficient client-side data fetching with caching, revalidation, and hooks API. `fetch` for POST requests.*
*   **Backend Technologies and Frameworks:**
    *   **Framework:** Next.js Route Handlers (`/app/api/`) - *Justification: Colocates backend with frontend, leverages Next.js environment, simplifies deployment.*
    *   **Language:** TypeScript (v5+)
    *   **HTTP Client:** Native `fetch` API (Node.js 18+) / `axios` (optional) - *Justification: Sufficient for making external API calls from backend.*
*   **Database and Storage Solutions:**
    *   **Primary Storage (V1):** Browser Local Storage - *Justification: Meets V1 requirement for client-side persistence without backend database or user accounts. Simple integration via Zustand middleware.*
    *   **Configuration Storage (Backend):** JSON files (`config/*.json`) - *Justification: Simple, version-controllable storage for backend configuration in V1.*
*   **Authentication/Authorization Mechanisms:**
    *   **V1:** None - *Justification: Initial scope focuses on local utility; no user accounts or cross-device sync required.*
*   **Deployment and Hosting Considerations:**
    *   **Recommended Platform:** Vercel - *Justification: Seamless integration with Next.js, optimized hosting, serverless functions for API routes, global CDN, CI/CD.*
    *   **Alternatives:** Netlify, AWS Amplify, Cloudflare Pages, self-hosting with Docker.

## 4. Core Features

1.  **Iterative Prompt Enhancement Workflow**
    *   **Description:** Core loop where users input text, select Improvement Type/Style, submit, and receive an AI-refined prompt in the input area, with history updated.
    *   **Implementation:** `PromptInputArea` component manages textarea state and selected Type/Style (from `ImprovementSelectors`). On submit, it calls the `improvePrompt` function from `lib/api-client.ts`, passing the current prompt, selections, and session context. The API client POSTs to `/api/improve`. On success, the response updates the Zustand store (`session-slice`) via `useSessionManager` hook, adding user/assistant messages and updating the input area content via state binding.
    *   **Challenges:** Ensuring LLM follows refinement instructions accurately (prompt engineering for meta-prompts), handling LLM latency, preserving special user formatting (e.g., `{{$variables}}`).
    *   **Solutions:** Carefully craft system prompts and templates within `config/improvement-options.json`. Use clear loading indicators (button disabled, spinner). Instruct the Interaction LLM within the meta-prompt to preserve specific syntax patterns.

2.  **Targeted Prompt Destination**
    *   **Description:** Users specify the target LLM (Provider/Model) for the final prompt before starting refinement in a session, influencing the enhancement process. Locked after first submission.
    *   **Implementation:** `LlmConfiguration` component within `ConfigSidebar` allows selection before the session is locked. Selected Provider/Model stored temporarily, then included in the first `/api/improve` request. Backend uses this info to add context to the Interaction LLM's meta-prompt (e.g., "Optimize this prompt for Claude 3 Opus"). The setting is stored in `lockedSettings` within `sessionDetails` state after the first call.
    *   **Challenges:** Making the destination context meaningfully influence the Interaction LLM; keeping target LLM list current.
    *   **Solutions:** Start with generic hints in the meta-prompt based on model family. Allow easy updates to `config/llm-options.json`.

3.  **Session-Based Organization with Chat History**
    *   **Description:** Work is organized into sessions, each with a scrollable chat history showing user inputs and AI refinements.
    *   **Implementation:** Zustand `session-slice` manages `sessions` (metadata map) and `sessionDetails` (data map including `messages` array). `HistoryDisplay` component selects `messages` for the `activeSessionUUID` and renders them using `ChatMessage` components within a `ScrollArea`.
    *   **Challenges:** UI performance with extremely long histories (unlikely given Local Storage limits).
    *   **Solutions:** Ensure efficient React rendering. Virtualization is an option but likely premature optimization for V1.

4.  **Session Management & Auto-Naming**
    *   **Description:** Left sidebar lists sessions; users can create, switch. Sessions are auto-named after the first interaction.
    *   **Implementation:** `SessionSidebar` displays items using `SessionListItem`, reading metadata from `sessions` state. "+" button triggers `createNewSession` action (in `session-slice` via `useSessionManager`). Clicking item triggers `setActiveSessionUUID`. After first successful `/api/improve` response, frontend triggers `/api/name-session`. Backend calls LLM, returns name. Frontend calls `updateSessionName` action.
    *   **Challenges:** Generating consistently relevant and concise names. Handling potential naming API errors.
    *   **Solutions:** Fine-tune the naming meta-prompt. Log naming errors silently or with minimal user disruption.

5.  **Configurable Improvement Types & Styles**
    *   **Description:** Dropdowns allow selection of predefined enhancement strategies (Types) and optional stylistic modifiers (Styles).
    *   **Implementation:** `ImprovementSelectors` component fetches options via SWR from `/api/config/improvement-options` (data stored in `config-slice`). Selected values are managed locally within the component or parent (`PromptInputArea`) and included in `/api/improve` requests. Backend uses `improvementTypeId` and `improvementStyle` to construct the meta-prompt.
    *   **Challenges:** Defining effective Types/Styles and their corresponding backend prompts/templates.
    *   **Solutions:** Iterative design and testing of improvement configurations stored in `config/improvement-options.json`.

6.  **Locked Interaction Settings Per Session**
    *   **Description:** Interaction LLM settings (Provider, Model, Temp, Max Tokens) are configured once per session and locked after the first improvement request.
    *   **Implementation:** `LlmConfiguration` in `ConfigSidebar` used for initial selection. Settings sent with the first `/api/improve` request. Frontend stores these settings in the active session's `lockedSettings` field within `sessionDetails` state. `ConfigSidebar` then displays these read-only. Subsequent `/api/improve` calls do not resend these settings; backend relies on context associated with the session UUID (implicitly).
    *   **Challenges:** Clearly communicating the locking mechanism to the user.
    *   **Solutions:** Visually disable inputs in `ConfigSidebar` after locking. Display locked settings clearly. Use tooltips.

7.  **Session Forking**
    *   **Description:** Duplicates the current session (history, last prompt) into a new, unlocked session.
    *   **Implementation:** "Fork Session" button in `ConfigSidebar` (visible when locked) triggers `forkSession` action (via `useSessionManager`). Action performs a deep copy of the active session's details, generates a new UUID, sets `lockedSettings` to null, adds to `sessions` and `sessionDetails`, and sets the new session as active.
    *   **Challenges:** Ensuring correct deep copy of potentially complex state.
    *   **Solutions:** Use structured cloning or Immer within Zustand reducers if necessary.

8.  **Dual Sidebar Interface**
    *   **Description:** Left sidebar for sessions, right for configuration/status. Both retractable.
    *   **Implementation:** Use Shadcn `Sheet` component for both sidebars within `app/(main)/layout.tsx`. Manage open/close state via Zustand `ui-slice` and potentially `use-sidebar-toggle` hook.
    *   **Challenges:** Responsive behavior on smaller screens.
    *   **Solutions:** Configure `Sheet` behavior (modal overlay vs. push) based on screen size using Tailwind responsive utilities.

9.  **Local Browser Persistence**
    *   **Description:** All session data saved automatically to browser's Local Storage.
    *   **Implementation:** Utilize `persist` middleware from `zustand/middleware` within `store/session-slice.ts`. Configure it to save `sessions`, `sessionDetails`, and `activeSessionUUID` under a specific key.
    *   **Challenges:** Local Storage size limits (~5-10MB), data volatility (user clearing data).
    *   **Solutions:** Be mindful of data size. Communicate limitations to the user (implicitly by nature of local app). Future versions might offer cloud backup.

## 5. Data Models

*   **Key Entities and Relationships:**
    *   `Session`: Represents a single prompt refinement workflow. Identified by a UUID. Contains metadata (name, timestamps) and detailed state (messages, locked settings).
    *   `Message`: A single entry in a session's history (user input or assistant response). Belongs to a Session.
    *   `LLMSettings`: Configuration for an LLM (Provider, Model, parameters). Used for Interaction and Destination contexts. Stored within a Session's locked state.
    *   `ImprovementType` / `ImprovementStyle`: Configuration entities defining refinement options. Served by the backend, not stored per session.

*   **Local Storage Schema Outline (Conceptual structure within Zustand persisted state):**

    ```typescript
    // Persisted under a single key, e.g., 'skaldur-storage'
    interface PersistedState {
      state: {
        sessions: { // Map for quick lookup of metadata for session list
          [uuid: string]: SessionMetadata;
        };
        sessionDetails: { // Map holding full data for loaded/active sessions
          [uuid: string]: SessionDetails;
        };
        activeSessionUUID: string | null;
        // Potentially other persisted state slices (e.g., UI preferences)
      };
      version: number; // For state migrations
    }

    interface SessionMetadata {
      uuid: string;
      name: string; // Generated name or initial timestamp
      createdAt: number;
      lastModified: number;
    }

    interface SessionDetails {
      uuid: string;
      messages: Message[];
      lockedSettings: LockedSettings | null; // Null until first improvement
      // Optional: lastPromptDraft: string; // If saving unsubmitted input is needed
    }

    interface Message {
      id: string; // Unique message ID (e.g., cuid() or nanoid())
      role: 'user' | 'assistant';
      content: string;
      timestamp: number;
    }

    interface LockedSettings {
      interactionLLM: InteractionLLMSettings;
      destinationLLM: DestinationLLMSettings;
    }

    interface InteractionLLMSettings {
      provider: string;
      model: string;
      temperature: number;
      maxTokens: number;
    }

    interface DestinationLLMSettings {
      provider: string;
      model: string;
    }
    ```

*   **Data Validation Rules:**
    *   `Session UUID`: Must conform to UUID format.
    *   `Message Content`: Must be a non-empty string. Consider reasonable length limits if necessary.
    *   `InteractionLLMSettings`: Provider/Model from predefined lists (`config/llm-options.json`). Temperature (0.0-2.0). Max Tokens (>0 integer).
    *   `DestinationLLMSettings`: Provider/Model from predefined lists.
    *   API Inputs (`userInput`, `improvementTypeId`, `improvementStyle`): Validate presence and format/allowed values on backend.

## 6. API Design

*   **API Architecture:** RESTful API implemented using Next.js Route Handlers.
*   **Base URL:** `/api`
*   **Key Endpoints:**

    1.  **Fetch Configuration Options**
        *   **Endpoint:** `/config/improvement-options`
        *   **Method:** `GET`
        *   **Purpose:** Retrieve dynamic configuration for the frontend (Improvement Types, Styles, available LLMs).
        *   **Authentication:** None.
        *   **Request:** None.
        *   **Response (200 OK):** `ImprovementOptionsResponse` (defined in `types/config.ts`) containing arrays for `types`, `styles`, `interactionLlmOptions`, `destinationLlmOptions`.
            ```typescript
            interface ImprovementOptionsResponse {
              types: ImprovementTypePublic[]; // Excludes backend-only fields
              styles: string[];
              interactionLlmOptions: LLMOptionGroup[];
              destinationLlmOptions: LLMOptionGroup[];
            }
            interface ImprovementTypePublic {
              id: string;
              name: string;
              icon: string;
              description: string;
            }
            // LLMOptionGroup, LLMOption defined in types/config.ts
            ```
        *   **Response (500 Error):** `{ error: { message: string } }`

    2.  **Improve Prompt**
        *   **Endpoint:** `/improve`
        *   **Method:** `POST`
        *   **Purpose:** Submit user prompt and context for AI-driven refinement.
        *   **Authentication:** None (relies on backend API key security).
        *   **Request Body:** `ImprovePromptRequest` (defined in `types/api.ts`)
            ```typescript
            interface ImprovePromptRequest {
              sessionUUID: string;
              userInput: string;
              improvementTypeId: string;
              improvementStyle: string; // e.g., 'No Style'
              // Only sent on the *first* request for a session:
              interactionLLM?: InteractionLLMSettings;
              destinationLLM?: DestinationLLMSettings;
            }
            ```
        *   **Backend Logic:** Validate request. If `interactionLLM` present, treat as first request (client handles storing/locking). Retrieve `ImprovementType` config based on `improvementTypeId`. Construct meta-prompt using system prompt, template, user input, style, destination context. Call configured Interaction LLM via utils. Handle LLM errors.
        *   **Response (200 OK):** `ImprovePromptResponse` (defined in `types/api.ts`)
            ```typescript
            interface ImprovePromptResponse {
              improvedPrompt: string;
              sessionUUID: string; // Echo back for client confirmation
            }
            ```
        *   **Response (400 Bad Request):** `{ error: { message: string, code?: string } }` (Validation error)
        *   **Response (500 Internal Server Error):** `{ error: { message: string, code?: string } }` (LLM API error, backend processing error)

    3.  **Name Session**
        *   **Endpoint:** `/name-session`
        *   **Method:** `POST`
        *   **Purpose:** Generate a session name based on initial interaction.
        *   **Authentication:** None.
        *   **Request Body:** `NameSessionRequest` (defined in `types/api.ts`)
            ```typescript
            interface NameSessionRequest {
              sessionUUID: string;
              initialPrompt: string;
              firstResponse: string;
            }
            ```
        *   **Backend Logic:** Validate request. Retrieve Interaction LLM context associated with `sessionUUID` (implicitly, based on client locking). Construct naming meta-prompt. Call Interaction LLM via utils. Handle errors.
        *   **Response (200 OK):** `NameSessionResponse` (defined in `types/api.ts`)
            ```typescript
            interface NameSessionResponse {
              sessionName: string;
              sessionUUID: string;
            }
            ```
        *   **Response (400 Bad Request):** `{ error: { message: string, code?: string } }`
        *   **Response (500 Internal Server Error):** `{ error: { message: string, code?: string } }`

*   **Authentication and Security Considerations:**
    *   **API Keys:** MUST be stored securely as environment variables on the server (`.env.local`, `.env.production`) and accessed only by backend API routes. NEVER expose to the client.
    *   **CORS:** Configure CORS headers on API routes to restrict access to the allowed frontend origin(s). Use Next.js middleware or route configuration.
    *   **Rate Limiting:** Implement rate limiting on `/api/improve` and `/api/name-session` to prevent abuse and control LLM costs. Use libraries like `upstash/ratelimit` or platform features (e.g., Vercel Firewall).
    *   **Input Validation:** Rigorously validate all incoming request bodies on the backend using libraries like Zod (`lib/validation.ts`).

## 7. User Interface

*   **Key Screens/Pages:** Primarily a single-page application view structured with:
    *   Retractable Left Sidebar (`SessionSidebar`)
    *   Main Content Area (`HistoryDisplay`, `PromptInputArea`)
    *   Retractable Right Sidebar (`ConfigSidebar`)
*   **Component Hierarchy (Conceptual):**
    ```
    AppLayout (app/(main)/layout.tsx)
    ├── SessionSidebar (Sheet)
    │   └── SessionListItem (map)
    ├── MainContentArea (page.tsx)
    │   ├── HistoryDisplay (ScrollArea)
    │   │   └── ChatMessage (map)
    │   └── PromptInputArea
    │       ├── Textarea
    │       ├── ImprovementSelectors
    │       │   ├── Select (Type)
    │       │   └── Select (Style)
    │       └── Button (Submit)
    └── ConfigSidebar (Sheet)
        ├── LlmConfiguration (Interaction - conditional)
        ├── LlmConfiguration (Destination - conditional)
        ├── ReadOnlyDisplay (Locked Settings - conditional)
        └── Button (Fork - conditional)
    GlobalErrorModal (Dialog - triggered by ui-slice state)
    ```
*   **State Management Approach:**
    *   **Global (Zustand):** Managed via `useStore` hook accessing combined slices.
        *   `session-slice`: `sessions` (metadata map), `sessionDetails` (data map), `activeSessionUUID`. Handles persistence.
        *   `config-slice`: Fetched `improvementOptions`, `llmOptions`, loading/error states.
        *   `ui-slice`: Sidebar open states, `currentError` for modal, global loading indicators.
    *   **Local (`useState`, `useRef`):**
        *   Textarea content within `PromptInputArea`.
        *   Selected Type/Style within `ImprovementSelectors` before submission.
        *   LLM settings within `LlmConfiguration` before locking.
        *   Component-specific loading/disabled states (e.g., submit button).
*   **Responsive Design Considerations:**
    *   Use Tailwind CSS responsive modifiers (`sm:`, `md:`, `lg:`) for layout adjustments.
    *   Sidebars (`Sheet`) should likely become modal overlays on smaller screens.
    *   Ensure touch targets (buttons, dropdowns) are adequately sized.
    *   Test layout fluidity across common device breakpoints.

## 8. Security Considerations

*   **Authentication Approach:**
    *   V1: None. The application operates locally without user accounts.
*   **Authorization Model:**
    *   V1: None. All data is controlled by the user within their browser's Local Storage.
*   **Data Protection Mechanisms:**
    *   **API Key Security:** Paramount. LLM keys stored server-side via environment variables, accessed only by backend Route Handlers.
    *   **Transport Security:** Ensure deployment uses HTTPS (standard on platforms like Vercel).
    *   **Input Validation:** Backend API routes must validate all incoming data types, formats, and values.
    *   **CORS:** Implement strict CORS policies on API routes.
    *   **Rate Limiting:** Protect backend endpoints from abuse and excessive LLM costs.
    *   **Local Storage:** Acknowledge data is unencrypted and accessible by scripts on the same origin. Avoid storing sensitive data.
*   **Security Best Practices to Implement:**
    *   Keep dependencies updated (`npm audit` / `yarn audit`).
    *   Use security linters (`eslint-plugin-security`).
    *   Configure appropriate HTTP Security Headers (Next.js defaults are good, can be customized).
    *   Sanitize output *only if* user-generated content (like prompts or LLM responses) were ever rendered directly as HTML outside React's standard rendering (unlikely in this architecture).

## 9. Performance Considerations

*   **Expected Load and Scaling Considerations:**
    *   V1 focuses on single-user, client-side load. Performance tied to browser capability and Local Storage size/speed.
    *   Backend API (Route Handlers) scales based on serverless platform capabilities.
    *   **Primary Scaling Limit:** External LLM API rate limits and concurrency.
    *   **Local Storage Limit:** ~5-10MB constraint on total persisted session data per origin.
*   **Performance Optimization Strategies:**
    *   **Frontend:**
        *   Utilize Next.js App Router features (Server Components for static parts, Client Components where interactivity is needed).
        *   Code splitting (automatic per route).
        *   Bundle analysis (`@next/bundle-analyzer`).
        *   React memoization (`React.memo`, `useMemo`, `useCallback`) where appropriate.
        *   Efficient state selection in Zustand to minimize re-renders.
        *   Virtualization for `HistoryDisplay` if message counts become extremely large (likely > hundreds).
        *   Debounce frequent inputs if necessary (though not typical for textareas).
        *   Clear loading states for API calls and session switching.
    *   **Backend:**
        *   Optimize meta-prompts sent to LLMs for efficiency.
        *   Ensure non-blocking I/O for LLM calls.
        *   Cache configuration data in memory if read frequently.
        *   Monitor serverless function performance (cold starts, execution time).
*   **Caching Approaches:**
    *   **Client-Side API Data:** SWR for caching `/api/config/improvement-options`.
    *   **Browser Caching:** Standard HTTP caching for static assets (handled by Next.js/Vercel).
    *   **Backend:** In-memory caching for JSON configuration files. Avoid caching LLM responses due to their non-deterministic nature.
*   **Resource Optimization:**
    *   **Local Storage:** Monitor data size stored per session. Avoid storing redundant information. Implement pruning strategies only if limits become a practical issue.
    *   **LLM Usage:** Use appropriate `maxTokens` and potentially choose cost-effective Interaction LLM models. Implement backend logic to handle LLM API errors (e.g., rate limits) gracefully.

## 10. Testing Strategy

*   **Unit Testing Approach:**
    *   **Scope:** Individual React components, utility functions (`lib/`), custom hooks (`hooks/`), Zustand store slices/actions.
    *   **Tools:** Vitest (runner), React Testing Library (RTL) (components/hooks), Zustand testing utilities.
    *   **Goal:** Verify component rendering, state logic, utility function correctness, store state transitions in isolation. Mock dependencies (API calls via MSW, Local Storage).
*   **Integration Testing Plan:**
    *   **Scope:** Interactions between components, client-side API calls (mocked), state updates, backend API route logic (mocking external LLMs).
    *   **Client-Side:** Test component compositions and workflows using RTL and MSW to mock backend responses.
    *   **Backend-Side:** Test API Route Handlers using Vitest/Supertest, sending mock requests, validating responses, mocking `llm-utils.server.ts`.
    *   **Goal:** Ensure components and services integrate correctly according to contracts.
*   **End-to-End (E2E) Testing Considerations:**
    *   **Scope:** Test critical user flows through the entire application in a real browser environment.
    *   **Flows:** New session creation & config -> First improvement -> Auto-naming -> Subsequent improvement -> Session switching -> Session forking -> Error handling display.
    *   **Tools:** Playwright (recommended) or Cypress.
    *   **Goal:** Validate the application works as expected from the user's perspective.
*   **Testing Tools and Frameworks:**
    *   **Runner/Assertions:** Vitest
    *   **Component/Hook Testing:** React Testing Library (`@testing-library/react`, `@testing-library/hooks`)
    *   **API Mocking:** Mock Service Worker (MSW)
    *   **Backend API Testing:** Supertest (or Vitest's native fetch mocking)
    *   **E2E Testing:** Playwright
    *   **CI Integration:** Automate linting, unit, integration (and optionally E2E) tests in CI pipeline (e.g., GitHub Actions).

## 11. Deployment Strategy

*   **CI/CD Pipeline Recommendations:**
    *   **Platform:** GitHub Actions (or GitLab CI, Vercel Deploy Hooks).
    *   **Workflow:** Trigger on push/merge to main (prod) and feature branches (preview). Steps: Checkout -> Setup Node -> Install Deps (`npm ci`) -> Lint -> Test (Unit/Integration) -> Build (`npm run build`) -> Deploy (using Vercel CLI or platform integration). Optionally run E2E tests against preview deployments.
*   **Environment Setup:**
    *   **Development:** Local machine (`.env.local`).
    *   **Preview/Staging:** Automatic branch deployments (Vercel Previews). Use separate staging environment variables if needed.
    *   **Production:** Main branch deployment (`.env.production`). Manage environment variables securely via hosting platform UI.
*   **Infrastructure Considerations:**
    *   **Hosting:** Vercel (highly recommended).
    *   **Domain:** Configure custom domain.
*   **Monitoring and Logging Approach:**
    *   **Frontend:** Error Tracking (Sentry, LogRocket), Analytics (Vercel Analytics, Plausible/GA).
    *   **Backend:** Vercel Function Logs for API routes. Structured logging if needed. Monitor function performance (duration, errors, memory).
    *   **Uptime:** External uptime monitoring service (UptimeRobot, Better Uptime).

## 12. Future Considerations

*   **Potential Scalability Challenges:**
    *   **Local Storage Limits:** Will require migration to a backend database (e.g., PostgreSQL, Firestore) and user authentication (e.g., NextAuth.js) to support more data or cross-device sync.
    *   **LLM API Costs/Limits:** May necessitate usage quotas, optimized Interaction LLM choices, or caching strategies if applicable.
*   **Feature Expansion Possibilities:**
    *   User Accounts & Cloud Synchronization.
    *   Prompt Library / Templates (saving/reusing prompts).
    *   Collaboration / Session Sharing.
    *   Direct "Test Prompt" functionality against Destination LLM.
    *   Advanced analytics on prompt effectiveness.
    *   Import/Export sessions.
    *   Support for more LLM providers and models.
*   **Technology Evolution Considerations:**
    *   Monitor updates to Next.js (Server Actions, RSC patterns), React, and LLM provider APIs.
    *   Adapt to new best practices in state management or styling if significant advantages emerge.
    *   Consider alternative backend approaches (e.g., dedicated microservice) only if API logic complexity grows substantially beyond Route Handlers' suitability.