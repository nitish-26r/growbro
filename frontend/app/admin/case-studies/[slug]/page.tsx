"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { caseStudyApi, formatDate, type CaseStudy } from "@/lib/api";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CaseStudyDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [data, setData] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await caseStudyApi.getBySlug(slug);
        setData(res);
      } catch (err) {
        console.error("Failed to load case study:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadItem();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading case study...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Case Study not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Case Studies
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-purple-100 text-purple-800 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Case Study
            </span>
            {data.client_name && (
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                Client: {data.client_name}
              </span>
            )}
            {data.metrics && (
              <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                Result: {data.metrics}
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto">
              {formatDate(data.published_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
            {data.title}
          </h1>

          {data.summary && (
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              {data.summary}
            </p>
          )}
        </div>

        {/* Story Content Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm mb-10">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-base">
            {data.content}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
          <h3 className="text-2xl font-bold tracking-tight">Ready to see similar results?</h3>
          <p className="mt-2 text-slate-400 text-sm max-w-md mx-auto">
            Book a 15-minute demo to see how GrowBro scales your business.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md"
            >
              <Sparkles className="h-4 w-4" /> Start Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}