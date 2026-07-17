"use client";

import { useState, useTransition } from "react";
import { deleteUserAction } from "./actions";

type UserRow = {
  id: string;
  username: string;
  is_admin: boolean;
};

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

  function handleDelete(id: string, username: string) {
    setError(null);
    const confirmed = window.confirm(
      `Ta bort användaren "${username}"? Detta går inte att ångra.`
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
          <li
            key={u.id}
            className="flex items-center justify-between px-4 py-3"
          >
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

            {u.id !== currentUserId && (
              <button
                onClick={() => handleDelete(u.id, u.username)}
                disabled={isPending && pendingId === u.id}
                className="rounded-md px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
              >
                {isPending && pendingId === u.id ? "Tar bort..." : "Ta bort"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}