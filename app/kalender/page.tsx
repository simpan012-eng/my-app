export default function Page() {
  return (
    <main className="flex-1 flex flex-col items-center gap-8 px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-neutral-100">Schedule</h1>

      {/* TODO: byt ut src mot er egen Google Calendar-embed-länk (se instruktion i chatten) */}
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-800">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=REPLACE_WITH_YOUR_CALENDAR_ID&ctz=Europe%2FStockholm"
          style={{ border: 0 }}
          width="100%"
          height="600"
          title="KrökenKrew Schedule"
        />
      </div>
    </main>
  );
}