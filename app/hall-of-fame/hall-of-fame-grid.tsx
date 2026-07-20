"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadHallOfFameImage, deleteHallOfFameImage } from "./actions";
import { MAX_IMAGES_PER_ENTRY } from "./constants";

type HallOfFameImage = {
  id: string;
  url: string;
  createdBy: string | null;
};
 
type Entry = {
  id: string;
  imageSrc: string;
  caption: string;
  verksamhetsberattelse: string;
  stats: {
    label: string;
    value: string;
  }[];
  images: HallOfFameImage[]; // extra bilder till "Bilder"-fliken
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
  currentUserId,
  isAdmin,
}: {
  entries: Entry[];
  isLoggedIn: boolean;
  currentUserId: string | null;
  isAdmin: boolean;
}) {
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("verksamhetsberattelse");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const router = useRouter();

  // Håll activeEntry uppdaterad när entries hämtas om (t.ex. efter en uppladdning)
  useEffect(() => {
    if (activeEntry) {
      const updated = entries.find((e) => e.id === activeEntry.id);
      if (updated) setActiveEntry(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const openEntry = (entry: Entry) => {
    setActiveEntry(entry);
    setActiveTab("verksamhetsberattelse");
    setUploadError(null);
  };

  const closeEntry = () => setActiveEntry(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB, samma gräns som i actions.ts

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeEntry) return;

    setUploadError(null);

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Bilden är för stor (max 5 MB). Välj en mindre bild.");
      e.target.value = "";
      return;
    }

    if (activeEntry.images.length >= MAX_IMAGES_PER_ENTRY) {
      setUploadError(
        `Max ${MAX_IMAGES_PER_ENTRY} bilder är uppnått för den här årgången.`
      );
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("entryId", activeEntry.id);

    startUploadTransition(async () => {
      const result = await uploadHallOfFameImage(formData);
      if (result?.error) {
        setUploadError(result.error);
      } else {
        router.refresh();
      }
      e.target.value = "";
    });
  };

  const handleDelete = (imageId: string) => {
    setUploadError(null);
    setDeletingId(imageId);
    startDeleteTransition(async () => {
      const result = await deleteHallOfFameImage(imageId);
      if (result?.error) {
        setUploadError(result.error);
      } else {
        router.refresh();
      }
      setDeletingId(null);
    });
  };

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
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    {activeEntry.images.length > 0 ? (
                      activeEntry.images.map((img) => {
                        const canDelete =
                          isAdmin || img.createdBy === currentUserId;
                        return (
                          <div key={img.id} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt=""
                              className="aspect-square w-full rounded-lg object-cover"
                            />
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(img.id)}
                                disabled={deletingId === img.id}
                                aria-label="Radera bild"
                                className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white backdrop-blur transition-colors hover:bg-red-600 disabled:opacity-50"
                              >
                                {deletingId === img.id ? "..." : "✕"}
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="col-span-2 text-sm text-neutral-500">
                        Inga bilder ännu.
                      </p>
                    )}
                  </div>

                  {isLoggedIn && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-neutral-500">
                        {activeEntry.images.length}/{MAX_IMAGES_PER_ENTRY} bilder
                      </p>
                      {activeEntry.images.length < MAX_IMAGES_PER_ENTRY ? (
                        <label className="inline-block cursor-pointer rounded-lg border border-dashed border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white">
                          {isUploading ? "Laddar upp..." : "+ Ladda upp bild"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                        </label>
                      ) : (
                        <p className="text-sm text-neutral-500">
                          Max antal bilder uppnått för den här årgången.
                        </p>
                      )}
                      {uploadError && (
                        <p className="mt-2 text-sm text-red-400">{uploadError}</p>
                      )}
                    </div>
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