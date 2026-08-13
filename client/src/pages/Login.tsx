import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_EMAIL, DEMO_PASSWORD, startDemoSession } from "@/auth/demo";
import { startLogin } from "@/const";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);

  const enterDemo = () => {
    if (!email || !password) return;
    startDemoSession();
    navigate("/");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06111d] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 px-12 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.16),transparent_32%),radial-gradient(circle_at_80%_75%,rgba(99,102,241,.12),transparent_28%)]" />
          <div className="relative">
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-[#06111d] shadow-[0_0_36px_rgba(103,232,249,.25)]"><ShieldCheck size={23} /></div><div><p className="text-sm font-semibold tracking-[.24em] text-cyan-200">NITCRES</p><p className="text-xs text-slate-500">National tax intelligence</p></div></div>
            <div className="mt-28 max-w-xl"><Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Sparkles size={13} className="mr-2" />Controlled intelligence workspace</Badge><h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-[-.04em] text-white">A clearer signal across the national tax universe.</h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-400">A secure command centre for explainable risk, audit operations, revenue analytics, and policy intelligence.</p></div>
          </div>
          <div className="relative grid gap-4 sm:grid-cols-3"><div><p className="text-2xl font-semibold text-white">10</p><p className="mt-1 text-xs text-slate-500">intelligence modules</p></div><div><p className="text-2xl font-semibold text-white">0–100</p><p className="mt-1 text-xs text-slate-500">bounded risk scale</p></div><div><p className="text-2xl font-semibold text-white">Human</p><p className="mt-1 text-xs text-slate-500">review required</p></div></div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-[#06111d]"><ShieldCheck size={21} /></div><div><p className="text-sm font-semibold tracking-[.22em] text-cyan-200">NITCRES</p><p className="text-xs text-slate-500">National tax intelligence</p></div></div>
            <div className="mb-8"><p className="text-sm text-cyan-200">Welcome back</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.03em] text-white">Sign in to the command centre</h2><p className="mt-3 text-sm leading-6 text-slate-400">Use secure institutional sign-in for protected workflows, or enter the pre-filled demo access to explore synthetic data.</p></div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300"><LockKeyhole size={14} className="text-cyan-300" /> Demo access · synthetic environment</div>
              <label className="mt-5 block text-xs text-slate-500">Demo email<input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#081725] px-3 text-sm text-white outline-none transition focus:border-cyan-300/50" autoComplete="username" /></label>
              <label className="mt-4 block text-xs text-slate-500">Demo password<div className="relative mt-2"><input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="h-11 w-full rounded-xl border border-white/10 bg-[#081725] px-11 pr-12 text-sm text-white outline-none transition focus:border-cyan-300/50" autoComplete="current-password" aria-describedby="demo-password-help" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide demo password" : "Show demo password"} aria-pressed={showPassword} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
              <Button onClick={enterDemo} className="mt-5 h-11 w-full rounded-xl bg-cyan-300 font-semibold text-[#06111d] hover:bg-cyan-200">Enter demo workspace <ArrowRight size={16} className="ml-2" /></Button>
              <p id="demo-password-help" className="mt-3 text-center text-[11px] leading-5 text-slate-600">Demo access previews synthetic records only. It does not create an authenticated institutional session or authorize protected actions.</p>
            </div>

            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[.2em] text-slate-600"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div>
            <Button onClick={() => startLogin()} variant="outline" className="h-11 w-full rounded-xl border-white/15 bg-transparent text-sm text-slate-200 hover:bg-white/[0.05]">Continue with secure institutional sign-in</Button>
            <div className="mt-7 space-y-3 text-xs text-slate-500"><p className="flex gap-2"><CheckCircle2 size={14} className="shrink-0 text-emerald-300" /> Every intelligence signal remains subject to human review.</p><p className="flex gap-2"><CheckCircle2 size={14} className="shrink-0 text-emerald-300" /> All preview records are synthetic and clearly marked.</p></div>
            <p className="mt-8 text-center text-xs text-slate-600"><Link href="/" className="text-cyan-300 hover:text-cyan-200">Return to public preview</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
