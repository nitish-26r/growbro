"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { caseStudyApi } from "@/lib/api";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    client_name: "",
    metrics: "",
    content: "",
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title aur Content zaroori hain!");
      return;
    }

    try {
      setSubmitting(true);
      await caseStudyApi.create({
        ...form,
        client_name: form.client_name.trim() || "Enterprise Client",
        metrics: form.metrics.trim() || undefined,
      });

      // Submit hone ke baad wapas Case Studies CMS par redirect
      router.push("/admin/case-studies");
      router.refresh();
    } catch (err: any) {
      alert("Failed to create case study: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/case-studies"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Case Studies CMS
        </Link>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Case Study</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. How Studio Bloom Scaled WhatsApp Conversions"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Client / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Studio Bloom"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Impact / Result Metric</label>
                <input
                  type="text"
                  placeholder="e.g. +38% Sales"
                  value={form.metrics}
                  onChange={(e) => setForm({ ...form, metrics: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Summary</label>
              <textarea
                rows={2}
                placeholder="Short summary of the story..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Story Content *</label>
              <textarea
                required
                rows={6}
                placeholder="Full case study write-up..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Publish Case Study
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}