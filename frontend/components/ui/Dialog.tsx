'use client';

// frontend/components/ui/Dialog.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeLabel?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeLabel = "Close",
}: DialogProps) {
  // Lock body scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  // Handle Escape key
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl transition-all",
          "animate-in zoom-in-95 slide-in-from-bottom-2 duration-300",
          "mx-4"
        )}
      >
        {(title || description) && (
          <div className="border-b border-border p-6">
            {title && (
              <h2 id="dialog-title" className="text-xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>

        <div className="flex items-center justify-end gap-3 bg-muted/50 border-t border-border p-6">
          {footer ?? (
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {closeLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
