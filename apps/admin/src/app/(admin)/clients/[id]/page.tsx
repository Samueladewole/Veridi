import { notFound } from "next/navigation";
import { fetchClientDetail } from "@/lib/clients-data-fetcher";
import { ClientDetailView } from "@/components/client-detail-view";

interface ClientDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;
  const client = await fetchClientDetail(id);

  if (!client) {
    notFound();
  }

  return <ClientDetailView client={client} />;
}
