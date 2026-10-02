const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.warn(`API responded with ${res.status}: ${errorBody}`);
      return [] as unknown as T;
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`Network fetch failed for ${endpoint}:`, err?.message || err);
    // Yahan throw mat karo, safe fallback return karo taaki Next.js red screen na de
    return [] as unknown as T;
  }
}
// ------------------------------------------------------------
// Constants & Enums
// ------------------------------------------------------------
export const BLOG_CATEGORIES = [
  "Product Updates",
  "WhatsApp Automation",
  "Conversion Optimization",
  "Case Studies & Growth",
  "Engineering & AI",
] as const;

export type BlogStatus = "DRAFT" | "PUBLISHED";
export type PublishStatus = "DRAFT" | "PUBLISHED";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export interface BaseItem {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  cover_image?: string | null;
  status: BlogStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Blog extends BaseItem {
  category: string;
  author: string;
}

export interface CaseStudy extends BaseItem {
  client_name?: string | null;
  metrics?: string | null;
}

export interface UseCase extends BaseItem {
  industry: string;
}

export interface Tutorial extends BaseItem {
  category: string;
  duration?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
}

export type LeadChannel = "WHATSAPP" | "INSTAGRAM" | "WEBSITE" | "MESSENGER";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export interface Lead {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  channel: LeadChannel;
  business_type?: string | null;
  status: LeadStatus;
  notes?: string | null;
  created_at: string;
}

// ------------------------------------------------------------
// API Handlers
// ------------------------------------------------------------
export const blogApi = {
  list: (params?: any) => {
    let query = "";
    if (typeof params === "string") {
      query = `?status=${params}`;
    } else if (params && typeof params === "object") {
      const sp = new URLSearchParams();
      if (params.status && params.status !== "ALL") {
        sp.append("status", params.status);
      }
      query = sp.toString() ? `?${sp.toString()}` : "";
    }
    return request<Blog[]>(`/api/blogs${query}`);
  },
  getBySlug: (slug: string) => request<Blog>(`/api/blogs/${encodeURIComponent(slug)}`),
  create: (data: Partial<Blog>) => request<Blog>("/api/blogs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Blog>) => request<Blog>(`/api/blogs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/api/blogs/${id}`, { method: "DELETE" }),
  delete: (id: string) => request<void>(`/api/blogs/${id}`, { method: "DELETE" }),
};


export const caseStudyApi = {
  list: (status = "PUBLISHED") => request<CaseStudy[]>(`/api/case-studies?status=${status}`),
  getBySlug: (slug: string) => request<CaseStudy>(`/api/case-studies/${encodeURIComponent(slug)}`),
  create: (data: Partial<CaseStudy>) => request<CaseStudy>("/api/case-studies", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/case-studies/${id}`, { method: "DELETE" }),
};

export const useCaseApi = {
  list: (status = "PUBLISHED") => request<UseCase[]>(`/api/use-cases?status=${status}`),
  getBySlug: (slug: string) => request<UseCase>(`/api/use-cases/${encodeURIComponent(slug)}`),
  create: (data: Partial<UseCase>) => request<UseCase>("/api/use-cases", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/use-cases/${id}`, { method: "DELETE" }),
};

export const tutorialApi = {
  list: (status = "PUBLISHED") => request<Tutorial[]>(`/api/tutorials?status=${status}`),
  getBySlug: (slug: string) => request<Tutorial>(`/api/tutorials/${encodeURIComponent(slug)}`),
  create: (data: Partial<Tutorial>) => request<Tutorial>("/api/tutorials", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/tutorials/${id}`, { method: "DELETE" }),
};

export const leadApi = {
  list: () => request<Lead[]>("/api/leads"),
  create: (data: Partial<Lead>) => request<Lead>("/api/leads", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id: string, status: LeadStatus) =>
    request<Lead>(`/api/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) => request<void>(`/api/leads/${id}`, { method: "DELETE" }),
};

// ------------------------------------------------------------
// Utilities (Exported)
// ------------------------------------------------------------
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function estimateReadTime(text: string): string {
  if (!text) return "1 min read";
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function waLink(phone: string, text = ""): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ""}`;
}