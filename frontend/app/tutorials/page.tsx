"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { blogApi, formatDate, type Blog } from "@/lib/api";
import { PlayCircle, Clock, ArrowRight, Loader2, ArrowLeft, Search } from "lucide-react";

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    async function fetchTutorials() {
      try {
        const data = await blogApi.list({
          content_type: "TUTORIAL",
          status: "PUBLISHED",
        });
        setTutorials(data);
      } catch (err) {
        console.error("Failed to load tutorials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTutorials();
  }, []);

  // Filter Categories dynamically from received tutorials
  const categories = useMemo(() => {
    const cats = new Set(tutorials.map((t) => t.category));
    return ["ALL", ...Array.from(cats)];
  }, [tutorials]);

  // Client-side instant filter based on search & category
  const filteredTutorials = useMemo(() => {
    return tutorials.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [tutorials, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Knowledge Base &amp; Guides
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Master GrowBro with Step-by-Step Tutorials
          </h1>
          <p className="mt-3 text-slate-600 text-base">
            Learn how to automate customer support, setup WhatsApp webhooks, and scale conversion pipelines.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tutorials &amp; topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-20 text-slate-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading tutorials...
          </div>
        ) : filteredTutorials.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
            No tutorials matched your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((item) => (
              <Link
                key={item.id}
                href={`/tutorials/${item.slug}`}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(item.published_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <PlayCircle className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-semibold uppercase">Walkthrough</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 mt-2 line-clamp-3 flex-1">
                  {item.summary || item.content.slice(0, 110) + "..."}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5" /> 5-10 min setup
                  </span>
                  <span className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Start Guide <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}