import { ClientsTableFull } from "@/components/clients-table-full";
import { fetchAllClients } from "@/lib/clients-data-fetcher";

export default async function AllClientsPage() {
  const clients = await fetchAllClients({ limit: 50 });

  return <ClientsTableFull initialClients={clients} />;
}
