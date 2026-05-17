import { LoginForm } from "./login-form";
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#09090b]">

      {/* ── Left panel — product showcase ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-950 via-[#0d0a1e] to-[#09090b] p-10 lg:flex">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[80px]" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold shadow-lg shadow-violet-500/30">
            P
          </div>
          <span className="text-sm font-semibold text-white">Performly</span>
        </div>

        {/* Quote / value prop */}
        <div className="relative space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Goal management that actually{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              enforces the rules.
            </span>
          </h1>

          <div className="space-y-3">
            {[
              "Weighted goals validated to 100%",
              "Manager approval locks the record",
              "Hash-chained audit trail for compliance",
              "Quarterly windows prevent out-of-cycle edits",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                <Shield className="h-4 w-4 flex-shrink-0 text-violet-400" />
                {item}
              </div>
            ))}
          </div>

          <blockquote className="rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm">
            <p className="text-xs leading-5 text-white/50 italic">
              "Performly replaced our quarterly review spreadsheet with a system that actually enforces governance. Our audit passed without a single manual correction."
            </p>
            <footer className="mt-2 text-xs text-white/30">— Head of HR, Series B SaaS</footer>
          </blockquote>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[["186", "Goal sheets"], ["98.4%", "Valid submissions"], ["30d", "Free trial"]].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/8 bg-white/4 p-3 text-center">
              <p className="text-lg font-bold text-white">{v}</p>
              <p className="text-[10px] text-white/35">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold">
              P
            </div>
            <span className="text-sm font-semibold text-white">Performly</span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Create your workspace</h2>
            <p className="mt-1.5 text-sm text-white/40">
              Start a 30-day Starter trial. No card required.
            </p>
          </div>

          <div className="glass-card p-6">
            <LoginForm />
          </div>

          <p className="mt-5 text-center text-xs text-white/25">
            Production uses Google OAuth. This creates a local mock session for testing.
          </p>
        </div>
      </div>
    </div>
  );
}
