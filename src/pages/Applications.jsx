import { useEffect, useState } from "react";
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

export default function Applications() {
  const { user } = useAuth();
  const { applications, loading, error } = useApplications();
  const location = useLocation();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(null); // null | {} (new) | application
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  // Dashboard "Add application" button opens the form straight away
  useEffect(() => {
    if (location.state?.openForm) {
      setEditing({});
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

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

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500">{applications.length} total</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add application
        </button>
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
          applications={applications}
          onEdit={setEditing}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          emptyMessage="No applications yet. Click “Add application” to get started."
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