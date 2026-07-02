"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@run402/ui";

/**
 * Developer preferences. Stored per-browser in localStorage for now — there is
 * no server-side prefs table yet, and none of these affect billing or data.
 * When one becomes server-relevant it graduates to the database.
 */
interface Prefs {
  timezone: string;
  notifyPayments: boolean;
  notifyWeeklyDigest: boolean;
  defaultEnvironment: "sandbox" | "live";
  prettyJson: boolean;
  cliColor: boolean;
  cliUpdateCheck: boolean;
}

const DEFAULTS: Prefs = {
  timezone: "auto",
  notifyPayments: true,
  notifyWeeklyDigest: false,
  defaultEnvironment: "sandbox",
  prettyJson: true,
  cliColor: true,
  cliUpdateCheck: true,
};

const STORAGE_KEY = "run402:prefs";

const TIMEZONES = [
  "auto",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function DeveloperPreferences() {
  const [prefs, setPrefs] = React.useState<Prefs>(DEFAULTS);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* corrupted prefs — fall back to defaults */
    }
  }, []);

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const save = () => {
    setSaving(true);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      toast.success("Preferences saved");
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={prefs.timezone}
          onValueChange={(v) => update("timezone", v)}
        >
          <SelectTrigger id="timezone" className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz === "auto" ? "Auto-detect (browser)" : tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Used for timestamps in logs and the explorer.
        </p>
      </div>

      <PrefGroup label="Notifications">
        <Toggle
          checked={prefs.notifyPayments}
          onChange={(v) => update("notifyPayments", v)}
          title="Payment events"
          description="Notify when a sandbox payment completes."
        />
        <Toggle
          checked={prefs.notifyWeeklyDigest}
          onChange={(v) => update("notifyWeeklyDigest", v)}
          title="Weekly digest"
          description="A summary of requests and revenue every Monday."
        />
      </PrefGroup>

      <PrefGroup label="API preferences">
        <div className="space-y-1.5">
          <Label htmlFor="default-env">Default environment</Label>
          <Select
            value={prefs.defaultEnvironment}
            onValueChange={(v) => update("defaultEnvironment", v as Prefs["defaultEnvironment"])}
          >
            <SelectTrigger id="default-env" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">Sandbox</SelectItem>
              <SelectItem value="live" disabled>
                Live (coming soon)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Toggle
          checked={prefs.prettyJson}
          onChange={(v) => update("prettyJson", v)}
          title="Pretty-print JSON"
          description="Format JSON in the playground and explorer."
        />
      </PrefGroup>

      <PrefGroup label="CLI preferences">
        <Toggle
          checked={prefs.cliColor}
          onChange={(v) => update("cliColor", v)}
          title="Colored output"
          description="Use colors and symbols in run402 terminal output."
        />
        <Toggle
          checked={prefs.cliUpdateCheck}
          onChange={(v) => update("cliUpdateCheck", v)}
          title="Update checks"
          description="Let the CLI check for new versions."
        />
      </PrefGroup>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={!dirty || saving}>
          {saving && <Loader2 className="animate-spin" />}
          Save preferences
        </Button>
        <p className="text-xs text-muted-foreground">
          Stored in this browser for now.
        </p>
      </div>
    </div>
  );
}

function PrefGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-border pt-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border accent-foreground"
      />
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}
