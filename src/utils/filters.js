export function filterApplications(applications, { search = "", status = "All", type = "All" } = {}) {
  const q = search.trim().toLowerCase();
  return applications.filter((a) => {
    const matchesText =
      !q || a.company?.toLowerCase().includes(q) || a.position?.toLowerCase().includes(q);
    const matchesStatus = status === "All" || a.status === status;
    const matchesType = type === "All" || a.type === type;
    return matchesText && matchesStatus && matchesType;
  });
}