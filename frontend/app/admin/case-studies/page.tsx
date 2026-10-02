"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { caseStudyApi, formatDate, type CaseStudy } from "@/lib/api";
import { Plus, Trash2, Building2, ExternalLink, Loader2 } from "lucide-react";

export default function AdminCaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const data = await caseStudyApi.list("ALL");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load case studies:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await caseStudyApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete case study");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Direct New Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Case Studies CMS</h1>
            <p className="text-slate-500 text-sm mt-1">Manage client stories, proof, and metrics</p>
          </div>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> New Case Study
          </Link>
        </div>

        {/* Content Table / Empty State */}
        {loading ? (
          <div className="flex items-center justify-center p-20 text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading case studies...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-medium">No case studies found.</p>
            <Link
              href="/admin/case-studies/new"
              className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-sm font-bold mt-3 underline underline-offset-4"
            >
              <Plus className="h-4 w-4" /> Create the first one &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Title &amp; Client</th>
                  <th className="px-6 py-4">Result Metric</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{item.title}</div>
                      <div className="text-xs font-normal text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {item.client_name || "Enterprise Client"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.metrics ? (
                        <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-bold border border-purple-200">
                          {item.metrics}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {formatDate(item.published_at || item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/case-studies/${item.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-slate-700 inline-flex items-center"
                        title="View Live"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-rose-400 hover:text-rose-600 inline-flex items-center"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}