import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Run402.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 24, 2026"
      intro="These terms govern your access to and use of Run402. By using the service, you agree to them."
      sections={[
        {
          heading: "Using Run402",
          body: [
            "You may use Run402 to monetize APIs you own or are authorized to operate.",
            "You are responsible for the content and legality of the APIs you protect and the prices you set.",
          ],
        },
        {
          heading: "Accounts",
          body: [
            "You must provide accurate information and keep your credentials secure.",
            "You are responsible for all activity that occurs under your account.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Payments are processed through Stripe. You are responsible for maintaining a Stripe account in good standing.",
            "Run402 subscription fees are billed in advance and are non-refundable except where required by law.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "Do not use Run402 to facilitate fraud, launder funds, or sell prohibited goods or services.",
            "We may suspend accounts that violate these terms or applicable law.",
          ],
        },
        {
          heading: "Disclaimers & liability",
          body: [
            "The service is provided “as is” without warranties of any kind.",
            "To the maximum extent permitted by law, Run402 is not liable for indirect or consequential damages.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "We may update these terms from time to time. Material changes will be communicated in advance.",
            "Continued use after changes take effect constitutes acceptance.",
          ],
        },
      ]}
    />
  );
}
