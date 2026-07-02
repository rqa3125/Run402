import type { Metadata } from "next";
import { CreditCard, Sparkles } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@run402/ui";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = { title: "Billing" };

/**
 * Billing placeholder. Payment logic is intentionally not implemented yet —
 * this is the surface the `@run402/payments` abstraction will power.
 */
export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Plans, usage and invoices." />

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              Current plan <Badge variant="secondary">Free</Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Unlimited local testing. Usage-based billing coming soon.
            </CardDescription>
          </div>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Payments are not enabled yet
            </div>
            <p className="text-sm text-muted-foreground">
              This page is a placeholder. When billing ships it will be powered
              by the provider-agnostic <code className="font-mono">@run402/payments</code>{" "}
              package (Stripe today, x402 and others later).
            </p>
            <Button disabled>Upgrade plan</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
