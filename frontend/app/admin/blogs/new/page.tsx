"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogApi, BLOG_CATEGORIES } from "@/lib/api";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function NewBlogPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    author: "GrowBro Team",
    category: BLOG_CATEGORIES[0] || "General",
    cover_image: "",
    content: "",
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title aur Content dono zaroori hain!");
      return;
    }

    try {
      setSubmitting(true);
      await blogApi.create({
        ...form,
        slug: form.slug.trim() || undefined,
        summary: form.summary.trim() || null,
        cover_image: form.cover_image.trim() || null,
      });
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      alert("Blog create nahi ho paya: " + (err.message || "Error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/blogs"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Blogs CMS
        </Link>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Blog Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. 5 Strategies to Scale Customer Support"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500"
                >
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Cover Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Summary</label>
              <textarea
                rows={2}
                placeholder="Short excerpt for blog card preview..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Blog Content *</label>
              <textarea
                required
                rows={8}
                placeholder="Write full blog post content..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Publish Blog Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}