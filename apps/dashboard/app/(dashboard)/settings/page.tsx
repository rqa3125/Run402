import type { Metadata } from "next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@run402/ui";
import { PageHeader } from "@/components/dashboard/page-header";
import { ThemePreference } from "@/components/settings/theme-preference";
import { DeveloperPreferences } from "@/components/settings/developer-preferences";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your account is managed by Clerk. Use the account menu (top right)
              to edit your name, email, avatar, and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback className="text-base">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how Run402 looks to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemePreference />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer preferences</CardTitle>
            <CardDescription>
              Timezone, notifications, and API / CLI defaults.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeveloperPreferences />
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <Button variant="destructive" disabled>
              Delete account
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
