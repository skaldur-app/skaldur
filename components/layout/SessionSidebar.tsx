"use client";

import { PlusCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { SessionListItem } from "@/components/feature/SessionListItem";
import { useEffect } from "react";

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
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNewSession}
          title="New Session"
        >
          <PlusCircle className="h-5 w-5" />
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
      {/* Mobile trigger */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 md:hidden"
        onClick={toggleSessionSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle session sidebar</span>
      </Button>

      {/* Mobile sidebar */}
      <Sheet open={isSessionSidebarOpen} onOpenChange={toggleSessionSidebar}>
        <SheetContent side="left" className="w-80 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 border-r border-border h-screen">
        {sidebarContent}
      </div>
    </>
  );
}