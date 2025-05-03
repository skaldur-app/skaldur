# Skaldur File Documentation.

```FileTree
./
├── app/
│  ├── (main)/
│  │  ├── layout.tsx
│  │  └── page.tsx
│  ├── globals.css
│  └── layout.tsx
├── components/
│  ├── feature/
│  │  ├── ChatMessage.tsx
│  │  ├── HistoryDisplay.tsx
│  │  ├── ImprovementSelectors.tsx
│  │  ├── LlmConfiguration.tsx
│  │  ├── MainChatArea.tsx
│  │  ├── PromptInputArea.tsx
│  │  └── SessionListItem.tsx
│  ├── layout/
│  │  ├── ConfigSidebar.tsx
│  │  └── SessionSidebar.tsx
│  └── ui/
│     ├── accordion.tsx
│     ├── alert-dialog.tsxA
│     ├── alert.tsx
│     ├── aspect-ratio.tsx
│     ├── avatar.tsx
│     ├── badge.tsx
│     ├── breadcrumb.tsx
│     ├── button.tsx
│     ├── calendar.tsx
│     ├── card.tsx
│     ├── carousel.tsx
│     ├── chart.tsx
│     ├── checkbox.tsx
│     ├── collapsible.tsx
│     ├── command.tsx
│     ├── context-menu.tsx
│     ├── dialog.tsx
│     ├── drawer.tsx
│     ├── dropdown-menu.tsx
│     ├── error-modal.tsx
│     ├── form.tsx
│     ├── hover-card.tsx
│     ├── input-otp.tsx
│     ├── input.tsx
│     ├── label.tsx
│     ├── menubar.tsx
│     ├── navigation-menu.tsx
│     ├── pagination.tsx
│     ├── popover.tsx
│     ├── progress.tsx
│     ├── radio-group.tsx
│     ├── resizable.tsx
│     ├── scroll-area.tsx
│     ├── select.tsx
│     ├── separator.tsx
│     ├── sheet.tsx
│     ├── skeleton.tsx
│     ├── slider.tsx
│     ├── sonner.tsx
│     ├── switch.tsx
│     ├── table.tsx
│     ├── tabs.tsx
│     ├── textarea.tsx
│     ├── toast.tsx
│     ├── toaster.tsx
│     ├── toggle-group.tsx
│     ├── toggle.tsx
│     └── tooltip.tsx
├── hooks/
│  ├── use-toast.ts
│  └── useImprovementOptions.ts
├── lib/
│  ├── llmProviders.ts
│  └── utils.ts
├── store/
│  └── sessionStore.ts
├── types/
│  ├── api.ts
│  └── index.ts
├── CHANGELOG.md
├── components.json
├── FAILURELOG.md
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```


## `.cursorindexingignore`

Purpose: This file likely specifies files or directories that should be ignored by the Cursor code editor's indexing process.
Role: Helps improve performance or exclude irrelevant content during code analysis and indexing within the Cursor editor. (Content not provided).

## `.eslintrc.json`

Purpose: Configures ESLint, a static code analysis tool for identifying problematic patterns found in JavaScript/TypeScript code.
Role: Enforces code quality, style consistency, and helps prevent common errors by defining linting rules, plugins, and parser options for the project. (Content not provided).

## `.gitignore`

Purpose: Specifies intentionally untracked files and directories that Git should ignore.
Role: Prevents committing unnecessary files like build artifacts (.next, dist), dependency folders (node\_modules), environment variables (.env), log files, and OS-specific files into the version control repository. (Content not provided).

## `.gitignored`

Purpose: The purpose of this file is unclear without its content.
Role: It might be a custom ignore file for a specific tool or process, or potentially a typo (the standard Git ignore file is .gitignore). (Content not provided).

## `.specstory/.what-is-this.md`

Purpose: This file likely provides documentation or an explanation about the purpose and contents of the .specstory directory.
Role: Explains the function of the directory, which might be related to a specific testing framework, behavior-driven development (BDD) specifications, or user story tracking used within the project. (Content not provided).

## `app/(main)/layout.tsx`

Purpose: Defines the main layout structure for the core application interface, specifically for pages within the (main) route group.
Role: Wraps the primary content area (children) with shared UI elements: the SessionSidebar (left), the ConfigSidebar (right), and a global ErrorModal. It utilizes the useSessionStore to potentially manage sidebar visibility or other layout-related states.
Contents:

* `Component:` AppLayout (default export) \- Functional React component, client-side rendered ("use client").
* `Hooks:` useSessionStore (to get isSessionSidebarOpen, isConfigSidebarOpen).
* `Variables:` isSessionSidebarOpen, isConfigSidebarOpen.
* `Imports:` SessionSidebar, ConfigSidebar, ErrorModal, useSessionStore.
* `Structure:` Renders a top-level flex div containing SessionSidebar, a main element wrapping children, ConfigSidebar, and ErrorModal.

## `app/(main)/page.tsx`

Purpose: Serves as the primary page displayed within the (main) layout group, typically the main chat interface.
Role: Renders the central chat component (MainChatArea) which handles the conversation display and input.
Contents:

* `Component:` HomePage (default export) \- Functional React component, client-side rendered ("use client").
* `Imports:` MainChatArea.
* `Structure:` Renders a flex container holding the MainChatArea component.

## `app/globals.css`

Purpose: Defines global CSS styles and configures Tailwind CSS base layers, components, and utilities for the entire application.
Role: Establishes foundational styles, CSS variables for theming (including light/dark mode support via prefers-color-scheme and .dark class), and integrates Tailwind's core styles. It specifically includes theme variables required by shadcn/ui.
Contents:

* `Tailwind Directives:` @tailwind base;, @tailwind components;, @tailwind utilities;.
* `CSS Variables:` Defines root variables (--foreground-rgb, etc.) and overrides for dark mode. Defines shadcn/ui theme variables (--background, \--primary, etc.) within @layer base for both light and dark themes.
* `Base Styles:` Applies border-border to all elements (\*) and sets default body background and text colors.

## `app/layout.tsx`

Purpose: Defines the root HTML structure and layout for the entire Next.js application.
Role: Sets up the \<html\> and \<body\> tags, imports global CSS, applies the primary font (Inter), sets essential metadata (title, description), and renders the page content (children).
Contents:

* `Component:` RootLayout (default export) \- Functional React component.
* `Imports:` ./globals.css, Metadata type, Inter font, cn utility.
* `Constants:` inter (font instance), metadata (site title and description).
* `Structure:` Renders \<html\> and \<body\>, applying font class, h-full, and antialiased styles. Includes {children} to render the page content.

## `CHANGELOG.md`

Purpose: To document the chronological history of changes made to the Skaldur project.
Role: Provides developers and users with a log of new features, bug fixes, performance improvements, breaking changes, and other modifications, typically organized by release version. (Content not provided).

## `components/feature/ChatMessage.tsx`

Purpose: Renders a single message bubble within the chat conversation history.
Role: Styles and displays the content and timestamp of a message, differentiating between user and assistant messages. Applies an entry animation and adjusts styling based on whether the message is sequential from the same role.
Contents:

* `Component:` ChatMessage \- Functional React component ("use client").
* `Props Interface:` ChatMessageProps (message: Message, isSequential: boolean).
* `Hooks:` useState (for isVisible), useEffect (for animation timer).
* `Variables:` isVisible (state), isUser (derived).
* `Imports:` Message type, cn, formatDate utilities, useEffect, useState.
* `Structure:` Renders a flex div aligned left/right based on isUser. Contains a styled inner div for the message bubble (background color varies), displaying message.content and formatted message.timestamp. Uses opacity transition based on isVisible.

## `components/feature/HistoryDisplay.tsx`

Purpose: Displays the entire conversation history for the active session.
Role: Renders a list of ChatMessage components based on the messages array. Shows a welcome/instructional message if the history is empty. Automatically scrolls the view to the most recent message.
Contents:

* `Component:` HistoryDisplay \- Functional React component ("use client").
* `Props Interface:` HistoryDisplayProps (messages: Message\[\]).
* `Hooks:` useRef (for messagesEndRef), useEffect (to scroll on messages change).
* `Variables:` messagesEndRef.
* `Imports:` useEffect, useRef, Message type, ChatMessage.
* `Structure:` Conditionally renders a welcome div or a scrollable div. The scrollable div maps the messages array to ChatMessage components, passing necessary props (message, isSequential). Includes an empty div with messagesEndRef at the end for auto-scrolling.

## `components/feature/ImprovementSelectors.tsx`

Purpose: Provides dropdown menus for selecting the desired prompt improvement type and style.
Role: Allows the user to configure how their input prompt should be modified. Fetches options using useImprovementOptions and renders Select components, passing selections back via callback props.
Contents:

* `Component:` ImprovementSelectors \- Functional React component ("use client").
* `Props Interface:` ImprovementSelectorsProps (selectedTypeId, selectedStyle, onTypeChange, onStyleChange, disabled).
* `Hooks:` useImprovementOptions.
* `Variables:` options, loading (from hook).
* `Imports:` Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useImprovementOptions.
* `Structure:` Renders a flex container with two Select components. Options are dynamically populated from options.types and options.styles. Disabled state is managed based on props and hook state.

## `components/feature/LlmConfiguration.tsx`

Purpose: Allows configuration of Language Model (LLM) settings for the session.
Role: Provides UI controls (dropdowns, sliders in an accordion for advanced options) to select the LLM provider, model, temperature, and max tokens. Updates settings via the onChange prop and dynamically adjusts available models based on the selected provider.
Contents:

* `Component:` LlmConfiguration \- Functional React component ("use client").
* `Props Interface:` LlmConfigurationProps (settings, onChange, showAdvanced).
* `Hooks:` useState (for availableModels), useEffect (to update models on provider change).
* `Variables:` availableModels (state).
* `Imports:` Select, Accordion, Slider, Label (UI components), LlmSettings type, llmProviders data, useEffect, useState.
* `Structure:` Renders labeled Select components for Provider and Model. Conditionally (showAdvanced) includes an Accordion with sliders for Temperature and Max Tokens.

## `components/feature/MainChatArea.tsx`

Purpose: Orchestrates the main chat interaction area, combining history display and prompt input.
Role: Fetches active session data from useSessionStore, renders HistoryDisplay with messages, and PromptInputArea for input. Handles prompt submission (handleSubmitPrompt), calls a mock API for prompt improvement, updates the session state with new messages, and triggers automatic session naming.
Contents:

* `Component:` MainChatArea \- Functional React component ("use client").
* `Hooks:` useSessionStore, useRef (for hasNamedSession).
* `Variables:` Store state (sessions, activeSessionUUID, etc.), hasNamedSession ref, activeSession, messages.
* `Functions:` handleSubmitPrompt (async, handles submission, mock API call, state updates, session naming logic).
* `Imports:` useEffect, useRef, useSessionStore, HistoryDisplay, PromptInputArea, API types, fetchWithErrorHandling.
* `Structure:` Renders a flex container with HistoryDisplay above PromptInputArea. Passes handleSubmitPrompt and isConfigured status to PromptInputArea.

## `components/feature/PromptInputArea.tsx`

Purpose: Provides the UI for user prompt input, improvement selection, and submission.
Role: Contains the main Textarea for prompt entry, ImprovementSelectors for choosing modification type/style, and the submission Button. Manages local state for input values and submission status. Features textarea auto-resizing.
Contents:

* `Component:` PromptInputArea \- Functional React component ("use client").
* `Props Interface:` PromptInputAreaProps (onSubmit, isConfigured).
* `Hooks:` useState (for input values, submitting state), useEffect (for auto-resize), useRef (for textarea).
* `Variables:` prompt, improvementTypeId, improvementStyle, isSubmitting (state), textareaRef.
* `Functions:` handleSubmit (async, calls onSubmit prop).
* `Imports:` useState, useEffect, useRef, Button, Textarea, ImprovementSelectors, Send icon.
* `Structure:` Renders a form containing Textarea, ImprovementSelectors, and a submit Button. UI elements are disabled based on isConfigured and isSubmitting props/state.

## `components/feature/SessionListItem.tsx`

Purpose: Renders an individual item in the list of chat sessions within the SessionSidebar.
Role: Displays the session name and creation date. Handles user interaction for selecting the session (making it active) or deleting it via a hover-activated button.
Contents:

* `Component:` SessionListItem \- Functional React component ("use client").
* `Props Interface:` SessionListItemProps (session, isActive).
* `Hooks:` useSessionStore.
* `Variables:` setActiveSession, deleteSession (from store).
* `Functions:` handleSelect, handleDelete.
* `Imports:` Button, Trash2 icon, useSessionStore, SessionData type, formatDate utility.
* `Structure:` Renders a clickable div (styled based on isActive). Contains session name/date and a delete Button visible on group-hover.

## `components/layout/ConfigSidebar.tsx`

Purpose: Provides the right sidebar for configuring and viewing LLM settings for the active session.
Role: Displays Interaction and Destination LLM settings. Allows configuration via LlmConfiguration if the session is new/unconfigured. Shows read-only settings and a "Fork Session" button once configured. Adapts between a Sheet (mobile) and a fixed div (desktop).
Contents:

* `Component:` ConfigSidebar \- Functional React component ("use client").
* `Hooks:` useSessionStore, useState, useEffect.
* `Variables:` Store state/actions, local state (interactionLlm, destinationLlm, isConfigured), activeSession, sidebarContent (JSX).
* `Functions:` handleForkSession, handleSaveConfig.
* `Imports:` Settings icon, Sheet, Button, useSessionStore, LlmConfiguration, useState, useEffect, LlmSettings type.
* `Structure:` Renders mobile trigger Button, Sheet (mobile), and fixed div (desktop). Both render sidebarContent, which conditionally shows configuration inputs or locked settings/fork button based on isConfigured.

## `components/layout/SessionSidebar.tsx`

Purpose: Provides the left sidebar for managing and navigating chat sessions.
Role: Lists existing sessions (sorted by date), allows creating new sessions, and handles selecting the active session. Ensures a session exists on load. Adapts between a Sheet (mobile) and a fixed div (desktop).
Contents:

* `Component:` SessionSidebar \- Functional React component ("use client").
* `Hooks:` useSessionStore, useEffect (for initial session handling).
* `Variables:` Store state/actions, sortedSessions (derived), sidebarContent (JSX).
* `Functions:` handleNewSession.
* `Imports:` PlusCircle, Menu icons, Sheet, Button, useSessionStore, SessionListItem, useEffect.
* `Structure:` Renders mobile trigger Button, Sheet (mobile), and fixed div (desktop). Both render sidebarContent, including a header with "New Session" button and a list of SessionListItem components.

## `components/ui/accordion.tsx`

Purpose: Provides a vertically stacked set of interactive headings that each reveal a section of content.
Role: A UI primitive component based on @radix-ui/react-accordion, styled with Tailwind CSS via cn. Used for collapsable sections.
Contents:

* `Components:` Accordion (root), AccordionItem, AccordionTrigger, AccordionContent.
* `Imports:` React, AccordionPrimitive, ChevronDown icon, cn.
* `Exports:` Accordion, AccordionItem, AccordionTrigger, AccordionContent.

## `components/ui/alert-dialog.tsx`

Purpose: Provides a modal dialog to interrupt the user and require confirmation for a potentially destructive or irreversible action.
Role: A UI primitive component based on @radix-ui/react-alert-dialog, styled with Tailwind CSS via cn. Ensures critical actions receive explicit user confirmation.
Contents:

* `Components:` AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel.
* `Imports:` React, AlertDialogPrimitive, cn, buttonVariants.
* `Exports:` All listed components.

## `components/ui/alert.tsx`

Purpose: Displays a short, important message that attracts attention without blocking interaction.
Role: A UI primitive component styled with Tailwind CSS using cva for variants (default, destructive). Suitable for warnings, errors, or informational messages.
Contents:

* `Components:` Alert, AlertTitle, AlertDescription.
* `Variables:` alertVariants (cva configuration).
* `Imports:` React, cva, cn.
* `Exports:` Alert, AlertTitle, AlertDescription.

## `components/ui/aspect-ratio.tsx`

Purpose: Displays content within a fixed aspect ratio container.
Role: A UI primitive component wrapping @radix-ui/react-aspect-ratio. Useful for ensuring images or embeds maintain their proportions.
Contents:

* `Component:` AspectRatio.
* `Imports:` AspectRatioPrimitive.
* `Exports:` AspectRatio.

## `components/ui/avatar.tsx`

Purpose: Displays an image representation of a user or entity, with a fallback if the image fails to load.
Role: A UI primitive component based on @radix-ui/react-avatar, styled with Tailwind CSS via cn. Provides a consistent way to show user profile pictures or icons.
Contents:

* `Components:` Avatar (root), AvatarImage, AvatarFallback.
* `Imports:` React, AvatarPrimitive, cn.
* `Exports:` Avatar, AvatarImage, AvatarFallback.

## `components/ui/badge.tsx`

Purpose: Displays small status descriptors or labels.
Role: A UI primitive component styled with Tailwind CSS using cva for variants (default, secondary, destructive, outline). Often used for tags, counters, or status indicators.
Contents:

* `Component:` Badge.
* `Props Interface:` BadgeProps.
* `Variables:` badgeVariants (cva configuration).
* `Imports:` React, cva, cn.
* `Exports:` Badge, badgeVariants.

## `components/ui/breadcrumb.tsx`

Purpose: Displays a hierarchical navigation path, showing the user's location within the application structure.
Role: A UI primitive component set for creating breadcrumb navigation links, styled with Tailwind CSS via cn.
Contents:

* `Components:` Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis.
* `Imports:` React, Slot, ChevronRight, MoreHorizontal icons, cn.
* `Exports:` All listed components.

## `components/ui/button.tsx`

Purpose: Provides an interactive button element for triggering actions.
Role: A fundamental UI primitive component styled with Tailwind CSS using cva for variants (default, destructive, outline, secondary, ghost, link) and sizes (default, sm, lg, icon). Supports rendering as a standard button or composing with other elements via Slot.
Contents:

* `Component:` Button.
* `Props Interface:` ButtonProps.
* `Variables:` buttonVariants (cva configuration).
* `Imports:` React, Slot, cva, cn.
* `Exports:` Button, buttonVariants.

## `components/ui/calendar.tsx`

Purpose: Displays an interactive calendar grid for selecting dates.
Role: A UI component wrapping the react-day-picker library, styled with Tailwind CSS via cn to match the application's visual theme.
Contents:

* `Component:` Calendar.
* `Props Type:` CalendarProps.
* `Imports:` React, ChevronLeft, ChevronRight icons, DayPicker, cn, buttonVariants.
* `Exports:` Calendar.

## `components/ui/card.tsx`

Purpose: Displays content and actions related to a single subject within a styled container.
Role: A UI primitive component set for structuring content into distinct cards, styled with Tailwind CSS via cn.
Contents:

* `Components:` Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent.
* `Imports:` React, cn.
* `Exports:` All listed components.

## `components/ui/carousel.tsx`

Purpose: Displays a collection of items (slides) that can be scrolled through horizontally or vertically.
Role: A UI primitive component set based on embla-carousel-react, providing core carousel functionality with navigation buttons, styled with Tailwind CSS via cn.
Contents:

* `Components:` Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext.
* `Hooks:` useCarousel.
* `Types:` CarouselApi, UseCarouselParameters, CarouselOptions, CarouselPlugin, CarouselProps, CarouselContextProps.
* `Imports:` React, useEmblaCarousel, ArrowLeft, ArrowRight icons, cn, Button.
* `Exports:` CarouselApi type, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext.

## `components/ui/chart.tsx`

Purpose: Provides components for creating data visualizations and charts.
Role: Wraps the recharts library, providing a ChartContainer context for theme-aware styling (using CSS variables) and customized ChartTooltipContent and ChartLegendContent components styled with Tailwind CSS via cn.
Contents:

* `Components:` ChartContainer, ChartTooltip (re-export), ChartTooltipContent, ChartLegend (re-export), ChartLegendContent, ChartStyle (internal).
* `Hooks:` useChart.
* `Types:` ChartConfig.
* `Variables:` THEMES.
* `Functions:` getPayloadConfigFromPayload.
* `Imports:` React, RechartsPrimitive, cn.
* `Exports:` ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle.

## `components/ui/checkbox.tsx`

Purpose: Allows users to select one or more options from a set, typically represented by a square box.
Role: A UI primitive component based on @radix-ui/react-checkbox, styled with Tailwind CSS via cn.
Contents:

* `Component:` Checkbox.
* `Imports:` React, CheckboxPrimitive, Check icon, cn.
* `Exports:` Checkbox.

## `components/ui/collapsible.tsx`

Purpose: Provides an interactive component to toggle the visibility (expand/collapse) of a section of content.
Role: A UI primitive component set based on @radix-ui/react-collapsible. Does not include default styling; relies on parent components or direct styling.
Contents:

* `Components:` Collapsible, CollapsibleTrigger, CollapsibleContent.
* `Imports:` CollapsiblePrimitive.
* `Exports:` Collapsible, CollapsibleTrigger, CollapsibleContent.

## `components/ui/command.tsx`

Purpose: Provides a command menu interface, enabling quick search and execution of actions.
Role: A UI primitive component set based on the cmdk library and @radix-ui/react-dialog, styled with Tailwind CSS via cn. Used for implementing command palettes.
Contents:

* `Components:` Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator.
* `Props Interface:` CommandDialogProps.
* `Imports:` React, DialogProps, CommandPrimitive, Search icon, cn, Dialog, DialogContent.
* `Exports:` All listed components.

## `components/ui/context-menu.tsx`

Purpose: Displays a menu of actions relevant to a specific element, typically triggered by a right-click or long-press.
Role: A UI primitive component set based on @radix-ui/react-context-menu, styled with Tailwind CSS via cn.
Contents:

* `Components:` ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup.
* `Imports:` React, ContextMenuPrimitive, Check, ChevronRight, Circle icons, cn.
* `Exports:` All listed components.

## `components/ui/dialog.tsx`

Purpose: Displays content in a modal layer that requires user interaction before returning to the main application flow.
Role: A UI primitive component set based on @radix-ui/react-dialog, styled with Tailwind CSS via cn. Used for creating modal dialogs.
Contents:

* `Components:` Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription.
* `Imports:` React, DialogPrimitive, X icon, cn.
* `Exports:` All listed components.

## `components/ui/drawer.tsx`

Purpose: Displays content in a panel that slides inf from one of the edges of the screen.
Role: A UI primitive component set based on the vaul library, styled with Tailwind CSS via cn. Often used for navigation or supplementary content on mobile devices.
Contents:

* `Components:` Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription.
* `Imports:` React, DrawerPrimitive, cn.
* `Exports:` All listed components.

## `components/ui/dropdown-menu.tsx`

Purpose: Displays a menu of actions or options to the user, typically triggered by clicking a button or link.
Role: A UI primitive component set based on @radix-ui/react-dropdown-menu, styled with Tailwind CSS via cn.
Contents:

* `Components:` DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup.
* `Imports:` React, DropdownMenuPrimitive, Check, ChevronRight, Circle icons, cn.
* `Exports:` All listed components.

## `components/ui/error-modal.tsx`

Purpose: Displays error messages to the user in a dedicated modal dialog.
Role: A specific UI component that utilizes the Dialog primitive. It listens to the currentError state in useSessionStore and renders the modal when an error is present, allowing the user to acknowledge and close it.
Contents:

* `Component:` ErrorModal \- Functional React component ("use client").
* `Hooks:` useSessionStore.
* `Variables:` currentError, setError (from store).
* `Functions:` handleClose.
* `Imports:` Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, Button, useSessionStore.
* `Structure:` Renders a Dialog conditionally based on currentError. Displays currentError.message and a "Close" button.

## `components/ui/form.tsx`

Purpose: Provides components and utilities for building accessible and validated forms using react-hook-form.
Role: Integrates react-hook-form's state management with styled UI components (Label, Input, etc.), connecting validation state (like errors) to the visual presentation.
Contents:

* `Components:` Form (FormProvider), FormField (Controller wrapper), FormItem, FormLabel, FormControl, FormDescription, FormMessage.
* `Hooks:` useFormField.
* `Types:` FormFieldContextValue, FormItemContextValue.
* `Contexts:` FormFieldContext, FormItemContext.
* `Imports:` React, LabelPrimitive, Slot, react-hook-form components/hooks, cn, Label.
* `Exports:` useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField.

## `components/ui/hover-card.tsx`

Purpose: Displays a popover card with additional information when the user hovers their mouse pointer over a trigger element.
Role: A UI primitive component set based on @radix-ui/react-hover-card, styled with Tailwind CSS via cn. Useful for tooltips with richer content.
Contents:

* `Components:` HoverCard, HoverCardTrigger, HoverCardContent.
* `Imports:` React, HoverCardPrimitive, cn.
* `Exports:` HoverCard, HoverCardTrigger, HoverCardContent.

## `components/ui/input-otp.tsx`

Purpose: Provides a specialized input field for entering One-Time Passcodes (OTP).
Role: A UI component set based on the input-otp library, styled with Tailwind CSS via cn. Renders individual slots for each digit and handles caret movement/focus.
Contents:

* `Components:` InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator.
* `Imports:` React, OTPInput, OTPInputContext, Dot icon, cn.
* `Exports:` InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator.

## `components/ui/input.tsx`

Purpose: Provides a standard single-line text input field.
Role: A basic UI primitive component rendering an HTML \<input\> element, styled consistently with the application's theme using Tailwind CSS via cn.
Contents:

* `Component:` Input.
* `Props Interface:` InputProps.
* `Imports:` React, cn.
* `Exports:` Input.

## `components/ui/label.tsx`

Purpose: Renders an accessible label element, typically associated with a form input control.
Role: A UI primitive component based on @radix-ui/react-label, styled with Tailwind CSS using cva via cn. Ensures proper accessibility for form fields.
Contents:

* `Component:` Label.
* `Variables:` labelVariants (cva configuration).
* `Imports:` React, LabelPrimitive, cva, cn.
* `Exports:` Label.

## `components/ui/menubar.tsx`

Purpose: Displays a horizontal menu bar, commonly found at the top of desktop applications, containing menus like "File", "Edit", etc.
Role: A UI primitive component set based on @radix-ui/react-menubar, styled with Tailwind CSS via cn.
Contents:

* `Components:` Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut.
* `Imports:` React, MenubarPrimitive, Check, ChevronRight, Circle icons, cn.
* `Exports:` All listed components.

## `components/ui/navigation-menu.tsx`

Purpose: Displays a list of navigation links, often including dropdown menus for nested items.
Role: A UI primitive component set based on @radix-ui/react-navigation-menu, styled with Tailwind CSS using cva via cn. Suitable for primary site navigation.
Contents:

* `Components:` NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport.
* `Variables:` navigationMenuTriggerStyle (cva configuration).
* `Imports:` React, NavigationMenuPrimitive, cva, ChevronDown icon, cn.
* `Exports:` All listed components and navigationMenuTriggerStyle.

## `components/ui/pagination.tsx`

Purpose: Provides controls for navigating between pages of paginated content.
Role: A UI component set for rendering pagination elements (Previous/Next buttons, page links, ellipsis), styled with Tailwind CSS via cn and buttonVariants.
Contents:

* `Components:` Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis.
* `Props Type:` PaginationLinkProps.
* `Imports:` React, ChevronLeft, ChevronRight, MoreHorizontal icons, cn, ButtonProps, buttonVariants.
* `Exports:` All listed components.

## `components/ui/popover.tsx`

Purpose: Displays rich content in a floating panel that appears next to a trigger element when clicked or focused.
Role: A UI primitive component set based on @radix-ui/react-popover, styled with Tailwind CSS via cn. Useful for dropdowns or information panels triggered by user interaction.
Contents:

* `Components:` Popover, PopoverTrigger, PopoverContent.
* `Imports:` React, PopoverPrimitive, cn.
* `Exports:` Popover, PopoverTrigger, PopoverContent.

## `components/ui/progress.tsx`

Purpose: Displays a visual indicator showing the completion progress of a task or operation.
Role: A UI primitive component based on @radix-ui/react-progress, styled with Tailwind CSS via cn.
Contents:

* `Component:` Progress.
* `Imports:` React, ProgressPrimitive, cn.
* `Exports:` Progress.

## `components/ui/radio-group.tsx`

Purpose: Allows users to select exactly one option from a predefined set.
Role: A UI primitive component set based on @radix-ui/react-radio-group, styled with Tailwind CSS via cn. Renders a group of radio buttons.
Contents:

* `Components:` RadioGroup, RadioGroupItem.
* `Imports:` React, RadioGroupPrimitive, Circle icon, cn.
* `Exports:` RadioGroup, RadioGroupItem.

## `components/ui/resizable.tsx`

Purpose: Provides components for creating layouts with panels that can be resized by the user dragging a handle.
Role: A UI component set based on react-resizable-panels, styled with Tailwind CSS via cn. Includes optional visual handles.
Contents:

* `Components:` ResizablePanelGroup, ResizablePanel, ResizableHandle.
* `Imports:` GripVertical icon, ResizablePrimitive, cn.
* `Exports:` ResizablePanelGroup, ResizablePanel, ResizableHandle.

## `components/ui/scroll-area.tsx`

Purpose: Provides a container with stylized scrollbars for content that exceeds the container's dimensions.
Role: A UI primitive component set based on @radix-ui/react-scroll-area, styled with Tailwind CSS via cn. Offers custom scrollbar appearance.
Contents:

* `Components:` ScrollArea, ScrollBar.
* `Imports:` React, ScrollAreaPrimitive, cn.
* `Exports:` ScrollArea, ScrollBar.

## `components/ui/select.tsx`

Purpose: Allows users to choose one option from a collapsible list (dropdown).
Role: A UI primitive component set based on @radix-ui/react-select, styled with Tailwind CSS via cn. Used for creating dropdown selection menus.
Contents:

* `Components:` Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton.
* `Imports:` React, SelectPrimitive, Check, ChevronDown, ChevronUp icons, cn.
* `Exports:` All listed components.

## `components/ui/separator.tsx`

Purpose: Renders a visual line to separate content sections either horizontally or vertically.
Role: A UI primitive component based on @radix-ui/react-separator, styled with Tailwind CSS via cn.
Contents:

* `Component:` Separator.
* `Imports:` React, SeparatorPrimitive, cn.
* `Exports:` Separator.

## `components/ui/sheet.tsx`

Purpose: Displays content in a panel that slides in from one side of the viewport.
Role: A UI primitive component set based on @radix-ui/react-dialog, styled with Tailwind CSS using cva for side variants (top, bottom, left, right). Commonly used for sidebars or drawers, especially on mobile.
Contents:

* `Components:` Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription.
* `Variables:` sheetVariants (cva configuration).
* `Props Interface:` SheetContentProps.
* `Imports:` React, SheetPrimitive, cva, X icon, cn.
* `Exports:` All listed components.

## `components/ui/skeleton.tsx`

Purpose: Displays a placeholder preview typically used while content is loading.
Role: A simple UI primitive component styled with Tailwind CSS via cn to show an animated gray box, indicating loading state.
Contents:

* `Component:` Skeleton.
* `Imports:` cn.
* `Exports:` Skeleton.

## `components/ui/slider.tsx`

Purpose: Allows users to select a value or range of values along a track by dragging a thumb.
Role: A UI primitive component based on @radix-ui/react-slider, styled with Tailwind CSS via cn.
Contents:

* `Component:` Slider.
* `Imports:` React, SliderPrimitive, cn.
* `Exports:` Slider.

## `components/ui/sonner.tsx`

Purpose: Provides a pre-configured toaster component for displaying notifications using the sonner library.
Role: Wraps the Toaster from sonner, integrates with next-themes for theme detection, and applies project-specific CSS class names for consistent styling.
Contents:

* `Component:` Toaster.
* `Props Type:` ToasterProps.
* `Hooks:` useTheme.
* `Imports:` useTheme, Toaster as Sonner.
* `Exports:` Toaster.

## `components/ui/switch.tsx`

Provides a styled two-state switch component.
Wraps the `@radix-ui/react-switch` primitive, applying project-specific styles using Tailwind CSS via the `cn` utility. It renders a visual switch that can be toggled between checked and unchecked states.

**Contents:**
*   `Switch` (Component): A `React.forwardRef` component wrapping `SwitchPrimitives.Root`.
    *   Applies styles to the root element for the track (background, border, transitions, focus states, disabled state).
    *   Contains a `SwitchPrimitives.Thumb` component, styled to represent the sliding knob (size, shape, background, shadow, translation on state change).
*   **Exports:** `Switch`.
*   **Dependencies:** `react`, `@radix-ui/react-switch`, `@/lib/utils`.

## `components/ui/table.tsx`

Purpose: Displays data in a structured tabular format (rows and columns).
Role: A set of UI primitive components for rendering accessible HTML tables (\<table\>, \<thead\>, \<tbody\>, \<tr\>, \<th\>, \<td\>, etc.), styled with Tailwind CSS via cn.
Contents:

* `Components:` Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption.
* `Imports:` React, cn.
* `Exports:` All listed components.

## `components/ui/tabs.tsx`

Purpose: Organizes content into sections where only one section is visible at a time, controlled by selecting tabs.
Role: A UI primitive component set based on @radix-ui/react-tabs, styled with Tailwind CSS via cn.
Contents:

* `Components:` Tabs, TabsList, TabsTrigger, TabsContent.
* `Imports:` React, TabsPrimitive, cn.
* `Exports:` Tabs, TabsList, TabsTrigger, TabsContent.

## `components/ui/textarea.tsx`

Purpose: Provides a multi-line text input field.
Role: A basic UI primitive component rendering an HTML \<textarea\> element, styled consistently using Tailwind CSS via cn.
Contents:

* `Component:` Textarea.
* `Props Interface:` TextareaProps.
* `Imports:` React, cn.
* `Exports:` Textarea.

## `components/ui/toast.tsx`

Purpose: Displays brief, non-intrusive notification messages to the user.
Role: A set of UI primitive components based on @radix-ui/react-toast, styled with Tailwind CSS using cva for variants (default, destructive). Provides the building blocks for the toast system managed by useToast.
Contents:

* `Components:` ToastProvider, ToastViewport, Toast, ToastAction, ToastClose, ToastTitle, ToastDescription.
* `Variables:` toastVariants (cva configuration).
* `Types:` ToastProps, ToastActionElement.
* `Imports:` React, ToastPrimitives, cva, X icon, cn.
* `Exports:` All listed components and types.

## `components/ui/toaster.tsx`

Purpose: Renders the toast notifications managed by the useToast hook system.
Role: A client component that subscribes to the toast state via useToast and renders the active toasts using the Toast, ToastViewport, and related components from components/ui/toast.
Contents:

* `Component:` Toaster.
* `Hooks:` useToast.
* `Imports:` useToast hook, Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport.
* `Exports:` Toaster.

## `components/ui/toggle-group.tsx`

Purpose: Allows users to select one or multiple options from a group of toggle buttons.
Role: A UI primitive component set based on @radix-ui/react-toggle-group, styled using variants defined in toggle.tsx via a shared context.
Contents:

* `Components:` ToggleGroup, ToggleGroupItem.
* `Context:` ToggleGroupContext.
* `Imports:` React, ToggleGroupPrimitive, VariantProps, cn, toggleVariants.
* `Exports:` ToggleGroup, ToggleGroupItem.

## `components/ui/toggle.tsx`

Purpose: Provides a two-state button that can be toggled between "on" and "off" states.
Role: A UI primitive component based on @radix-ui/react-toggle, styled with Tailwind CSS using cva for variants (default, outline) and sizes (default, sm, lg).
Contents:

* `Component:` Toggle.
* `Variables:` toggleVariants (cva configuration).
* `Imports:` React, TogglePrimitive, cva, cn.
* `Exports:` Toggle, toggleVariants.

## `components/ui/tooltip.tsx`

Purpose: Displays brief, informative text in a small popup when a user hovers over or focuses on an element.
Role: A UI primitive component set based on @radix-ui/react-tooltip, styled with Tailwind CSS via cn. Useful for clarifying icons or providing short hints.
Contents:

* `Components:` TooltipProvider, Tooltip, TooltipTrigger, TooltipContent.
* `Imports:` React, TooltipPrimitive, cn.
* `Exports:` Tooltip, TooltipTrigger, TooltipContent, TooltipProvider.

## `hooks/use-toast.ts`

Provides a custom hook (`useToast`) and a utility function (`toast`) for managing and displaying toast notifications, inspired by `react-hot-toast`.
Centralizes the logic for creating, updating, dismissing, and removing toast notifications based on the components defined in `@/components/ui/toast`. It maintains a global state of active toasts and provides an interface for components to interact with the toast system.

**Contents:**
*   Constants: `TOAST_LIMIT` (max number of toasts visible), `TOAST_REMOVE_DELAY` (delay before removing a dismissed toast from state).
*   Types: `ToasterToast`, `ActionType`, `Action`, `State`, `Toast`. Define the structure of toast objects and the actions for the state reducer.
*   State Management:
    *   `memoryState`: Global state object holding the array of `toasts`.
    *   `listeners`: Array to hold state update callbacks for components using the hook.
    *   `reducer`: A function that handles state transitions based on dispatched actions (`ADD_TOAST`, `UPDATE_TOAST`, `DISMISS_TOAST`, `REMOVE_TOAST`).
    *   `dispatch`: Function to trigger state updates using the reducer and notify listeners.
*   Helper Functions:
    *   `genId`: Generates unique IDs for toasts.
    *   `addToRemoveQueue`: Manages timeouts for removing toasts after they are dismissed.
*   `toast({...props}: Toast)` (Function):
    *   Creates a new toast notification with a unique ID.
    *   Dispatches `ADD_TOAST` action.
    *   Sets up `onOpenChange` handler to automatically dismiss the toast when closed via the UI component.
    *   Returns an object with `id`, `dismiss()`, and `update()` methods for controlling the specific toast instance.
*   `useToast()` (Hook):
    *   Provides access to the current toast state (`toasts` array).
    *   Returns the `toast` function to create new toasts.
    *   Returns a `dismiss(toastId?: string)` function to dismiss specific or all toasts.
    *   Uses `React.useState` and `React.useEffect` to subscribe the component to global toast state changes.
*   **Exports:** `useToast`, `toast`.
*   **Dependencies:** `react`, `@/components/ui/toast`.

## `hooks/useImprovementOptions.ts`

A React hook (`useImprovementOptions`) responsible for fetching and managing prompt improvement options.
Provides the available improvement types (e.g., "Enhance Prompt", "Summarize Text") and styles (e.g., "Concisely", "Formally") to UI components that allow users to select how they want to modify their prompts. It currently uses mock data but is designed to fetch this data from an API endpoint (`/api/config/improvement-options`).

**Contents:**
*   `useImprovementOptions` (hook):
    *   Manages `loading` state (boolean).
    *   Uses `useSessionStore` to get/set `improvementOptions` and handle errors (`setError`).
    *   `useEffect` hook: Fetches options (currently mock data) when the component mounts if options are not already loaded in the store. Sets loading state during fetch and handles potential errors.
    *   Returns an object containing `options` (the fetched `ImprovementOptions` or null) and `loading` state.
*   **Dependencies:** `react`, `@/types`, `@/lib/utils`, `@/store/sessionStore`.

## `lib/llmProviders.ts`

Defines the structure and provides data for supported Large Language Model (LLM) providers and their specific models.
Serves as a configuration source for available LLMs within the application, detailing their capabilities (like max tokens and temperature support). Provides helper functions to retrieve provider and model data.

**Contents:**
*   `LlmProvider` (interface): Defines the structure for an LLM provider (id, name, models array).
*   `LlmModel` (interface): Defines the structure for an LLM model (id, name, maxTokens, supportsTemperature).
*   `llmProviders` (constant): An array of `LlmProvider` objects, currently containing data for 'OpenAI' (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo) and 'Anthropic' (Claude 3 Opus, Sonnet, Haiku).
*   `getProviderById(id: string)`: Function to find and return an `LlmProvider` object by its ID.
*   `getModelById(providerId: string, modelId: string)`: Function to find and return an `LlmModel` object within a specific provider, identified by their respective IDs.

## `lib/utils.ts`

Provides common utility functions used throughout the application.
Centralizes reusable logic for tasks like class name merging, date formatting, text truncation, and API fetching.

**Contents:**
*   `cn(...inputs: ClassValue[])`: Merges class names using `clsx` and `tailwind-merge`. Accepts various class value types and returns a unified string.
*   `formatDate(date: Date | number)`: Formats a date object or timestamp number into a human-readable string (e.g., "Sep 15, 2023, 02:30 PM").
*   `truncateText(text: string, maxLength: number)`: Truncates a string to a specified maximum length, appending "..." if truncated.
*   `fetchWithErrorHandling<T>(url: string, options?: RequestInit)`: A generic function wrapper around `fetch` that includes basic error handling and JSON parsing. Throws an error if the response is not OK.

## `next-env.d.ts`

Provides TypeScript type definitions for Next.js environment variables and image imports.
Ensures type safety when working with Next.js specific global types. It's automatically generated and managed by Next.js.

**Contents:** Contains triple-slash directives (`/// <reference ... />`) that reference type definitions from `next` and `next/image-types/global`. Includes a note advising against manual edits.

## `next.config.js`

This file configures the Next.js framework for the project.
It defines build and runtime settings for the Next.js application.

**Contents:**
*   `nextConfig` (object): Contains configuration options.
    *   `output: 'export'`: Specifies a static HTML export build.
    *   `eslint.ignoreDuringBuilds: true`: Disables ESLint checks during the build process.
    *   `images.unoptimized: true`: Disables Next.js Image Optimization.
*   Exports the `nextConfig` object using `module.exports`.

## `package-lock.json`

## `package.json`
## `pnpm-lock.yaml`

## `pnpm-workspace.yaml`

This file configures the pnpm workspace. It currently specifies `onlyBuiltDependencies` with `unrs-resolver`, indicating a dependency build configuration specific to `unrs-resolver` within the workspace.

## `postcss.config.js`

This file configures PostCSS plugins used in the build process. It specifies the use of `tailwindcss` and `autoprefixer` plugins.

## `README.md`

## `store/sessionStore.ts`

Defines and manages the application's global state using Zustand, a state management library.
This store holds all session-related data, including individual session details (UUID, name, messages, LLM settings), the currently active session, UI state (sidebar visibility, errors), and loaded improvement options. It uses `zustand/middleware/persist` to save session data and the active session UUID to local storage.

**Contents:**
*   `SessionState` (interface): Defines the shape of the store's state and actions.
    *   State properties: `sessions` (Record<string, SessionData>), `activeSessionUUID` (string | null), `isSessionSidebarOpen` (boolean), `isConfigSidebarOpen` (boolean), `currentError` ({ message: string } | null), `improvementOptions` (ImprovementOptions | null).
    *   Action methods: `createNewSession`, `forkSession`, `setActiveSession`, `updateSessionName`, `deleteSession`, `addMessageToActiveSession`, `updateInteractionLlm`, `updateDestinationLlm`, `toggleSessionSidebar`, `toggleConfigSidebar`, `setError`, `setImprovementOptions`.
*   `defaultInteractionLlm`, `defaultDestinationLlm` (constants): Default `LlmSettings` objects used when creating new sessions.
*   `useSessionStore` (Zustand store): Created using `create<SessionState>()` and wrapped with `persist`.
    *   Initial state: Sets default values for all state properties.
    *   Action implementations: Provides the logic for each action defined in `SessionState` (e.g., creating UUIDs, updating nested state, handling persistence).
    *   Persistence config: Specifies the storage name (`prompt-improver-storage`) and partializes the state to only persist `sessions` and `activeSessionUUID`.
*   **Exports:** `useSessionStore`.
*   **Dependencies:** `zustand`, `zustand/middleware`, `uuid`, `@/types`.

## `tailwind.config.ts`

This file configures Tailwind CSS for the project. It defines the theme settings, including colors, border-radius, keyframes for animations (`accordion-down`, `accordion-up`), and extends the default Tailwind theme. It specifies the content paths to scan for Tailwind classes (`./pages`, `./components`, `./app`). It also enables dark mode via class and includes the `tailwindcss-animate` plugin. The main export is the `config` object.

## `tsconfig.json`

This file configures the TypeScript compiler options for the project. It specifies the target ECMAScript version (`es5`), libraries to include (`dom`, `dom.iterable`, `esnext`), enables JSX support (`preserve`), defines module settings (`esnext`, `bundler`), and sets up path aliases (`@/*` pointing to `./*`). It also includes files like `next-env.d.ts` and all `.ts`/`.tsx` files while excluding `node_modules`.

## `types/api.ts`

Defines TypeScript interfaces specifically for API request and response payloads.
Ensures type safety and a clear contract for data exchanged between the frontend and backend API endpoints related to prompt improvement and session naming.

**Contents:**
*   `ImprovePromptRequest`: Interface for the request body sent to the prompt improvement endpoint, containing `sessionUUID`, `userInput`, `improvementTypeId`, and `improvementStyle`.
*   `ImprovePromptResponse`: Interface for the response body from the prompt improvement endpoint, containing the `improvedPrompt` and the original `sessionUUID`.
*   `NameSessionRequest`: Interface for the request body sent to the session naming endpoint, containing `sessionUUID`, `initialPrompt`, and `firstResponse`.
*   `NameSessionResponse`: Interface for the response body from the session naming endpoint, containing the generated `sessionName` and the original `sessionUUID`.
*   `ApiError`: Interface for a standardized API error response structure, containing an `error` object with a `message` and an optional `code`.
*   **Exports:** All defined interfaces (`ImprovePromptRequest`, `ImprovePromptResponse`, `NameSessionRequest`, `NameSessionResponse`, `ApiError`).

## `types/index.ts`

Defines core TypeScript interfaces used throughout the Skaldur application.
Provides standardized data structures for key entities like sessions, messages, LLM settings, and improvement options, ensuring type safety and consistency across different components and modules.

**Contents:**
*   `SessionData`: Interface for a single chat session, containing `uuid`, `name`, `createdAt`, an array of `messages`, and `lockedSettings`.
*   `Message`: Interface for a chat message, containing `role` ('user' | 'assistant'), `content`, and `timestamp`.
*   `LockedSettings`: Interface containing the `LlmSettings` for both the `interactionLlm` and `destinationLlm`.
*   `LlmSettings`: Interface for Language Model settings, including `provider`, `model`, and optional `temperature` and `maxTokens`.
*   `ImprovementType`: Interface describing a type of prompt improvement, with `id`, `name`, `icon`, and `description`.
*   `ImprovementOptions`: Interface holding arrays of available `ImprovementType` objects and available improvement `styles` (strings).
*   **Exports:** All defined interfaces (`SessionData`, `Message`, `LockedSettings`, `LlmSettings`, `ImprovementType`, `ImprovementOptions`).

## `package.json`

This is the core manifest file for the Node.js project. It defines project metadata (name: `skaldur`, version: `0.1.0`), scripts (`dev`, `build`, `start`, `lint`), lists all production dependencies (e.g., `next`, `react`, `@radix-ui/*`, `tailwindcss`, `zustand`) and development dependencies (`@types/uuid`). It also specifies the package manager (`pnpm`).

## `pnpm-lock.yaml`

## `components/ui/textarea.tsx`

Provides a styled, multi-line text input component.
Offers a standard HTML `<textarea>` element enhanced with project-specific styling using Tailwind CSS via the `cn` utility. It includes styles for borders, background, text, placeholder text, focus states, and disabled states.

**Contents:**
*   `TextareaProps` (interface): Extends standard `React.TextareaHTMLAttributes<HTMLTextAreaElement>`, allowing standard textarea props to be passed.
*   `Textarea` (Component): A `React.forwardRef` component that renders an HTML `<textarea>`.
    *   Applies styles using `cn` for consistent look and feel.
    *   Accepts standard textarea attributes.
*   **Exports:** `Textarea`.
*   **Dependencies:** `react`, `@/lib/utils`.
