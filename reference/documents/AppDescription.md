**Prompt Improver Web Application Concept**

This web application provides a user interface designed for iteratively refining and enhancing text prompts intended for use with various Large Language Models (LLMs). It acts as an intelligent assistant, helping users transform basic ideas into well-structured and effective prompts optimized for specific AI providers and models.

**Core Workflow & Interface:**

The main interface features a central multi-line text area where users input their initial prompt. Above this area, a scrollable chat-like history displays the sequence of user submissions and the corresponding LLM-generated improvements for the current session.

Users initiate the process by entering a prompt. Before submitting for the first time in a session, they configure the target settings. Upon submission, the user's prompt appears as a chat bubble in the history. The application sends the prompt, along with selected improvement parameters, to a backend service. When the enhanced prompt is returned, it populates the main text area, ready for the user to review, edit further, or accept. Subsequent submissions of edited prompts add the submitted version to the chat history and fetch a new refinement, allowing for an iterative improvement cycle.

**Prompt Improvement Mechanism:**

The refinement process is guided by user selections:

*   **Improvement Type:** Users select from a list of predefined improvement strategies (e.g., "Enhance Prompt", "Add Detail", "Specify Format"), fetched from the backend. Each Type has a specific configuration including an icon, description, system prompt, and template used by the backend LLM.
*   **Style:** An optional dropdown allows users to apply a stylistic modifier (e.g., "Concisely", "Formally", "Like im 5") to the chosen Improvement Type. This subtly adjusts the backend LLM's system prompt to influence the tone and structure of the improved prompt.

The application preserves the exact text entered by the user, including any special formatting or placeholder syntax like `{{$variables}}`, during the improvement process.

**LLM Configuration (Session-Locked):**

A key feature is the distinction between two LLM configurations, both set via the right-hand retractable sidebar **before the first prompt submission in a session**:

1.  **Interaction LLM:** The specific backend LLM (Provider, Model, Temperature, Max Tokens) used by the application *itself* to perform the prompt analysis and generate improvements/session names. The available options are pre-configured in the backend (API keys handled securely server-side).
2.  **Destination LLM:** Metadata specifying the intended target LLM (Provider and Model, e.g., GPT-4o, Claude-3.7) for which the *final* improved prompt is being optimized. This context influences how the Interaction LLM refines the prompt.

Once the first improvement request is sent for a session, **both the Interaction LLM settings and the Destination LLM selection become locked** for that session to ensure consistency. These locked settings are displayed read-only in the right sidebar.

**Session Management & Persistence:**

The application uses the browser's local storage to persist all user sessions.

*   **Left Sidebar:** A retractable sidebar lists all saved sessions. Users can switch between sessions, loading their complete state (chat history, last prompt in the editor, locked LLM settings).
*   **New Session:** A "+" button allows starting a fresh session, requiring the user to configure the Interaction and Destination LLMs.
*   **Session Naming:** New sessions are initially identified by a timestamp. After the first successful improvement, the app automatically uses the Interaction LLM to generate a concise, relevant name for the session based on its initial content, updating the sidebar display. Each session is internally managed by a unique UUID.
*   **Fork Session:** To reuse a session's content but target a different LLM or use different interaction parameters, a "Fork" button (likely near the locked settings) duplicates the current session's state into a *new*, unlocked session, allowing reconfiguration before the first submission.

**Backend Requirement:**

The application relies on a backend component to:

*   Securely store and use API keys for the configured Interaction LLMs.
*   Serve the definitions (name, icon, prompts, etc.) for Improvement Types and Styles.
*   Execute the prompt improvement logic by calling the selected Interaction LLM.
*   Handle the automatic session naming requests.

**Error Handling:**

Any errors encountered during backend communication or LLM processing (e.g., API errors, timeouts, malformed responses) are reported to the user via a clear modal dialog.

