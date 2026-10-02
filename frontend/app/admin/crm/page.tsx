"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Globe,
  Send,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";
import {
  leadApi,
  formatDate,
  waLink,
  type Lead,
  type LeadChannel,
  type LeadStatus,
} from "@/lib/api";

function Instagram({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const CHANNEL_CONFIG: Record<
  LeadChannel,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  WHATSAPP: {
    label: "WhatsApp",
    icon: MessageCircle,
    className: "bg-emerald-100 text-emerald-700",
  },
  INSTAGRAM: {
    label: "Instagram",
    icon: Instagram,
    className: "bg-pink-100 text-pink-700",
  },
  WEBSITE: {
    label: "Website",
    icon: Globe,
    className: "bg-blue-100 text-blue-700",
  },
  MESSENGER: {
    label: "Messenger",
    icon: Send,
    className: "bg-indigo-100 text-indigo-700",
  },
};

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
];

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-slate-100 text-slate-700 border-slate-200",
  CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
  QUALIFIED: "bg-blue-50 text-blue-700 border-blue-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  LOST: "bg-red-50 text-red-700 border-red-200",
};

export default function CrmLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<LeadChannel | "ALL">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadLeads() {
    setLoading(true);
    setError(null);
    try {
      const data = await leadApi.list({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        channel: channelFilter === "ALL" ? undefined : channelFilter,
      });
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, channelFilter]);

  async function handleStatusChange(lead: Lead, newStatus: LeadStatus) {
    setUpdatingId(lead.id);
    try {
      const updated = await leadApi.updateStatus(lead.id, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update lead status");
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "NEW").length,
      converted: leads.filter((l) => l.status === "CONVERTED").length,
    };
  }, [leads]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">CRM Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track inbound leads from WhatsApp, Instagram, and your website.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Leads
          </p>
          <p className="mt-1 text-2xl font-bold text-[#0f172a]">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">New</p>
          <p className="mt-1 text-2xl font-bold text-[#0f172a]">{counts.new}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Converted
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{counts.converted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "ALL")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as LeadChannel | "ALL")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">All channels</option>
          {Object.entries(CHANNEL_CONFIG).map(([value, cfg]) => (
            <option key={value} value={value}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No leads match these filters.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Channel</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => {
                const channel = CHANNEL_CONFIG[lead.channel];
                const ChannelIcon = channel.icon;
                return (
                  <tr key={lead.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-medium text-[#0f172a]">{lead.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-slate-600">
                        <a
                          href={waLink(lead.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {lead.phone}
                        </a>
                        {lead.email && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="h-3.5 w-3.5" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${channel.className}`}
                      >
                        <ChannelIcon className="h-3.5 w-3.5" />
                        {channel.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead, e.target.value as LeadStatus)
                          }
                          disabled={updatingId === lead.id}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 ${STATUS_STYLES[lead.status]}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {updatingId === lead.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(lead.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}