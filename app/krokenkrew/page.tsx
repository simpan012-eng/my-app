type Member = {
  name: string;
  imageSrc?: string; // lämna tom för platshållare med initialer
};

// TODO: byt ut mot era 10 riktiga medlemmar + riktiga bilder i /public
const members: Member[] = [
  { name: "Medlem 1" },
  { name: "Medlem 2" },
  { name: "Medlem 3" },
  { name: "Medlem 4" },
  { name: "Medlem 5" },
  { name: "Medlem 6" },
  { name: "Medlem 7" },
  { name: "Medlem 8" },
  { name: "Medlem 9" },
  { name: "Medlem 10" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Page() {
  return (
    <main className="flex-1 flex flex-col items-center gap-20 px-4 py-20 text-center">
      <div className="w-full max-w-2xl">
        <h1 className="mb-10 text-4xl font-bold text-neutral-100">
          KrökenKrew
        </h1>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-3"
            >
              {member.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.imageSrc}
                  alt={member.name}
                  className="h-32 w-32 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-2xl font-semibold text-neutral-400">
                  {initials(member.name)}
                </div>
              )}
              <span className="font-medium text-neutral-200">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl space-y-4">
        <h2 className="text-2xl font-bold text-neutral-100">Vilka vi är</h2>
        {/* TODO: ersätt med er riktiga beskrivning */}
        <p className="text-neutral-400">
          KrökenKrew är en grupp vänner som samlas varje torsdag för
          Torsdagskröken. Här kan ni beskriva vilka ni är, vad ni gör, och
          vad KrökenKrew står för.
        </p>
      </div>
    </main>
  );
}