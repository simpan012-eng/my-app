"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    // 1. Slå upp email via en säker RPC-funktion (se SQL i chatten)
    const { data: email, error: rpcError } = await supabase.rpc(
      "get_email_for_username",
      { input_username: username }
    );

    if (rpcError || !email) {
      setErrorMsg("Fel användarnamn eller lösenord");
      setIsLoading(false);
      return;
    }

    // 2. Logga in med email + password
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setErrorMsg("Fel användarnamn eller lösenord");
      setIsLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-10 shadow-2xl shadow-black/40 backdrop-blur">
        <h1 className="text-3xl font-bold text-white mb-1">Logga in</h1>
        <p className="text-sm text-neutral-400 mb-8">
          Ange dina uppgifter för att fortsätta
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-neutral-400 mb-1.5"
            >
              Användarnamn
            </label>
            <input
              id="username"
              type="text"
              placeholder="ditt-användarnamn"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2.5 text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#0604bd] focus:ring-1 focus:ring-[#0604bd]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-neutral-400 mb-1.5"
            >
              Lösenord
            </label>
            <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-800/50 pr-2 transition-colors focus-within:border-[#0604bd] focus-within:ring-1 focus-within:ring-[#0604bd]">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-2.5 text-white placeholder:text-neutral-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:text-white"
              >
                {showPassword ? "Dölj" : "Visa"}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="rounded-lg bg-red-500/10 py-2 text-center text-sm text-red-400">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#0604bd] py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Loggar in..." : "Logga in"}
          </button>
          <div className="text-center text-xs text-neutral-500">
            <a href="/auth/forgot-password" className="hover:text-neutral-300">
              Glömt lösenord?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}