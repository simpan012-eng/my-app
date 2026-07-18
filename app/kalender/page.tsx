export default function Page() {
  return (
    <main className="flex-1 flex flex-col items-center gap-8 px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-neutral-100">Torsdagskröken Kalender</h1>
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-800">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=3004aace1e569aa2f31d286bef5afd2781589c44d9165c594a2cc29485297889%40group.calendar.google.com&ctz=Europe%2FStockholm"
          style={{ border: 0 }}
          width="100%"
          height="600"
          title="KrökenKrew Kalender"
        />
      </div>
    </main>
  );
}
