import Link from "next/link";
import { CalendarDays, Clock, User, ArrowRight, Sprout } from "lucide-react";
import { blogApi, formatDate, estimateReadTime } from "@/lib/api";

export const revalidate = 60;

export default async function BlogListPage() {
  let blogs = [];
  let fetchError: string | null = null;

  try {
    blogs = await blogApi.list("PUBLISHED");
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load blog posts.";
  }

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm">
            <Sprout className="h-4 w-4" />
            GrowBro Insights
          </div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The GrowBro Blog
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Ideas, updates, and guides on growth, automation, and building
            better customer conversations.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        {fetchError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Couldn&apos;t load posts right now: {fetchError}
          </div>
        )}

        {!fetchError && blogs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No posts published yet. Check back soon.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {blog.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50">
                    <Sprout className="h-10 w-10 text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="mb-2 inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {blog.category}
                </span>
                <h2 className="text-lg font-semibold text-[#0f172a] group-hover:text-emerald-700">
                  {blog.title}
                </h2>
                {blog.summary && (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
                    {blog.summary}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {blog.author}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(blog.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {estimateReadTime(blog.content)}
                  </span>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
