"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { leadApi } from "@/lib/api";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional context for which CTA opened the modal (for copy/analytics only). */
  trigger?: "start_free" | "book_demo";
}

const BUSINESS_TYPES = [
  "E-commerce / D2C",
  "Real Estate",
  "Coaching / Education",
  "Healthcare / Clinic",
  "Agency / Services",
  "Other",
];

export default function LeadCaptureModal({ open, onClose, trigger }: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function reset() {
    setName("");
    setPhone("");
    setEmail("");
    setBusinessType(BUSINESS_TYPES[0]);
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    onClose();
    // Give the close animation a beat before wiping the form state.
    setTimeout(reset, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and WhatsApp number are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await leadApi.create({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        channel: "WEBSITE",
        business_type: businessType,
        notes: trigger === "book_demo" ? "Requested a demo from the landing page" : "Signed up via Start Free CTA",
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a]">You&apos;re all set!</h3>
            <p className="mt-2 text-sm text-slate-500">
              Our team will reach out on WhatsApp within 15 minutes.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-8 py-8">
            <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <MessageCircle className="h-3.5 w-3.5" />
              {trigger === "book_demo" ? "Book a demo" : "Start free"}
            </div>
            <h3 className="text-xl font-bold text-[#0f172a]">
              {trigger === "book_demo"
                ? "Let's show you GrowBro live"
                : "Start growing with GrowBro"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              No credit card required. Set up in minutes.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {trigger === "book_demo" ? "Book my demo" : "Start Free now"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
