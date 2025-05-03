"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { SessionData } from "@/types";
import { formatDate } from "@/lib/utils";

interface SessionListItemProps {
  session: SessionData;
  isActive: boolean;
}

export function SessionListItem({ session, isActive }: SessionListItemProps) {
  const { setActiveSession, deleteSession } = useSessionStore();

  const handleSelect = () => {
    setActiveSession(session.uuid);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(session.uuid);
  };

  return (
    <div 
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
        isActive ? 'bg-muted' : ''
      }`}
      onClick={handleSelect}
    >
      <div className="flex-1 overflow-hidden">
        <div className="font-medium truncate">{session.name}</div>
        <div className="text-xs text-muted-foreground">
          {formatDate(session.createdAt)}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
        onClick={handleDelete}
        title="Delete Session"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}