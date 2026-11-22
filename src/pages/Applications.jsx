import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Modal from "../components/Modal.jsx";
import ApplicationForm from "../components/ApplicationForm.jsx";
import ApplicationList from "../components/ApplicationList.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useApplications from "../hooks/useApplications.js";
import {
  createApplication,
  deleteApplication,
  updateApplication,
} from "../services/applications.js";
import { STATUSES, TYPES } from "../utils/constants.js";
import { filterApplications } from "../utils/filters.js";


const selectClass = "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

export default function Applications() {
  const { user } = useAuth();
  const { applications, loading, error } = useApplications();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [editing, setEditing] = useState(null); // null | {} (new) | application
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

 
  useEffect(() => {
    if (location.state?.openForm) {
      setEditing({});
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const filtered = useMemo(
  () => filterApplications(applications, { search, status: statusFilter, type: typeFilter }),
  [applications, search, statusFilter, typeFilter]
);

  async function handleSubmit(values) {
    setSaving(true);
    setActionError("");
    try {
      if (editing?.id) await updateApplication(user.uid, editing.id, values);
      else await createApplication(user.uid, values);
      setEditing(null);
    } catch (err) {
      setActionError(err.message || "Could not save the application.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(app) {
    if (!window.confirm(`Delete "${app.position}" at ${app.company}?`)) return;
    try {
      await deleteApplication(user.uid, app.id);
    } catch (err) {
      setActionError(err.message || "Could not delete the application.");
    }
  }

  async function handleStatusChange(app, status) {
    try {
      await updateApplication(user.uid, app.id, { status });
    } catch (err) {
      setActionError(err.message || "Could not update the status.");
    }
  }

  const hasFilters = search || statusFilter !== "All" || typeFilter !== "All";

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {applications.length} shown
          </p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add application
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="search">Search applications</label>
        <input
          id="search"
          type="search"
          placeholder="Search by company or job title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:max-w-sm"
        />
        <label className="sr-only" htmlFor="statusFilter">Filter by status</label>
        <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="typeFilter">Filter by type</label>
        <select id="typeFilter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
          <option value="All">All types</option>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {(error || actionError) && (
        <p className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700" role="alert">
          {error || actionError}
        </p>
      )}

      {loading ? (
        <p className="text-slate-500">Loading your applications…</p>
      ) : (
        <ApplicationList
          applications={filtered}
          onEdit={setEditing}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          emptyMessage={
            hasFilters
              ? "No applications match your search or filters."
              : "No applications yet. Click “Add application” to get started."
          }
        />
      )}

      {editing && (
        <Modal title={editing.id ? "Edit application" : "Add application"} onClose={() => setEditing(null)}>
          <ApplicationForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </Modal>
      )}
    </Layout>
  );
}