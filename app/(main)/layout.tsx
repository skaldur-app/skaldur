"use client";

import { SessionSidebar } from "@/components/layout/SessionSidebar";
import { ConfigSidebar } from "@/components/layout/ConfigSidebar";
import { ErrorModal } from "@/components/ui/error-modal";
import { useSessionStore } from "@/store/sessionStore";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSessionSidebarOpen, isConfigSidebarOpen } = useSessionStore();

  return (
    <div className="flex h-screen">
      <SessionSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <ConfigSidebar />
      <ErrorModal />
    </div>
  );
}