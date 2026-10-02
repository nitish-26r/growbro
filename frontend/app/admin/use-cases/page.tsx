"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { caseStudyApi, formatDate, type CaseStudy } from "@/lib/api";
import { Building2, ArrowRight, Loader2, Sparkles, TrendingUp } from "lucide-react";

export default function CaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await caseStudyApi.list("PUBLISHED");
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load case studies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="border-b border-slate-200 bg-white py-16 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-4 border border-purple-100">
            <Sparkles className="h-3.5 w-3.5" /> Customer Stories & Proven ROI
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Top Brands Scale with GrowBro
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Real metrics, verified case studies, and customer automation success stories.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto py-12 px-6 sm:px-8">
        {loading ? (
          <div className="flex items-center justify-center p-24 text-slate-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            <span className="text-sm font-medium">Loading case studies...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold text-lg">No case studies published yet.</p>
            <p className="text-slate-400 text-sm mt-1">Check back soon for new customer success breakdowns.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((cs) => (
              <article
                key={cs.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-purple-200 transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {cs.client_name || "Enterprise Client"}
                    </span>
                    {cs.metrics && (
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                        {cs.metrics}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition line-clamp-2">
                    {cs.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                    {cs.summary || cs.content.substring(0, 120) + "..."}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatDate(cs.published_at || cs.created_at)}</span>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-purple-600 group-hover:translate-x-0.5 transition"
                  >
                    Read Story <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}