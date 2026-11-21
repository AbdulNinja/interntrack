import ApplicationCard from "./ApplicationCard.jsx";

export default function ApplicationList({ applications, onEdit, onDelete, onStatusChange, emptyMessage }) {
  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        {emptyMessage || "No applications yet."}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((a) => (
        <ApplicationCard
          key={a.id}
          application={a}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}