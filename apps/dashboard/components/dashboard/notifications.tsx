"use client";

import { Bell } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@run402/ui";

/** Notifications placeholder — empty state only. */
export function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <div className="px-2 py-8 text-center text-sm text-muted-foreground">
          You&apos;re all caught up.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
