"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { MembershipRole } from "@/lib/api";
import { mockCompanyLogin } from "@/lib/api";

const roles: { label: string; value: MembershipRole; desc: string }[] = [
  { label: "Admin / HR", value: "admin",    desc: "Full access" },
  { label: "Manager",    value: "manager",  desc: "Approvals" },
  { label: "Employee",   value: "employee", desc: "Goals only" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<MembershipRole>("admin");

  async function handleSubmit(formData: FormData) {
    setError(null);
    const email      = String(formData.get("email")      ?? "").trim();
    const fullName   = String(formData.get("fullName")   ?? "").trim();
    const companyName = String(formData.get("companyName") ?? "").trim();

    if (!fullName)    { setError("Full name is required.");    return; }
    if (!companyName) { setError("Company name is required."); return; }
    if (!email)       { setError("Email address is required."); return; }
    if (!EMAIL_RE.test(email)) { setError("Please enter a valid email address."); return; }

    startTransition(() => {
      void (async () => {
        try {
          await mockCompanyLogin({ email, full_name: fullName, company_name: companyName, role });
          router.replace("/dashboard"); // replace prevents back-nav to login
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to create workspace.");
        }
      })();
    });
  }

  return (
    <form action={handleSubmit} noValidate className="space-y-4">
      {/* Full name */}
      <div>
        <label htmlFor="fullName" className="field-label text-white/50">Full name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Smith"
          className="input-field-dark"
          aria-required="true"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="field-label text-white/50">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@company.com"
          className="input-field-dark"
          aria-required="true"
        />
      </div>

      {/* Company name */}
      <div>
        <label htmlFor="companyName" className="field-label text-white/50">Company name</label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          required
          autoComplete="organization"
          placeholder="Acme Inc."
          className="input-field-dark"
          aria-required="true"
        />
      </div>

      {/* Role selector */}
      <div>
        <p className="field-label text-white/50">Sign in as</p>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={role === opt.value}
              onClick={() => setRole(opt.value)}
              className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-all ${
                role === opt.value
                  ? "border-violet-500 bg-violet-500/15 text-violet-300"
                  : "border-white/8 bg-white/3 text-white/40 hover:border-white/15 hover:text-white/60"
              }`}
            >
              <p className="font-semibold">{opt.label}</p>
              <p className="mt-0.5 text-[10px] opacity-60">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full justify-center py-2.5"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating workspace…
          </>
        ) : (
          "Create trial workspace"
        )}
      </button>
    </form>
  );
}
