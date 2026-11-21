import { useState } from "react";
import { EMPTY_APPLICATION, STATUSES, TYPES } from "../utils/constants.js";

function validate(values) {
  const errors = {};
  if (!values.company.trim()) errors.company = "Company name is required.";
  if (!values.position.trim()) errors.position = "Job title is required.";
  if (values.jobLink && !/^https?:\/\/.+/i.test(values.jobLink.trim())) {
    errors.jobLink = "Link must start with http:// or https://";
  }
  if (values.status === "Interview" && !values.interviewDate) {
    errors.interviewDate = "Add the interview date.";
  }
  return errors;
}

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function ApplicationForm({ initial, onSubmit, onCancel, saving }) {
  const [values, setValues] = useState({ ...EMPTY_APPLICATION, ...initial });
  const [errors, setErrors] = useState({});

  function set(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const { id, createdAt, updatedAt, ...clean } = values;
    onSubmit({
      ...clean,
      company: clean.company.trim(),
      position: clean.position.trim(),
      location: clean.location.trim(),
      jobLink: clean.jobLink.trim(),
      notes: clean.notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company *" id="company" error={errors.company}>
          <input id="company" name="company" value={values.company} onChange={set} className={inputClass} />
        </Field>
        <Field label="Job title *" id="position" error={errors.position}>
          <input id="position" name="position" value={values.position} onChange={set} className={inputClass} />
        </Field>
        <Field label="Location" id="location">
          <input id="location" name="location" value={values.location} onChange={set} className={inputClass} />
        </Field>
        <Field label="Application type" id="type">
          <select id="type" name="type" value={values.type} onChange={set} className={inputClass}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Status" id="status">
          <select id="status" name="status" value={values.status} onChange={set} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Date applied" id="dateApplied">
          <input id="dateApplied" name="dateApplied" type="date" value={values.dateApplied} onChange={set} className={inputClass} />
        </Field>
        <Field label="Deadline" id="deadline">
          <input id="deadline" name="deadline" type="date" value={values.deadline} onChange={set} className={inputClass} />
        </Field>
        <Field label="Job link" id="jobLink" error={errors.jobLink}>
          <input id="jobLink" name="jobLink" type="url" placeholder="https://" value={values.jobLink} onChange={set} className={inputClass} />
        </Field>
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-medium text-slate-700">Interview (optional)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Interview date" id="interviewDate" error={errors.interviewDate}>
            <input id="interviewDate" name="interviewDate" type="date" value={values.interviewDate} onChange={set} className={inputClass} />
          </Field>
          <Field label="Interview time" id="interviewTime">
            <input id="interviewTime" name="interviewTime" type="time" value={values.interviewTime} onChange={set} className={inputClass} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Interview details" id="interviewDetails">
            <input
              id="interviewDetails"
              name="interviewDetails"
              placeholder="e.g. Google Meet, panel of 3, bring portfolio"
              value={values.interviewDetails}
              onChange={set}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      <Field label="Notes" id="notes">
        <textarea id="notes" name="notes" rows={3} value={values.notes} onChange={set} className={inputClass} />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : initial?.id ? "Save changes" : "Add application"}
        </button>
      </div>
    </form>
  );
}