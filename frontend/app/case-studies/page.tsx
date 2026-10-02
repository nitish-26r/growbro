"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { caseStudyApi, formatDate, type CaseStudy } from "@/lib/api";
import { ArrowRight, Building2, TrendingUp, Sparkles, Loader2, ArrowLeft } from "lucide-react";

export default function CaseStudiesPublicPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await caseStudyApi.list("PUBLISHED");
        setItems(data);
      } catch (err) {
        console.error("Failed to load case studies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Proven Results
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Case Studies &amp; Stories
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            See how brands scaled revenue and automated conversations with GrowBro.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center p-20 text-slate-500 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" /> Loading stories...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-600 font-medium">No published case studies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/case-studies/${item.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Building2 className="h-3.5 w-3.5 text-purple-500" />
                    {item.client_name || "Enterprise"}
                  </span>
                  <span>{formatDate(item.published_at)}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
                  {item.summary || item.content.slice(0, 120) + "..."}
                </p>

                {item.metrics && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                      <TrendingUp className="h-3.5 w-3.5" /> {item.metrics}
                    </span>
                    <span className="text-purple-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}