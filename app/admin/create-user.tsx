"use client";

import { useRef, useState, useTransition } from "react";
import { createUserAction } from "./actions";

export default function CreateUserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<
    { type: "error" | "success"; text: string } | null
  >(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await createUserAction(formData);
      if ("error" in result) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Användaren skapades." });
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-xs font-medium text-neutral-400 mb-1.5"
        >
          Användarnamn
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2.5 text-white outline-none focus:border-[#0604bd] focus:ring-1 focus:ring-[#0604bd]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-neutral-400 mb-1.5"
        >
          Tillfälligt lösenord
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2.5 text-white outline-none focus:border-[#0604bd] focus:ring-1 focus:ring-[#0604bd]"
        />
      </div>

      {message && (
        <p
          className={
            message.type === "error"
              ? "rounded-lg bg-red-500/10 py-2 text-center text-sm text-red-400"
              : "rounded-lg bg-green-500/10 py-2 text-center text-sm text-green-400"
          }
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-[#0604bd] py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Skapar..." : "Skapa användare"}
      </button>
    </form>
  );
}