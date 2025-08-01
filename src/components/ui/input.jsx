import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styling
        "flex w-full min-w-0 h-10 rounded-md border px-3 py-2 text-base md:text-sm shadow-sm outline-none",
        // Light mode & dark mode
        "bg-white dark:bg-input/30 border-input",
        // Focus
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors",
        // Placeholder & selection
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        // Disabled
        "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
        // File input styles
        "file:inline-flex file:h-8 file:text-sm file:font-medium file:border-0 file:bg-transparent file:text-foreground",
        // Validation
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}

export { Input };
