"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";

export function ErrorModal() {
  const { currentError, setError } = useSessionStore();
  
  const handleClose = () => {
    setError(null);
  };
  
  if (!currentError) {
    return null;
  }
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">Error Message</DialogTitle>
        <DialogDescription className="text-destructive">
          {currentError.message || "An unknown error occurred."}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}