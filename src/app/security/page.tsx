"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Eye,
  FileCheck2,
  GitBranch,
  Lock,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

const NAV = ["Product", "Solutions", "Docs", "Pricing", "Customers"];

const LOGOS = ["NORTHWIND", "ACME CLOUD", "HELIOS", "VANTA-9", "KESTREL", "OBSIDIAN"];

const FEATURES = [
  {
    icon: Eye,
    title: "Continuous asset discovery",
    body: "Agentless scanning maps every workload, identity and data store across AWS, GCP and Azure within minutes of connecting.",
  },
  {
    icon: GitBranch,
    title: "Policy as code",
    body: "Version your controls alongside your infrastructure. Every change reviewed, every drift caught before it reaches production.",
  },
  {
    icon: Zap,
    title: "Runtime threat detection",
    body: "Behavioural baselines per workload. Alerts carry the full process tree, not a rule ID and a shrug.",
  },
  {
    icon: Terminal,
    title: "Built for engineers",
    body: "A real CLI, a typed SDK and webhooks that fire in under a second. No portal-only workflows.",
  },
  {
    icon: Boxes,
    title: "Supply chain integrity",
    body: "SBOM generation and signature verification on every build, wired into your existing CI in one step.",
  },
  {
    icon: FileCheck2,
    title: "Evidence on demand",
    body: "Auditor-ready exports generated from live control state — not a spreadsheet someone updated last quarter.",
  },
];

const COMPLIANCE = [
  "SOC 2 Type II",
  "ISO 27001",
  "ISO 27017",
  "GDPR",
  "HIPAA",
  "FedRAMP Ready",
];

const TESTIMONIALS = [
  {
    quote:
      "We cut mean time to remediation from nine days to under four hours. The difference is that findings arrive with enough context to act on.",
    name: "Priya Raghavan",
    role: "VP Security Engineering, Northwind",
  },
  {
    quote:
      "Our SOC 2 evidence collection went from a six-week fire drill to a scheduled export. Audit season stopped being a quarter-killer.",
    name: "Daniel Okafor",
    role: "Head of Compliance, Helios",
  },
  {
    quote:
      "The CLI is the whole reason we switched. My team lives in a terminal and the tool finally meets them there.",
    name: "Mei Tanaka",
    role: "Staff Platform Engineer, Kestrel",
  },
];

const STATS = [
  { value: "4h", label: "Median time to remediation" },
  { value: "99.99%", label: "Control-plane uptime" },
  { value: "3.2M", label: "Workloads monitored" },
];

export default function SecurityLandingPage() {
  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] antialiased">
      {/* ------------------------------------------------------ navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08090a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
              <ShieldCheck className="h-5 w-5 text-[#7170ff]" />
              Bastion
            </span>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((item) => (
                <a
                  key={item}
                  href="#features"
                  className="text-[13px] text-[#8a8f98] transition-colors duration-150 hover:text-[#f7f8f8]"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden text-[13px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8] sm:block"
            >
              Sign in
            </a>
            <a
              href="#cta"
              className="rounded-[7px] bg-[#f7f8f8] px-3.5 py-1.5 text-[13px] font-medium text-[#08090a] transition-opacity duration-150 hover:opacity-90"
            >
              Book a demo
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(113,112,255,0.20) 0%, rgba(113,112,255,0.05) 45%, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-24 text-center">
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1 text-[12px] text-[#b4bcc9] transition-colors hover:border-white/20"
          >
            <span className="rounded-full bg-[#7170ff] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              New
            </span>
            Runtime detection is now GA
            <ArrowRight className="h-3 w-3" />
          </a>

          <h1 className="mt-7 text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[62px]">
            Security that keeps up
            <br />
            with your engineers
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#8a8f98]">
            Bastion finds the risk that actually matters across your cloud,
            code and supply chain — and hands your team the context to fix it
            before an auditor or an attacker finds it first.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#cta"
              className="group flex items-center gap-2 rounded-[7px] bg-[#7170ff] px-5 py-2.5 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#8281ff]"
            >
              Book a demo
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="rounded-[7px] border border-white/[0.12] px-5 py-2.5 text-[14px] font-medium text-[#f7f8f8] transition-colors duration-150 hover:bg-white/[0.06]"
            >
              Read the docs
            </a>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[#6b7280]">
            <Lock className="h-3 w-3" />
            No agent to install · Read-only by default · SOC 2 Type II
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- social proof */}
      <section className="border-b border-white/[0.08] py-10">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
          Trusted by security teams at
        </p>
        <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6">
          {LOGOS.map((logo) => (
            <span
              key={logo}
              className="text-[15px] font-semibold tracking-[0.08em] text-[#4b5563] transition-colors duration-150 hover:text-[#8a8f98]"
            >
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- metrics */}
      <section className="border-b border-white/[0.08]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/[0.08] px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4 py-10 text-center">
              <p className="text-[34px] font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-[13px] text-[#8a8f98]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- features */}
      <section id="features" className="border-b border-white/[0.08] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-[#7170ff]">Platform</p>
            <h2 className="mt-2 text-[36px] font-semibold leading-tight tracking-[-0.02em]">
              One control plane, from commit to runtime
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-[#8a8f98]">
              Most tools tell you what is wrong. Bastion tells you what to do
              about it, in the order that reduces risk fastest.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group bg-[#08090a] p-7 transition-colors duration-150 hover:bg-[#0d0e10]"
              >
                <Icon className="h-5 w-5 text-[#7170ff]" />
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#8a8f98]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ compliance */}
      <section className="border-b border-white/[0.08] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <BadgeCheck className="mx-auto h-6 w-6 text-[#7170ff]" />
          <h2 className="mt-4 text-[28px] font-semibold tracking-tight">
            Audited, certified, and happy to prove it
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[#8a8f98]">
            Every certification below is current and independently assessed.
            Request the reports and we will send them the same day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {COMPLIANCE.map((cert) => (
              <span
                key={cert}
                className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-[#b4bcc9]"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- testimonials */}
      <section className="border-b border-white/[0.08] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-xl text-[32px] font-semibold leading-tight tracking-[-0.02em]">
            What security leaders say once they have switched
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
              >
                <blockquote className="text-[15px] leading-relaxed text-[#d0d6e0]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-white/[0.08] pt-4">
                  <p className="text-[14px] font-medium">{t.name}</p>
                  <p className="mt-0.5 text-[13px] text-[#8a8f98]">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section id="cta" className="relative overflow-hidden border-b border-white/[0.08]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 120% at 50% 100%, rgba(113,112,255,0.18) 0%, transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-6 py-24 text-center">
          <h2 className="text-[38px] font-semibold leading-tight tracking-[-0.02em]">
            See it against your own cloud
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[#8a8f98]">
            Thirty minutes, your environment, real findings. No slideware — we
            connect a read-only role and show you what is actually there.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@company.com"
              aria-label="Work email"
              className="flex-1 rounded-[7px] border border-white/[0.12] bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-[#f7f8f8] placeholder:text-[#6b7280] focus:border-[#7170ff] focus:outline-none focus:ring-2 focus:ring-[#7170ff]/25"
            />
            <button
              type="submit"
              className="rounded-[7px] bg-[#7170ff] px-5 py-2.5 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#8281ff]"
            >
              Book a demo
            </button>
          </form>
          <p className="mt-3 text-[12px] text-[#6b7280]">
            Typically a 30-minute call · No credit card
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="flex items-center gap-2 text-[14px] font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#7170ff]" />
            Bastion
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["Security", "Privacy", "Terms", "Status", "Contact"].map((l) => (
              <a
                key={l}
                href="#cta"
                className="text-[13px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]"
              >
                {l}
              </a>
            ))}
          </nav>
          <Link
            href="/"
            className="text-[12px] text-[#4b5563] transition-colors hover:text-[#8a8f98]"
          >
            ← Back to IsleHelp
          </Link>
        </div>
      </footer>
    </div>
  );
}
