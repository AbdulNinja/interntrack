export const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
export const TYPES = ["Internship", "Full-time", "Part-time", "Contract"];

export const STATUS_STYLES = {
  Saved: "bg-slate-100 text-slate-700 ring-slate-200",
  Applied: "bg-blue-50 text-blue-700 ring-blue-200",
  Interview: "bg-amber-50 text-amber-700 ring-amber-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const EMPTY_APPLICATION = {
  company: "",
  position: "",
  location: "",
  type: "Internship",
  status: "Saved",
  dateApplied: "",
  deadline: "",
  interviewDate: "",
  interviewTime: "",
  interviewDetails: "",
  jobLink: "",
  notes: "",
};