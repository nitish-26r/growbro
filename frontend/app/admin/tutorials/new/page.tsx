"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tutorialApi } from "@/lib/api";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function NewTutorialPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    category: "WhatsApp Setup",
    duration: "5 min read",
    content: "",
    cta_text: "Try It Free",
    cta_link: "/",
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await tutorialApi.create(form);
      router.push("/admin/tutorials");
    } catch (err: any) {
      alert("Failed to create tutorial: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/tutorials" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6">
          <ArrowLeft className="h-3 w-3" /> Back to Tutorials CMS
        </Link>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Tutorial</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. How to Connect Meta Cloud API"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Estimated Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Summary</label>
              <textarea
                rows={2}
                placeholder="Brief summary of what the user will build or learn..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Step-by-Step Content (Markdown Supported) *</label>
              <textarea
                required
                rows={8}
                placeholder="### Step 1: Login to portal..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={form.cta_text}
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Publish Tutorial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}