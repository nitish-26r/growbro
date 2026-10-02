import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { blogApi, formatDate, estimateReadTime } from "@/lib/api";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const blog = await blogApi.getBySlug(params.slug);
    const description = blog.summary || blog.content.slice(0, 155);
    return {
      title: `${blog.title} | GrowBro Blog`,
      description,
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.title,
        description,
        type: "article",
        publishedTime: blog.created_at,
        modifiedTime: blog.updated_at,
        authors: [blog.author],
        images: blog.cover_image ? [{ url: blog.cover_image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description,
        images: blog.cover_image ? [blog.cover_image] : undefined,
      },
    };
  } catch {
    return {
      title: "GrowBro Blog",
    };
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  let blog;
  try {
    blog = await blogApi.getBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!blog || blog.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Cover */}
      <div className="relative h-72 w-full overflow-hidden bg-[#0f172a] sm:h-96">
        {blog.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-600/30 via-[#0f172a] to-[#0f172a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-10">
          <Link
            href="/blog"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <span className="mb-3 inline-flex w-fit rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            {blog.category}
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{blog.title}</h1>
        </div>
      </div>

      {/* Meta */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200 pb-6 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {blog.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDate(blog.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {estimateReadTime(blog.content)}
          </span>
        </div>

        {/* Content */}
        <article className="prose prose-slate max-w-none prose-headings:text-[#0f172a] prose-a:text-emerald-600 prose-strong:text-[#0f172a]">
          {blog.content.split("\n").map((paragraph, idx) =>
            paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          )}
        </article>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}
