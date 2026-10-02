"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { blogApi, formatDate, type Blog } from "@/lib/api";
import { Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";

export default function AdminBlogsPage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      // Sirf Blogs fetch karega, baaki kuch nahi
      const data = await blogApi.list("ALL");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await blogApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete blog");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blogs CMS</h1>
            <p className="text-slate-500 text-sm mt-1">Manage articles, product updates, and news</p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Blog
          </Link>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="flex items-center justify-center p-20 text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading blogs...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium">No blogs found.</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-1 text-blue-600 text-sm font-bold mt-2"
            >
              Create the first blog &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Title &amp; Slug</th>
                  <th className="px-6 py-4">Category</th>
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
                      <div className="text-xs font-mono text-slate-400">/{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {item.category || "General"}
                      </span>
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
                        href={`/blog/${item.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-slate-700 inline-flex items-center"
                        title="View Live Blog"
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