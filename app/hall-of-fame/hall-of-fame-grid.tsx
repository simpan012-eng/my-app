"use client";

import { useState } from "react";

type Entry = {
  id: string;
  imageSrc: string;
  caption: string;
  verksamhetsberattelse: string;
  stats: {
    label: string;
    value: string;
  }[];
  images: string[]; // extra bilder till "Bilder"-fliken
};

const TABS = [
  { key: "verksamhetsberattelse", label: "Verksamhetsåret" },
  { key: "stats", label: "Statistik" },
  { key: "bilder", label: "Bilder" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function HallOfFameGrid({
  entries,
  isLoggedIn,
}: {
  entries: Entry[];
  isLoggedIn: boolean;
}) {
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("verksamhetsberattelse");

  const openEntry = (entry: Entry) => {
    setActiveEntry(entry);
    setActiveTab("verksamhetsberattelse");
  };

  const closeEntry = () => setActiveEntry(null);

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
                onClick={() => openEntry(entry)}
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
          onClick={closeEntry}
        >
          <div
            className="flex w-full max-w-4xl flex-col-reverse overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 sm:h-[80vh] sm:max-h-[900px] sm:flex-row-reverse"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Innehåll */}
            <div className="flex-1 overflow-y-auto p-6 text-left">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="font-heading text-lg tracking-wide text-white">
                  {activeEntry.caption}
                </h3>
                <button
                  onClick={closeEntry}
                  className="text-neutral-500 hover:text-white sm:hidden"
                >
                  ✕
                </button>
              </div>

              {activeTab === "verksamhetsberattelse" && (
                <p className="whitespace-pre-line text-sm text-neutral-400">
                  {activeEntry.verksamhetsberattelse ||
                    "Ingen verksamhetsberättelse ännu."}
                </p>
              )}

              {activeTab === "stats" && (
                <div className="grid grid-cols-2 gap-4">
                  {activeEntry.stats.length > 0 ? (
                    activeEntry.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4"
                      >
                        <p className="text-xs uppercase text-neutral-500">
                          {stat.label}
                        </p>

                        <p className="mt-1 text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">
                      Ingen statistik ännu.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "bilder" && (
                <div className="grid grid-cols-2 gap-3">
                  {activeEntry.images.length > 0 ? (
                    activeEntry.images.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">
                      Inga bilder ännu.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Flikmeny */}
            <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-neutral-800 bg-neutral-950/40 p-3 sm:w-50 sm:flex-col sm:items-stretch sm:justify-start sm:overflow-visible sm:border-b-0 sm:border-r sm:p-4">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 rounded-lg px-2 py-2 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-neutral-950"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={closeEntry}
                className="hidden shrink-0 rounded-lg px-2 py-2 text-left text-sm text-neutral-500 hover:text-white sm:mt-auto sm:block"
              >
                ✕ Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
