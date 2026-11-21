import StatusBadge from "./StatusBadge.jsx";
import { STATUSES } from "../utils/constants.js";
import { deadlineLabel, formatDate } from "../utils/dates.js";

export default function ApplicationCard({ application, onEdit, onDelete, onStatusChange }) {
  const a = application;
  const deadline = a.status === "Saved" || a.status === "Applied" ? deadlineLabel(a.deadline) : null;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">{a.position}</h3>
          <p className="truncate text-sm text-slate-600">
            {a.company}
            {a.location ? ` · ${a.location}` : ""}
          </p>
        </div>
        <StatusBadge status={a.status} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Type</dt>
          <dd>{a.type || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Applied</dt>
          <dd>{formatDate(a.dateApplied)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Deadline</dt>
          <dd>
            {formatDate(a.deadline)}
            {deadline && <span className={`ml-1 text-xs ${deadline.tone}`}>({deadline.text})</span>}
          </dd>
        </div>
        {a.interviewDate && (
          <div>
            <dt className="text-xs text-slate-400">Interview</dt>
            <dd>
              {formatDate(a.interviewDate)}
              {a.interviewTime ? ` at ${a.interviewTime}` : ""}
            </dd>
          </div>
        )}
      </dl>

      {a.interviewDetails && (
        <p className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">{a.interviewDetails}</p>
      )}
      {a.notes && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{a.notes}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <label className="sr-only" htmlFor={`status-${a.id}`}>
          Change status
        </label>
        <select
          id={`status-${a.id}`}
          value={a.status}
          onChange={(e) => onStatusChange(a, e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {a.jobLink && (
          <a
            href={a.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Job link
          </a>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => onEdit(a)}
            className="rounded-md px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(a)}
            className="rounded-md px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}