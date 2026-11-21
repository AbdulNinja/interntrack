export default function StatCard({ label, value, accent = "bg-slate-100 text-slate-700" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${accent}`}>
        {label}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}