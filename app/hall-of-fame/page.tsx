import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import HallOfFameGrid from "./hall-of-fame-grid";

// TODO: byt ut mot era riktiga Hall of Fame-bilder + info
const entries = [
  {
    id: "1",
    imageSrc: "",
    caption: "Torsdagskröken 25/26",
    moreInfo: "Här kan ni skriva mer om vad som hände denna kväll.",
  },
  {
    id: "2",
    imageSrc: "",
    caption: "Torsdagskröken 24/25",
    moreInfo: "Här kan ni skriva mer om vad som hände denna kväll.",
  },
  {
    id: "3",
    imageSrc: "",
    caption: "Torsdagskröken 23/24",
    moreInfo: "Här kan ni skriva mer om vad som hände denna kväll.",
  },
];

async function HallOfFameContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HallOfFameGrid entries={entries} isLoggedIn={!!user} />;
}

export default function Page() {
  return (
    <main className="flex-1 flex flex-col items-center gap-12 px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-neutral-100">Hall of Fame</h1>
      <Suspense
        fallback={
          <div className="grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="aspect-square w-full animate-pulse rounded-xl bg-neutral-800"
              />
            ))}
          </div>
        }
      >
        <HallOfFameContent />
      </Suspense>
    </main>
  );
}