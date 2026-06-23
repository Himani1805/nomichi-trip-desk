"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/utils/supabaseBrowser";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await Promise.race([
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        new Promise((resolve) => {
          setTimeout(() => resolve({ error: new Error("Authentication timed out") }), 10000);
        }),
      ]);

      if (signInError) {
        setError("Invalid email or password.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Could not reach authentication. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#FFFBF5] px-6 py-12 font-poppins text-[#1C1B1A]">
      
      <div className="absolute top-8 left-6 sm:left-10 lg:left-12">
        <Link 
          href="/" 
          className="text-xs font-medium uppercase tracking-[0.15em] text-[#1C1B1A]/50 transition-colors hover:text-[#1C1B1A]"
        >
          &larr; Back to Public Desk
        </Link>
      </div>

      <div className="w-full max-w-[460px] rounded-[36px] bg-[#F4EFE6] p-10 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1 text-3xl font-light tracking-[0.2em] text-[#1C1B1A]">
            <span>NOMICHI</span>
            <span className="mt-1 h-2 w-2 rounded-full bg-[#D55D27]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D55D27]">
            Nomichi Trip Desk
          </p>
          <h2 className="mt-1 text-sm font-light text-[#1C1B1A]/50">
            Please sign in to manage traveller enquiries
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-[#1C1B1A]/20 bg-[#FFFBF5] p-3 text-xs font-medium text-[#1C1B1A] text-center">
              {error}
            </div>
          )}

          <div>
            <label 
              htmlFor="admin-email" 
              className="block text-[10px] font-bold tracking-[0.12em] uppercase text-[#1C1B1A]/50 mb-2"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#FFFBF5] px-4 py-3.5 text-sm font-light text-[#1C1B1A] outline-none transition-all focus:ring-1 focus:ring-[#D55D27]/10"
              placeholder="name@nomichi.com"
              autoComplete="email"
              disabled={submitting}
              required
            />
          </div>

          <div>
            <label 
              htmlFor="admin-password" 
              className="block text-[10px] font-bold tracking-[0.12em] uppercase text-[#1C1B1A]/50 mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#FFFBF5] px-4 py-3.5 text-sm font-light text-[#1C1B1A] outline-none transition-all focus:ring-1 focus:ring-[#D55D27]/10"
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={submitting}
              required
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#D55D27] py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFFBF5] transition-colors hover:bg-[#1C1B1A] disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Access Dashboard"}
            </button>
          </div>
        </form>


        <div className="mt-8 text-center">
          <p className="text-[10px] tracking-wide text-[#1C1B1A]/30 font-light">
            Authorized access only. All activities are securely logged.
          </p>
        </div>

      </div>
    </main>
  );
}
