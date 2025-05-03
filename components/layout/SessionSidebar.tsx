"use client";

import { PlusCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { SessionListItem } from "@/components/feature/SessionListItem";
import { useEffect } from "react";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export function SessionSidebar() {
  const {
    sessions,
    activeSessionUUID,
    isSessionSidebarOpen,
    toggleSessionSidebar,
    createNewSession,
    setActiveSession
  } = useSessionStore();

  // Create a new session if none exist
  useEffect(() => {
    const sessionIds = Object.keys(sessions);
    if (sessionIds.length === 0) {
      createNewSession();
    } else if (!activeSessionUUID) {
      setActiveSession(sessionIds[0]);
    }
  }, [sessions, activeSessionUUID, createNewSession, setActiveSession]);

  const handleNewSession = () => {
    createNewSession();
  };

  // Sort sessions by most recent first
  const sortedSessions = Object.values(sessions).sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNewSession}
          title="New Session"
          className="ml-2 h-8 w-8"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">New Session</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedSessions.map((session) => (
          <SessionListItem
            key={session.uuid}
            session={session}
            isActive={session.uuid === activeSessionUUID}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={toggleSessionSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle session sidebar</span>
      </Button>

      {/* Retractable sidebar */}
      <Sheet open={isSessionSidebarOpen} onOpenChange={toggleSessionSidebar}>
        <SheetContent side="left" className="w-80 p-0">
          <VisuallyHidden.Root>
            <SheetTitle>Session Management</SheetTitle>
            <SheetDescription>
              View, select, and create new chat sessions.
            </SheetDescription>
          </VisuallyHidden.Root>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}