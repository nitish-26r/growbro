import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudyApi, formatDate } from "@/lib/api";
import { ArrowLeft, Building2, TrendingUp, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SingleCaseStudyPage({ params }: Props) {
  const { slug } = await params;

  let item;
  try {
    item = await caseStudyApi.getBySlug(slug);
  } catch (error) {
    console.error("Failed to load case study by slug:", slug, error);
    notFound();
  }

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Case Studies
        </Link>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-6">
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            <Building2 className="h-3.5 w-3.5 text-purple-600" />
            {item.client_name || "Enterprise"}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(item.published_at)}
          </span>

          {item.metrics && (
            <span className="inline-flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              <TrendingUp className="h-3.5 w-3.5" />
              {item.metrics}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
          {item.title}
        </h1>

        {/* Summary Box */}
        {item.summary && (
          <div className="bg-purple-50/60 border-l-4 border-purple-500 p-4 rounded-r-2xl mb-8">
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              {item.summary}
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-base">
          {item.content}
        </div>
      </article>
    </div>
  );
}