import type { Metadata } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { MockCheckout } from "@/components/checkout/mock-checkout";
import { getCheckoutDetails } from "@/lib/data/payments";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Checkout" };

export default async function MockCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const details = payment ? await getCheckoutDetails(payment) : null;

  if (!details) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Payment not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This checkout link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  // Best-effort owner name for the "Developer" line.
  let developer = "Developer";
  try {
    const user = await (await clerkClient()).users.getUser(details.projectUserId);
    developer =
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Developer";
  } catch {
    /* fall back to the generic label */
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-12">
      <MockCheckout
        paymentId={details.paymentId}
        projectName={details.projectName}
        developer={developer}
        endpointLabel={`${details.endpointMethod} ${details.endpointPath}`}
        amountLabel={formatPrice(details.amount, details.currency)}
        currency={details.currency}
        status={details.status}
      />
    </div>
  );
}
