import Link from "next/link";
import { BookOpen, Briefcase, FileText, GraduationCap, Users } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Blog CMS", href: "/admin/blogs", icon: FileText },
    { label: "Case Studies CMS", href: "/admin/case-studies", icon: Briefcase },
    { label: "Tutorials CMS", href: "/admin/tutorials", icon: GraduationCap },
    { label: "Use Cases CMS", href: "/admin/use-cases", icon: BookOpen },
    { label: "CRM Leads", href: "/admin/crm", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#0a1128] text-white flex flex-col justify-between shrink-0 p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white">
              G
            </div>
            <div>
              <div className="font-bold text-base tracking-wide">GrowBro</div>
              <div className="text-xs text-slate-400">Admin Console</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            &larr; View public site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}