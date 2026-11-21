import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import useApplications from "../hooks/useApplications.js";
import { daysUntil, deadlineLabel, formatDate } from "../utils/dates.js";
import { STATUSES } from "../utils/constants.js";

const BAR_COLORS = {
  Saved: "bg-slate-400",
  Applied: "bg-blue-500",
  Interview: "bg-amber-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-rose-500",
};

function Panel({ title, action, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const { applications, loading, error } = useApplications();
  const navigate = useNavigate();

  const count = (status) => applications.filter((a) => a.status === status).length;
  const total = applications.length;
  const active = applications.filter((a) => ["Saved", "Applied", "Interview"].includes(a.status)).length;

  const upcomingDeadlines = applications
    .filter((a) => ["Saved", "Applied"].includes(a.status) && a.deadline && daysUntil(a.deadline) >= 0)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const upcomingInterviews = applications
    .filter((a) => a.interviewDate && daysUntil(a.interviewDate) >= 0 && a.status !== "Rejected")
    .sort((a, b) => (a.interviewDate + (a.interviewTime || "")).localeCompare(b.interviewDate + (b.interviewTime || "")))
    .slice(0, 5);

  const recent = applications.slice(0, 5);

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Your job search at a glance.</p>
        </div>
        <button
          onClick={() => navigate("/applications", { state: { openForm: true } })}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add application
        </button>
      </div>

      {error && <p className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Loading your applications…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <StatCard label="Total" value={total} />
            <StatCard label="Active" value={active} accent="bg-indigo-50 text-indigo-700" />
            <StatCard label="Interviews" value={count("Interview")} accent="bg-amber-50 text-amber-700" />
            <StatCard label="Offers" value={count("Offer")} accent="bg-emerald-50 text-emerald-700" />
            <StatCard label="Rejections" value={count("Rejected")} accent="bg-rose-50 text-rose-700" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Application progress">
              {total === 0 ? (
                <p className="text-sm text-slate-500">Add your first application to see progress.</p>
              ) : (
                <ul className="space-y-3">
                  {STATUSES.map((s) => (
                    <li key={s}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{s}</span>
                        <span className="text-slate-500">{count(s)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full ${BAR_COLORS[s]}`}
                          style={{ width: `${(count(s) / total) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Upcoming deadlines">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming deadlines.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {upcomingDeadlines.map((a) => {
                    const label = deadlineLabel(a.deadline);
                    return (
                      <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{a.position}</p>
                          <p className="truncate text-slate-500">{a.company}</p>
                        </div>
                        <div className="text-right">
                          <p>{formatDate(a.deadline)}</p>
                          <p className={`text-xs ${label.tone}`}>{label.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Upcoming interviews">
              {upcomingInterviews.length === 0 ? (
                <p className="text-sm text-slate-500">No interviews scheduled.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {upcomingInterviews.map((a) => (
                    <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{a.position}</p>
                        <p className="truncate text-slate-500">{a.company}</p>
                      </div>
                      <div className="text-right">
                        <p>{formatDate(a.interviewDate)}</p>
                        <p className="text-xs text-slate-500">{a.interviewTime || "Time TBC"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Recent applications"
              action={
                <Link to="/applications" className="text-sm font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              }
            >
              {recent.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing here yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recent.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{a.position}</p>
                        <p className="truncate text-slate-500">{a.company}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      )}
    </Layout>
  );
}