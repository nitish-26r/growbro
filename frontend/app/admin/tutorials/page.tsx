"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { tutorialApi, formatDate, type Tutorial } from "@/lib/api";
import { Plus, Trash2, ArrowLeft, Loader2, BookOpen } from "lucide-react";

export default function AdminTutorialsPage() {
  const [items, setItems] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const data = await tutorialApi.list("ALL");
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this tutorial?")) return;
    try {
      await tutorialApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to Home
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-emerald-600" /> Tutorials CMS
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage technical step-by-step guides and walkthroughs</p>
          </div>
          <Link
            href="/admin/tutorials/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <Plus className="h-4 w-4" /> Add Tutorial
          </Link>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading tutorials...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            No tutorials found. Click "Add Tutorial" to publish your first guide!
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-900 max-w-xs truncate">{t.title}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          t.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{formatDate(t.published_at)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 transition"
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