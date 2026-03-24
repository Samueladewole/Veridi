import { PageStub } from "@/components/page-stub";

interface ClientDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;

  return (
    <PageStub
      title={`Client Detail \u2014 ${id}`}
      description="Full client profile including API usage analytics, billing history, verification logs, and account configuration. Manage keys, plans, and permissions."
      icon="\uD83C\uDFE2"
    />
  );
}
