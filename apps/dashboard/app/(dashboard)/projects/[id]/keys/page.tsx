import type { Metadata } from "next";
import { ApiKeysPanel } from "@/components/projects/api-keys-panel";
import { requireUser } from "@/lib/auth";
import { listApiKeys } from "@/lib/data/api-keys";

export const metadata: Metadata = { title: "API keys" };

export default async function ApiKeysPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const keys = await listApiKeys(user.id, id);

  return <ApiKeysPanel projectId={id} keys={keys} />;
}
