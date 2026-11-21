export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function daysUntil(isoDate) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function deadlineLabel(isoDate) {
  const n = daysUntil(isoDate);
  if (n === null) return null;
  if (n < 0) return { text: `Overdue by ${-n} day${n === -1 ? "" : "s"}`, tone: "text-rose-600" };
  if (n === 0) return { text: "Due today", tone: "text-rose-600" };
  if (n === 1) return { text: "Due tomorrow", tone: "text-amber-600" };
  if (n <= 7) return { text: `Due in ${n} days`, tone: "text-amber-600" };
  return { text: `Due in ${n} days`, tone: "text-slate-500" };
}