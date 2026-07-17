import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import HallOfFameGrid from "./hall-of-fame-grid";

// TODO: byt ut mot era riktiga Hall of Fame-bilder + info
const entries = [    
  {
    id: "1",
    imageSrc: "/KrökenKrew-HOF/2526.jpg",
    caption: "KrökenKrew 25/26",
    verksamhetsberattelse: "Sista året med helige Gränges på Kårallen. Under vintern 2025 skedde det otänktbara, Gränges slutades servera på Kårallen. Ekonomiska problem hos Kårservice fick dem att byta till ett billigare alternativ, Åbro. Alla som är glutenintoleranta sjunger dock av glädje då nya ölen, Arton56, är glutenfri.\n\nBjörn den trubbige (Eventansvarig på Kårservice) gjorde sin debut och öppnade upp DC, och som konsekvens oss DAs. Ökade priser, kastade DC under bussen och egna privata möten med festerier för att nämna några. Festivalla & UK flyttade till Stångåfältet pågrund av ökade priser på Kårallen. \n\nVi blev äntligen av med Eurest från matsalen och matsalen är nu vår! Det betyder att luftbytet kanske får en helt ny meta. Framtida häng för DAs kan också bli riktigt jälva mäktiga, tagga luftbytet. \n\nÅret var generellt riktigt lent, med bra människor och maxade efterhäng hos Farmor.",
    stats: [
      { label: "Torsdagskröken", value: "18" },
      { label: "Onsdagsbubbel", value: "8" },
      { label: "Brandlarm", value: "0" },
      { label: "Piplista", value: "27" },
      { label: "Antal besök till sjukstugan", value: "∞" },
    ],
    images: [],
  },
  {
    id: "2",
    imageSrc: "",
    caption: "KrökenKrew 24/25",
    verksamhetsberattelse: "Brandlarm = 0",
       stats: [
      { label: "Krökar", value: "18" },
      { label: "Brandlarm", value: "0" },
      { label: "Efterhäng", value: "27" },
      { label: "Nya DAs", value: "2" },
    ],
    images: [],
  },
  {
    id: "3",
    imageSrc: "",
    caption: "KrökenKrew 23/24",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
  },
  {
    id: "4",
    imageSrc: "",
    caption: "KrökenKrew 22/23",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
  },
  {
    id: "5",
    imageSrc: "",
    caption: "KrökenKrew 21/22",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
  },
  {
    id: "6",
    imageSrc: "",
    caption: "KrökenKrew 20/21",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
  },
  {
    id: "7",
    imageSrc: "",
    caption: "KrökenKrew 19/20",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
  },
  {
    id: "8",
    imageSrc: "",
    caption: "KrökenKrew 18/19",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
  },
  {
    id: "9",
    imageSrc: "",
    caption: "KrökenKrew 17/18",
    verksamhetsberattelse: "Här kan ni skriva verksamhetsberättelsen för denna säsong.",
    stats: [
      { label: "Krökar", value: "-" },
      { label: "Brandlarm", value: "-" },
      { label: "Efterhäng", value: "-" },
      { label: "Nya DAs", value: "-" },
    ],
    images: [],
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
      <h1 className="font-heading tracking-wide text-4xl text-neutral-100">Hall of Fame</h1>
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