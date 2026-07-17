"use client";

import { useState } from "react";

type Entry = {
  id: string;
  imageSrc: string;
  caption: string;
  moreInfo: string;
};

export default function HallOfFameGrid({
  entries,
  isLoggedIn,
}: {
  entries: Entry[];
  isLoggedIn: boolean;
}) {
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);

  return (
    <>
      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40"
          >
            {entry.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.imageSrc}
                alt={entry.caption}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-neutral-800 text-sm text-neutral-500">
                Ingen bild ännu
              </div>
            )}

            {isLoggedIn && (
              <button
                onClick={() => setActiveEntry(entry)}
                className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
              >
                Visa mer
              </button>
            )}

            <p className="px-3 py-2 text-sm text-neutral-300">
              {entry.caption}
            </p>
          </div>
        ))}
      </div>

      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold text-white">
                {activeEntry.caption}
              </h3>
              <button
                onClick={() => setActiveEntry(null)}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-neutral-400">{activeEntry.moreInfo}</p>
          </div>
        </div>
      )}
    </>
  );
}