import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Run402 collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 24, 2026"
      intro="This policy explains what information Run402 collects, how we use it, and the choices you have. We keep it short and readable on purpose."
      sections={[
        {
          heading: "Information we collect",
          body: [
            "Account information such as your name, email, and organization when you sign up.",
            "Usage and billing metadata generated when you protect routes and process payments — we store the minimum required to power analytics and reconciliation.",
            "We do not store your end users’ payment card details; those are handled directly by Stripe.",
          ],
        },
        {
          heading: "How we use information",
          body: [
            "To provide, maintain, and improve the Run402 service.",
            "To surface analytics, prevent abuse, and comply with legal obligations.",
            "We never sell your data, and we never train third-party models on your API traffic.",
          ],
        },
        {
          heading: "Data retention",
          body: [
            "We retain account and billing records for as long as your account is active, and as required by law thereafter.",
            "You can request deletion of your account and associated data at any time.",
          ],
        },
        {
          heading: "Security",
          body: [
            "Data is encrypted in transit and at rest. Access is restricted on a need-to-know basis and audited.",
            "Your API traffic runs inside your own infrastructure — the Run402 SDK does not proxy request bodies through our servers.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Depending on your region, you may have rights to access, correct, export, or delete your personal data.",
            "Contact legal@run402.com to exercise any of these rights.",
          ],
        },
      ]}
    />
  );
}
