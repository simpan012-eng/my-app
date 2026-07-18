import Image from "next/image";

export default function Page() {
  return (
    <main className="flex-1 flex flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-neutral-100">Kontakta oss</h1>
      <p className="max-w-md text-neutral-400">
        Har du frågor eller vill hålla en samarbetspub med oss?
        <br />
        Kontakta oss på någon av våra kanaler!
      </p>

      {/* TODO: fyll i era riktiga kontaktuppgifter */}
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 text-left">
        <div>
          <p className="text-xs font-medium text-neutral-500">E-post</p>
          <p className="text-neutral-200">krokenansvarig@gmail.com</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Adress</p>
          <p className="text-neutral-200">Kårallen (Campus Valla), Linköping</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Sociala medier</p>
          <a
            href="https://www.instagram.com/torsdagskroken"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-200 underline underline-offset-4 hover:text-white"
          >
            <Image
              src="/instagram-icon.png"
              alt="KrökenKrew på Instagram"
              width={26}
              height={26}
            />
          </a>
          <a
            href="https://www.facebook.com/torsdagskroken"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-200 underline underline-offset-4 hover:text-white"
          >
            <Image
              src="/facebook-icon.png"
              alt="KrökenKrew på Facebook"
              width={26}
              height={26}
            />
          </a>
        </div>
      </div>
    </main>
  );
}
