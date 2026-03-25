import { ClientsTableFull } from "@/components/clients-table-full";
import { fetchAllClients } from "@/lib/clients-data-fetcher";

export default async function PendingApprovalPage() {
  const clients = await fetchAllClients({ status: "pending", limit: 50 });

  return <ClientsTableFull initialClients={clients} />;
}
