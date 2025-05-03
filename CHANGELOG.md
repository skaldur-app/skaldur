# CHANGELOG

## [0.1.0] - 2024-05-03

### Added
- Created central LLM configuration file `lib/model_details.ts` with detailed model parameters.
- Added Google Gemini 1.5 Pro & Flash models to the configuration.
- Added collapse/expand functionality to the `LlmToolbar`.
- Implemented `generateCompletion` method in all provider adapters:
  - `lib/llm_providers/openai.ts`
  - `lib/llm_providers/azure_openai.ts`
  - `lib/llm_providers/anthropic_sdk.ts`
  - `lib/llm_providers/anthropic_bedrock.ts` (Now correctly uses `@anthropic-ai/sdk`)
  - `lib/llm_providers/google_gemini.ts`
- Generation service `lib/llm_generation.ts` to route requests to the correct adapter.
- `isLoading` state and `setLoading` action to `sessionStore`.
- Backend API route `/api/generate/route.ts` for secure LLM generation.
- Backend API route `/api/validate-config/route.ts` for secure configuration validation.
- Loading indicator (`Loader2`) in `HistoryDisplay` while waiting for generation.
- Error display using `sonner` toasts triggered by `currentError` state in `MainChatArea`.
- Optional `baseUrl` configuration input for OpenAI/Anthropic providers in `ConfigSidebar`.
- Optional `azureApiVersion` configuration input for Azure provider in `ConfigSidebar`.
- Integrated `validateLlmConfig` into `ConfigSidebar` and `LlmToolbar` save actions.
- Added Azure Deployment Name input field to `ConfigSidebar` and `LlmToolbar` when Azure provider is selected.
- Added `generateCompletion` method to `ILlmProviderAdapter` interface (`lib/llm_providers/types.ts`).
- Added visual validation indicator (green checkmark) to provider display in `LlmToolbar` and `ConfigSidebar` after successful configuration save.

### Changed
- Refactored LLM settings management to use the central `model_details.ts` configuration.
- Set default LLM settings based on the new configuration in `sessionStore.ts`.
- Swapped LLM settings locations:
    - Destination LLM (Provider/Model only) moved to hovering `LlmToolbar`.
    - Interaction LLM (Provider/Model/Temp/Tokens) moved back to `ConfigSidebar`.
- `LlmToolbar` now displays Destination LLM, is hovering, animated, and compact.
- `ConfigSidebar` now displays Interaction LLM with sliders and uses central config.
- Repositioned "+" button in the SessionSidebar to be directly next to the "Sessions" text.
- Converted sidebar components to use only retractable versions instead of fixed desktop versions.
- Redesigned the LlmToolbar to be a horizontal, always-visible toolbar at the top of the content area.
- Reorganized LLM settings into a two-line layout with dropdowns on top and sliders on bottom.
- Added direct inline editing of LLM settings without needing to navigate to the sidebar.
- Updated LlmToolbar to be absolutely positioned (hovering) over the content area.
- Made the LlmToolbar more compact horizontally by setting fixed widths for controls.
- Enhanced the LlmToolbar collapse/expand animation using scale and opacity transitions.
- Integrated `generateLlmCompletion` service into `MainChatArea.tsx`'s `handleSubmitPrompt`, replacing mock logic.
- `MainChatArea.tsx` now uses `isLoading` state from the store.
- `MainChatArea.tsx` now calls the `/api/generate` backend endpoint instead of client-side service.
- `ConfigSidebar.tsx` and `LlmToolbar.tsx` now call the `/api/validate-config` backend endpoint.
- Client-side components (`ConfigSidebar`, `LlmToolbar`) no longer construct `ProviderConfig` or handle API keys directly.
- `PromptInputArea` now disables controls and shows loading state on button during generation.
- Updated `LlmSettings` type to include optional `baseUrl` and `azureApiVersion`.
- Updated API routes (`/api/generate`, `/api/validate-config`) and Azure adapter to handle optional `baseUrl` and `apiVersion` configurations.
- Temporarily using `baseUrl` field in `LlmSettings` to store Azure endpoint and Bedrock region in `ConfigSidebar` (needs refactor).
- Constrained max-width of `LlmToolbar` to `max-w-xl`.
- Filtered provider list in `LlmToolbar` to exclude Azure and Bedrock.
- Removed `output: 'export'` from `next.config.js` to enable dynamic API routes required for server-side validation and generation.

### Removed
- Removed Interaction LLM settings from the right sidebar (ConfigSidebar) to avoid duplication (before swap).
- Deleted unused `lib/llmProviders.ts` file.
- Deleted unused `components/feature/LlmConfiguration.tsx` component.
- Removed direct client-side API key handling (`process.env.NEXT_PUBLIC_...` for secrets) from `ConfigSidebar.tsx` and `LlmToolbar.tsx`.
- Commented out/deprecated insecure client-side credential handling in `lib/llm_generation.ts`.
- Azure/Bedrock specific configuration inputs from `LlmToolbar`.

### Fixed
- Fixed the positioning of UI elements in sidebars to prevent overlap.
- Ensured proper return types for async functions to resolve TypeScript errors.
- Removed `timestamp` property from `addMessageToActiveSession` calls in `MainChatArea.tsx` as it's handled by the store.
- Resolved TypeScript errors in `LlmToolbar.tsx` and `ConfigSidebar.tsx` related to `LlmProviderId` type mismatch by using a type guard (`isLlmProviderId`).
- Addressed `react-hooks/exhaustive-deps` warnings in `useEffect` hooks in `LlmToolbar.tsx` and `ConfigSidebar.tsx` by using functional state updates.
- Exported `AZURE_API_VERSION` constant from `azure_openai.ts`.
- Added missing specific config type imports (`AzureOpenAIConfig`, etc.) in API routes.
- Corrected type narrowing for `AzureOpenAIConfig` in API routes.
- Resolved Next.js static generation error in `/api/validate-config` by explicitly marking the route as dynamic (`force-dynamic`).
- Adjusted padding in `LlmToolbar` to prevent UI elements from being cut off.
- Corrected rendering logic for validation indicator checkmarks.
- Addressed accessibility warnings by adding unique IDs/`htmlFor` attributes to form elements and labels in `ConfigSidebar`.
- Added accessible titles and descriptions to `Sheet` components in `ConfigSidebar` and `SessionSidebar`.

### Security
- Moved LLM API key handling and provider calls to backend API routes (`/api/generate`, `/api/validate-config`) to prevent exposing secrets to the client.

## [0.1.1] - YYYY-MM-DD

### Added
- Visual validation indicator (green checkmark) to provider display in `LlmToolbar` and `ConfigSidebar` after successful configuration save.

### Changed
- Removed `output: 'export'` from `next.config.js` to enable dynamic API routes required for server-side validation and generation.

### Fixed
- Resolved Next.js static generation error in `/api/validate-config` by explicitly marking the route as dynamic (`force-dynamic`).
- Adjusted padding in `LlmToolbar` to prevent UI elements from being cut off.
- Corrected rendering logic for validation indicator checkmarks.
- Addressed accessibility warnings by adding unique IDs/`htmlFor` attributes to form elements and labels in `ConfigSidebar`.
- Added accessible titles and descriptions to `Sheet` components in `ConfigSidebar` and `SessionSidebar`.

### Dependencies
- Added `@radix-ui/react-visually-hidden` for accessible hidden elements.

## [Unreleased]

### Added
- Modular LLM provider integration system (`lib/llm_providers/`, `lib/llm_validation.ts`).
- Support for OpenAI, Azure OpenAI, Anthropic (SDK & Bedrock), and Google Gemini providers.
- Credential validation mechanism (`validateLlmConfig`) for LLM configurations, triggered before saving.
- Interfaces for provider adapters and configurations (`lib/llm_providers/types.ts`).
- Individual provider adapters implementing validation logic:
  - `lib/llm_providers/openai.ts`
  - `lib/llm_providers/azure_openai.ts` (Uses `openai` SDK v4+)
  - `lib/llm_providers/anthropic_sdk.ts`
  - `lib/llm_providers/anthropic_bedrock.ts`
  - `lib/llm_providers/google_gemini.ts`
- Added `azure` and `anthropic-bedrock` provider types to `lib/model_details.ts`.
- Installed necessary SDK dependencies: `openai`, `@azure/openai`, `@anthropic-ai/sdk`, `@anthropic-ai/bedrock-sdk`, `@google/generative-ai`, `@aws-sdk/client-bedrock-runtime`.
- `ErrorModal` component (`components/ui/ErrorModal.tsx`) for displaying validation errors.
- Integrated `validateLlmConfig` into `ConfigSidebar` and `LlmToolbar` save actions.
- Added Azure Deployment Name input field to `ConfigSidebar` and `LlmToolbar` when Azure provider is selected.
- Added `generateCompletion` method to `ILlmProviderAdapter` interface (`lib/llm_providers/types.ts`).

### Changed
- Updated `lib/model_details.ts` to use specific `LlmProviderId` type and refined model listings.
- Refactored `lib/model_details.ts` helper functions (`getProviderById`, `getDefaultModelForProvider`, `getDefaultProvider`, `getDefaultSettings`) for robustness and handling of new providers/Azure deployments.
- Updated Azure OpenAI adapter (`lib/llm_providers/azure_openai.ts`) to use the standard `openai` SDK v4+ instead of the deprecated `@azure/openai` v1 client.
- Refactored `AnthropicBedrockSdkAdapter` (`lib/llm_providers/anthropic_bedrock.ts`) to use the standard `@anthropic-ai/sdk`, relying on environment variables for AWS configuration (region/credentials), and renamed class to `AnthropicBedrockSdkAdapter`.
- Updated `llm_validation.ts` to use `AnthropicBedrockSdkAdapter`.

### Removed
- Removed Interaction LLM settings from the right sidebar (ConfigSidebar) to avoid duplication (before swap).
- Deleted unused `lib/llmProviders.ts` file.
- Deleted unused `components/feature/LlmConfiguration.tsx` component.
- Removed direct client-side API key handling (`process.env.NEXT_PUBLIC_...` for secrets) from `ConfigSidebar.tsx` and `LlmToolbar.tsx`.
- Commented out/deprecated insecure client-side credential handling in `lib/llm_generation.ts`.
- Azure/Bedrock specific configuration inputs from `LlmToolbar`.

### Fixed
- Fixed the positioning of UI elements in sidebars to prevent overlap.
- Ensured proper return types for async functions to resolve TypeScript errors.
- Removed `timestamp` property from `addMessageToActiveSession` calls in `MainChatArea.tsx` as it's handled by the store.
- Resolved TypeScript errors in `LlmToolbar.tsx` and `ConfigSidebar.tsx` related to `LlmProviderId` type mismatch by using a type guard (`isLlmProviderId`).
- Addressed `react-hooks/exhaustive-deps` warnings in `useEffect` hooks in `LlmToolbar.tsx` and `ConfigSidebar.tsx` by using functional state updates.
- Exported `AZURE_API_VERSION` constant from `azure_openai.ts`.
- Added missing specific config type imports (`AzureOpenAIConfig`, etc.) in API routes.
- Corrected type narrowing for `AzureOpenAIConfig` in API routes.
- Resolved Next.js static generation error in `/api/validate-config` by explicitly marking the route as dynamic (`force-dynamic`).
- Adjusted padding in `LlmToolbar` to prevent UI elements from being cut off.
- Corrected rendering logic for validation indicator checkmarks.
- Addressed accessibility warnings by adding unique IDs/`htmlFor` attributes to form elements and labels in `ConfigSidebar`.
- Added accessible titles and descriptions to `Sheet` components in `ConfigSidebar` and `SessionSidebar`.

### Security
- Moved LLM API key handling and provider calls to backend API routes (`/api/generate`, `/api/validate-config`) to prevent exposing secrets to the client.