"use client";

import { useTransition } from "react";
import { Card, CardHeader } from "@/components/card";
import type { ClientRecord } from "@/components/clients-data";
import { PLAN_STYLES, STATUS_STYLES } from "@/components/clients-data";
import { approveClient, suspendClient } from "@/lib/actions";

interface ClientDetailViewProps {
  readonly client: ClientRecord;
}

export function ClientDetailView({ client }: ClientDetailViewProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approveClient(client.id);
    });
  };

  const handleSuspend = () => {
    startTransition(async () => {
      await suspendClient(client.id);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-border-2 bg-panel-2 text-[16px] font-bold text-amber">
            {client.initials}
          </div>
          <div>
            <h1 className="font-heading text-[20px] font-extrabold text-text1">
              {client.name}
            </h1>
            <p className="font-mono text-[11px] text-text2">{client.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {client.status === "pending" && (
            <button
              onClick={handleApprove}
              disabled={isPending}
              className="rounded-[3px] bg-green px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-void transition-colors hover:bg-green/80 disabled:opacity-50"
            >
              {isPending ? "Processing..." : "Approve Client"}
            </button>
          )}
          {client.status === "active" && (
            <button
              onClick={handleSuspend}
              disabled={isPending}
              className="rounded-[3px] bg-red px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-void transition-colors hover:bg-red/80 disabled:opacity-50"
            >
              {isPending ? "Processing..." : "Suspend Client"}
            </button>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <InfoCard label="Plan" value={client.plan} badgeClass={PLAN_STYLES[client.plan]} />
        <InfoCard
          label="Status"
          value={client.status}
          badgeClass={STATUS_STYLES[client.status]}
        />
        <InfoCard label="Calls (30d)" value={client.calls30d} />
        <InfoCard label="MRR" value={client.mrr} valueClass="text-green" />
      </div>

      {/* Details */}
      <Card>
        <CardHeader title="Account Details" />
        <div className="grid grid-cols-2 gap-4 p-4">
          <DetailRow label="Client ID" value={client.id} />
          <DetailRow label="API Key" value={`${client.apiKeyPrefix}...`} />
          <DetailRow label="Joined" value={client.joined} />
          <DetailRow label="Last Active" value={client.lastActive} />
          <DetailRow label="Total Calls" value={client.callsTotal} />
        </div>
      </Card>
    </div>
  );
}

function InfoCard({
  label,
  value,
  badgeClass,
  valueClass,
}: {
  readonly label: string;
  readonly value: string;
  readonly badgeClass?: string;
  readonly valueClass?: string;
}) {
  return (
    <div className="rounded border border-border bg-panel p-3">
      <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-text2">
        {label}
      </div>
      {badgeClass ? (
        <span
          className={`inline-block rounded-[2px] px-[7px] py-[2px] font-mono text-[10px] uppercase tracking-[0.08em] ${badgeClass}`}
        >
          {value}
        </span>
      ) : (
        <div
          className={`font-heading text-[18px] font-extrabold ${valueClass ?? "text-text1"}`}
        >
          {value}
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-text3">
        {label}
      </div>
      <div className="mt-1 font-mono text-[11px] text-text1">{value}</div>
    </div>
  );
}
