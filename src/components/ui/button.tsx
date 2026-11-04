import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export function Button({ asChild = false, className, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn("inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", className)} {...props} />;
}