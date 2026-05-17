"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Calendar, BarChart3, Users, FileText, ArrowRight, Check, Zap } from "lucide-react";
import { Reveal, StaggerChildren, staggerItem, AnimatedNumber } from "@/components/motion";

/* ── Static data ────────────────────────────────────────────────────────── */
const metrics = [
  { value: 100, suffix: "%", label: "Weightage enforced", desc: "Goal sheets must total exactly 100%" },
  { value: 10, suffix: "%", label: "Minimum per goal", desc: "No individual goal below 10% weight" },
  { value: 8, suffix: "", label: "Max goals", desc: "Hard cap on submissions per cycle" },
  { value: 30, suffix: "d", label: "Free trial", desc: "No card required to get started" },
];

const features = [
  { icon: Shield, title: "Approval Workflow", desc: "Managers review, edit inline, and lock goal sheets. No more email chains or file churn.", color: "text-violet-400" },
  { icon: Lock, title: "Lock Governance", desc: "Approved goals are locked. Admin unlocks require a reason and are permanently logged.", color: "text-indigo-400" },
  { icon: Calendar, title: "Quarterly Windows", desc: "Achievement tracking opens and closes on HR-defined timelines. No out-of-cycle updates.", color: "text-sky-400" },
  { icon: FileText, title: "Audit Trail", desc: "Every post-lock change is recorded with actor, timestamp, and hash-chain integrity.", color: "text-emerald-400" },
  { icon: Users, title: "Role-Based Access", desc: "Employees, Managers, and Admin/HR each have a scoped view and set of permissions.", color: "text-amber-400" },
  { icon: BarChart3, title: "Progress Engine", desc: "Supports Min, Max, Timeline, Zero, Boolean, Percentage, and Currency scoring models.", color: "text-rose-400" },
];

const workflowSteps = [
  { n: "01", title: "HR Opens Cycle", desc: "Configure goal categories, timelines, and quarterly check-in windows." },
  { n: "02", title: "Employee Submission", desc: "Employees create weighted goals. Backend validates 100% rule, 10% floor, and max-8 limit." },
  { n: "03", title: "Manager Review", desc: "Managers edit inline if needed, then approve. Goal sheet locks immediately." },
  { n: "04", title: "Quarterly Check-In", desc: "Employees enter actuals during active windows. Managers review and comment." },
  { n: "05", title: "Audit & Governance", desc: "Locked changes require admin reason. Hash-chained audit logs preserve history." },
];

const plans = [
  {
    name: "Starter", price: "₹2,999", period: "/mo", limit: "Up to 25 employees",
    desc: "Small teams replacing spreadsheet reviews.",
    features: ["30-day trial included", "Goal validation engine", "Manager approvals", "CSV exports"],
    highlight: false, cta: "Start free trial",
  },
  {
    name: "Growth", price: "₹7,999", period: "/mo", limit: "Up to 100 employees",
    desc: "Growing companies needing governance across departments.",
    features: ["Everything in Starter", "Quarterly check-ins", "Audit log visibility", "Priority support"],
    highlight: true, cta: "Start free trial",
  },
  {
    name: "Enterprise", price: "Contact sales", period: "", limit: "Unlimited",
    desc: "Large organizations with custom rollout needs.",
    features: ["Custom employee limit", "Advanced governance", "Onboarding & training", "Custom billing"],
    highlight: false, cta: "Talk to us",
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold shadow-lg shadow-violet-500/25">
                P
              </div>
              <span className="text-sm font-semibold text-white">Performly</span>
            </a>
            <div className="hidden items-center gap-6 text-sm font-medium text-white/50 lg:flex">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="/login" className="btn-primary text-sm px-5 py-2">
              Start trial
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 lg:pt-28">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
        </div>

        <div className="relative grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Enterprise goal management platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            >
              Goal setting with{" "}
              <span className="gradient-text">enforcement</span>,<br />
              not spreadsheets.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base leading-7 text-white/55 max-w-lg"
            >
              Performly gives HR teams a controlled system for weighted goal creation, manager approval, locked record governance, quarterly tracking, and audit-ready compliance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a href="/login" className="btn-primary px-6 py-2.5 text-sm">
                Start 30-day trial <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#features" className="btn-outline px-6 py-2.5 text-sm border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                View features
              </a>
            </motion.div>

            {/* Metric pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {metrics.map((m) => (
                <div key={m.label} className="glass-card p-3.5">
                  <p className="text-xl font-bold text-white">
                    <AnimatedNumber value={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/40">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="gradient-border rounded-2xl p-0.5 shadow-2xl shadow-violet-500/10">
              <div className="rounded-[15px] bg-[#111113] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    {["bg-red-500/60","bg-amber-500/60","bg-emerald-500/60"].map(c=>(
                      <div key={c} className={`h-3 w-3 rounded-full ${c}`}/>
                    ))}
                  </div>
                  <span className="ml-2 text-[11px] font-medium text-white/20">Admin Console — FY 2026</span>
                </div>

                {/* Dashboard preview */}
                <div className="p-5 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[["Submitted","186","text-white"],["Approved","119","text-emerald-400"],["At risk","14","text-amber-400"]].map(([l,v,c])=>(
                      <div key={l} className="rounded-lg border border-white/5 bg-white/3 p-3">
                        <p className="text-[10px] text-white/30">{l}</p>
                        <p className={`mt-1 text-lg font-bold ${c}`}>{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bars */}
                  <div className="rounded-lg border border-white/5 bg-white/3 p-4">
                    <div className="flex justify-between mb-3">
                      <p className="text-xs font-semibold text-white/60">Q2 Progress</p>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">72% avg</span>
                    </div>
                    <div className="space-y-2.5">
                      {[["Revenue","78%","w-[78%]","bg-violet-500"],["Process","64%","w-[64%]","bg-indigo-500"],["People","49%","w-[49%]","bg-sky-500"]].map(([l,v,w,c])=>(
                        <div key={l}>
                          <div className="flex justify-between text-[10px] text-white/40 mb-1">
                            <span>{l}</span><span>{v}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5">
                            <div className={`h-1.5 rounded-full ${c} ${w} transition-all`}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review queue */}
                  <div className="rounded-lg border border-white/5 bg-white/3 p-4">
                    <p className="text-xs font-semibold text-white/60 mb-2">Pending approvals</p>
                    {["Aarav Mehta","Priya Nair","Kabir Shah"].map(name=>(
                      <div key={name} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[9px] font-bold">
                            {name[0]}
                          </div>
                          <span className="text-xs text-white/70">{name}</span>
                        </div>
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] text-amber-400 font-medium">4 goals</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 glass-card px-3 py-2 shadow-xl border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white/70">98.4% valid submissions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Platform</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Built for controlled goal operations.</h2>
            <p className="mt-3 text-base text-white/50 max-w-xl">
              Performly enforces business rules, record locking, and audit governance so HR teams can stop chasing spreadsheets.
            </p>
          </Reveal>

          <StaggerChildren className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.07}>
            {features.map((f) => (
              <motion.article
                key={f.title}
                variants={staggerItem}
                className="glass-card group p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
              >
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ${f.color} group-hover:bg-white/10 transition-colors`}>
                  <f.icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/45">{f.desc}</p>
              </motion.article>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="workflow" className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Workflow</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Complete lifecycle in five steps.</h2>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {workflowSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <article className="glass-card h-full p-5 group hover:border-violet-500/30 transition-all duration-300">
                  <p className="text-xs font-bold text-violet-400/60">{step.n}</p>
                  <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="mt-5 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/45">{step.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Pricing</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Plans for any scale.</h2>
              <p className="mt-2 text-sm text-white/50">30-day trial on all plans. Annual billing includes two months free.</p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <article className={`relative h-full rounded-2xl p-6 ${plan.highlight
                  ? "bg-gradient-to-b from-violet-600 to-indigo-700 shadow-2xl shadow-violet-500/20"
                  : "glass-card"
                }`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        Most popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <p className="mt-5">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-white/50">{plan.period}</span>}
                  </p>
                  <p className="mt-1 text-xs text-white/40">{plan.limit}</p>
                  <p className="mt-3 text-xs leading-5 text-white/50">{plan.desc}</p>

                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                        <Check className={`h-3.5 w-3.5 flex-shrink-0 ${plan.highlight ? "text-white" : "text-violet-400"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/login"
                    className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${plan.highlight
                      ? "bg-white text-violet-700 hover:bg-white/90"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 p-10 text-center shadow-2xl shadow-violet-500/20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
              </div>
              <div className="relative">
                <Zap className="mx-auto mb-4 h-8 w-8 text-white/60" />
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to move beyond spreadsheets?</h2>
                <p className="mt-3 text-sm text-white/70 max-w-md mx-auto">
                  Start a trial workspace, test the approval flow, and connect Google OAuth, Razorpay, and Resend when you are ready for production.
                </p>
                <a href="/login" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-violet-700 shadow-lg hover:bg-white/90 transition-all">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold">P</div>
                <span className="text-sm font-semibold text-white">Performly</span>
              </div>
              <p className="mt-3 text-xs text-white/35 leading-5">Enterprise goal setting, approval, tracking, and audit governance.</p>
            </div>
            {[
              { title: "Product", links: ["Features","Workflow","Pricing","Changelog"] },
              { title: "Company", links: ["About","Blog","Careers","Press"] },
              { title: "Legal", links: ["Privacy","Terms","Security","Cookies"] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/30">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-xs text-white/45 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
            <p className="text-xs text-white/25">© {new Date().getFullYear()} Performly. All rights reserved.</p>
            <p className="text-xs text-white/25">Built for enterprise goal governance.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
