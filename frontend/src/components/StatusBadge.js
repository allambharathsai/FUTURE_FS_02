const statusClasses = {
  New: "text-bg-info",
  Contacted: "text-bg-warning",
  Converted: "text-bg-success"
};

const StatusBadge = ({ status }) => (
  <span className={`badge rounded-pill ${statusClasses[status] || "text-bg-secondary"}`}>{status}</span>
);

export default StatusBadge;
