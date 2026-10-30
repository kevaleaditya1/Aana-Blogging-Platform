export default function Loading() {
 return <div role="status" aria-live="polite" className="mx-auto w-full max-w-5xl px-4 py-16">
  <p className="mb-6">Loading content…</p>
  <div aria-hidden="true" className="space-y-4 animate-pulse"><div className="h-10 max-w-lg rounded-xl bg-muted" /><div className="h-40 rounded-2xl bg-muted" /></div>
 </div>;
}
