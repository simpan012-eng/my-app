"use client";

import { useState, useTransition } from "react";
import { deleteUserAction, resetPasswordAction } from "./actions";
import { MoreVertical } from "lucide-react";

type UserRow = {
  id: string;
  username: string;
  is_admin: boolean;
};

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => chars[n % chars.length]).join("");
}

export default function UserList({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [resetOpenId, setResetOpenId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, startResetTransition] = useTransition();
  const [resetMessage, setResetMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleDelete(id: string, username: string) {
    setError(null);
    const confirmed = window.confirm(
      `Ta bort användaren "${username}"? Detta går inte att ångra.`,
    );
    if (!confirmed) return;

    setPendingId(id);
    startTransition(async () => {
      const result = await deleteUserAction(id);
      if ("error" in result) {
        setError(result.error);
      }
      setPendingId(null);
    });
  }

  function openResetFor(id: string) {
    setResetOpenId(id);
    setNewPassword(generatePassword());
    setResetMessage(null);
    setCopied(false);
  }

  function closeReset() {
    setResetOpenId(null);
    setNewPassword("");
    setResetMessage(null);
    setCopied(false);
  }

  function handleResetSubmit(userId: string) {
    setResetMessage(null);
    startResetTransition(async () => {
      const result = await resetPasswordAction(userId, newPassword);
      if ("error" in result) {
        setResetMessage({ type: "error", text: result.error });
      } else {
        setResetMessage({
          type: "success",
          text: "Lösenordet är återställt. Skicka det nya lösenordet till personen.",
        });
      }
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard-API kan vara blockerad, inget att göra åt det — admin kan markera texten manuellt.
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-red-500/10 py-2 text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {users.length === 0 && (
        <p className="text-sm text-neutral-500">Inga användare ännu.</p>
      )}

      <ul className="divide-y divide-neutral-800 rounded-lg border border-neutral-800">
        {users.map((u) => (
          <li key={u.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white">{u.username}</span>
                {u.is_admin && (
                  <span className="rounded bg-[#0604bd]/20 px-1.5 py-0.5 text-xs text-[#7c9fd9]">
                    Admin
                  </span>
                )}
                {u.id === currentUserId && (
                  <span className="text-xs text-neutral-500">(du)</span>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === u.id ? null : u.id)
                  }
                  className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <MoreVertical size={18} />
                </button>

                {menuOpenId === u.id && (
                  <div className="absolute right-0 mt-1 w-48 rounded-lg border border-neutral-800 bg-neutral-900 shadow-lg z-10">
                    <button
                      onClick={() => {
                        setMenuOpenId(null);
                        resetOpenId === u.id
                          ? closeReset()
                          : openResetFor(u.id);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-800"
                    >
                      {resetOpenId === u.id
                        ? "Avbryt återställning"
                        : "Återställ lösenord"}
                    </button>

                    {u.id !== currentUserId && (
                      <button
                        onClick={() => {
                          setMenuOpenId(null);
                          handleDelete(u.id, u.username);
                        }}
                        disabled={isPending && pendingId === u.id}
                        className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                      >
                        {isPending && pendingId === u.id
                          ? "Tar bort..."
                          : "Ta bort"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {resetOpenId === u.id && (
              <div className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3">
                <label
                  htmlFor={`new-password-${u.id}`}
                  className="block text-xs font-medium text-neutral-400"
                >
                  Nytt lösenord för {u.username}
                </label>
                <div className="flex gap-2">
                  <input
                    id={`new-password-${u.id}`}
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white outline-none focus:border-[#0604bd] focus:ring-1 focus:ring-[#0604bd]"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPassword(generatePassword())}
                    className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition-colors hover:bg-neutral-800"
                  >
                    Slumpa
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition-colors hover:bg-neutral-800"
                  >
                    {copied ? "Kopierat!" : "Kopiera"}
                  </button>
                </div>

                {resetMessage && (
                  <p
                    className={
                      resetMessage.type === "error"
                        ? "rounded-lg bg-red-500/10 py-2 text-center text-xs text-red-400"
                        : "rounded-lg bg-green-500/10 py-2 text-center text-xs text-green-400"
                    }
                  >
                    {resetMessage.text}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleResetSubmit(u.id)}
                  disabled={isResetting || newPassword.length < 8}
                  className="w-full rounded-lg bg-[#0604bd] py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isResetting ? "Sparar..." : "Spara nytt lösenord"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
