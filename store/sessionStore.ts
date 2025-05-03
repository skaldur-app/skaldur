"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { ImprovementOptions, LlmSettings, Message, SessionData } from "@/types";

interface SessionState {
  sessions: Record<string, SessionData>;
  activeSessionUUID: string | null;
  isSessionSidebarOpen: boolean;
  isConfigSidebarOpen: boolean;
  currentError: { message: string } | null;
  improvementOptions: ImprovementOptions | null;

  // Session Actions
  createNewSession: () => string;
  forkSession: (uuid: string) => string;
  setActiveSession: (uuid: string) => void;
  updateSessionName: (uuid: string, name: string) => void;
  deleteSession: (uuid: string) => void;
  
  // Message Actions
  addMessageToActiveSession: (message: Omit<Message, 'timestamp'>) => void;
  
  // LLM Settings Actions
  updateInteractionLlm: (uuid: string, settings: LlmSettings) => void;
  updateDestinationLlm: (uuid: string, settings: LlmSettings) => void;
  
  // UI Actions
  toggleSessionSidebar: () => void;
  toggleConfigSidebar: () => void;
  setError: (error: { message: string } | null) => void;
  
  // Data Actions
  setImprovementOptions: (options: ImprovementOptions) => void;
}

// Default LLM settings
const defaultInteractionLlm: LlmSettings = {
  provider: 'OpenAI',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1024
};

const defaultDestinationLlm: LlmSettings = {
  provider: 'OpenAI',
  model: 'gpt-3.5-turbo',
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionUUID: null,
      isSessionSidebarOpen: true,
      isConfigSidebarOpen: true,
      currentError: null,
      improvementOptions: null,

      createNewSession: () => {
        const uuid = uuidv4();
        const timestamp = Date.now();
        
        const newSession: SessionData = {
          uuid,
          name: `Session ${new Date(timestamp).toLocaleString()}`,
          createdAt: timestamp,
          messages: [],
          lockedSettings: {
            interactionLlm: { ...defaultInteractionLlm },
            destinationLlm: { ...defaultDestinationLlm }
          }
        };
        
        set((state) => ({
          sessions: { ...state.sessions, [uuid]: newSession },
          activeSessionUUID: uuid
        }));
        
        return uuid;
      },

      forkSession: (uuid: string) => {
        const { sessions } = get();
        const sourceSession = sessions[uuid];
        
        if (!sourceSession) return uuid;
        
        const newUuid = uuidv4();
        const timestamp = Date.now();
        
        const newSession: SessionData = {
          uuid: newUuid,
          name: `${sourceSession.name} (Fork)`,
          createdAt: timestamp,
          messages: [...sourceSession.messages],
          lockedSettings: {
            interactionLlm: { ...defaultInteractionLlm },
            destinationLlm: { ...defaultDestinationLlm }
          }
        };
        
        set((state) => ({
          sessions: { ...state.sessions, [newUuid]: newSession },
          activeSessionUUID: newUuid
        }));
        
        return newUuid;
      },

      setActiveSession: (uuid: string) => {
        set({ activeSessionUUID: uuid });
      },

      updateSessionName: (uuid: string, name: string) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [uuid]: {
              ...state.sessions[uuid],
              name
            }
          }
        }));
      },

      deleteSession: (uuid: string) => {
        set((state) => {
          const { [uuid]: _, ...restSessions } = state.sessions;
          const activeUUID = state.activeSessionUUID === uuid
            ? Object.keys(restSessions)[0] || null
            : state.activeSessionUUID;
            
          return {
            sessions: restSessions,
            activeSessionUUID: activeUUID
          };
        });
      },

      addMessageToActiveSession: (message) => {
        const { activeSessionUUID } = get();
        if (!activeSessionUUID) return;
        
        const fullMessage: Message = {
          ...message,
          timestamp: Date.now()
        };
        
        set((state) => ({
          sessions: {
            ...state.sessions,
            [activeSessionUUID]: {
              ...state.sessions[activeSessionUUID],
              messages: [
                ...state.sessions[activeSessionUUID].messages,
                fullMessage
              ]
            }
          }
        }));
      },

      updateInteractionLlm: (uuid: string, settings: LlmSettings) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [uuid]: {
              ...state.sessions[uuid],
              lockedSettings: {
                ...state.sessions[uuid].lockedSettings,
                interactionLlm: settings
              }
            }
          }
        }));
      },

      updateDestinationLlm: (uuid: string, settings: LlmSettings) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [uuid]: {
              ...state.sessions[uuid],
              lockedSettings: {
                ...state.sessions[uuid].lockedSettings,
                destinationLlm: settings
              }
            }
          }
        }));
      },

      toggleSessionSidebar: () => {
        set((state) => ({
          isSessionSidebarOpen: !state.isSessionSidebarOpen
        }));
      },

      toggleConfigSidebar: () => {
        set((state) => ({
          isConfigSidebarOpen: !state.isConfigSidebarOpen
        }));
      },

      setError: (error) => {
        set({ currentError: error });
      },

      setImprovementOptions: (options) => {
        set({ improvementOptions: options });
      }
    }),
    {
      name: 'prompt-improver-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionUUID: state.activeSessionUUID
      })
    }
  )
);