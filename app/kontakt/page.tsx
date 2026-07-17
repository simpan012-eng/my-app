export default function Page() {
  return (
    <main className="flex-1 flex flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-neutral-100">Kontakta oss</h1>
      <p className="max-w-md text-neutral-400">
        Har du frågor eller vill komma i kontakt med KrökenKrew? Hör av dig!
      </p>

      {/* TODO: fyll i era riktiga kontaktuppgifter */}
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 text-left">
        <div>
          <p className="text-xs font-medium text-neutral-500">E-post</p>
          <p className="text-neutral-200">kontakt@krokenkrew.se</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Telefon</p>
          <p className="text-neutral-200">070-000 00 00</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Adress</p>
          <p className="text-neutral-200">Gatan 1, 123 45 Ort</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">
            Sociala medier
          </p>
          <p className="text-neutral-200">@krokenkrew</p>
        </div>
      </div>
    </main>
  );
}