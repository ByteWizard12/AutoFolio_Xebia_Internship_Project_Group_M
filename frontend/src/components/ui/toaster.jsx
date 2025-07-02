"use client"

import { useToast } from "../../hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(({ id, title, description, action, variant = "default", duration, ...props }) => {
        // Filter out onOpenChange and any other non-DOM props
        const { onOpenChange, ...domProps } = props;
        return (
          <div
            key={id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
              "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
              "mb-2 last:mb-0",
              // Variant styles
              variant === "default" && "bg-background text-foreground border-border",
              variant === "destructive" && "bg-destructive text-destructive-foreground border-destructive",
              variant === "success" && "bg-green-50 text-green-900 border-green-200",
            )}
            {...domProps}
          >
            <div className="grid gap-1 flex-1">
              {title && (
                <div className={cn("text-sm font-semibold", variant === "success" && "text-green-800")}>{title}</div>
              )}
              {description && (
                <div className={cn("text-sm opacity-90", variant === "success" && "text-green-700")}>{description}</div>
              )}
            </div>

            {/* Progress bar for duration */}
            {duration > 0 && (
              <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                <div
                  className={cn(
                    "h-full transition-all ease-linear",
                    variant === "default" && "bg-primary",
                    variant === "destructive" && "bg-destructive-foreground",
                    variant === "success" && "bg-green-600",
                  )}
                  style={{
                    animation: `shrink ${duration}ms linear forwards`,
                  }}
                />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => dismiss(id)}
              className={cn(
                "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
                variant === "destructive" && "text-red-300 hover:text-red-50",
                variant === "success" && "text-green-600 hover:text-green-800",
              )}
            >
              <X className="h-4 w-4" />
            </button>

            {action}
          </div>
        )
      })}

      <style>
        {`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </div>
  )
}
