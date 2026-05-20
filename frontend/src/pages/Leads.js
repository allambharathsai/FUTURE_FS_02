import { Download, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { deleteLead, getLeads } from "../services/leadService";

const statuses = ["All", "New", "Contacted", "Converted"];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => ({ page: pagination.page, limit: 10, search, status }), [
    pagination.page,
    search,
    status
  ]);

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getLeads(query);
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadLeads, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) {
      return;
    }

    await deleteLead(id);
    loadLeads();
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Source", "Status", "Notes", "Created Date"];
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.source,
      lead.status,
      lead.notes,
      new Date(lead.createdAt).toLocaleString()
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value || "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h1>Lead List</h1>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={exportCsv} type="button">
            <Download size={17} className="me-1" />
            CSV
          </button>
          <Link className="btn btn-primary" to="/leads/new">
            <Plus size={17} className="me-1" />
            Add Lead
          </Link>
        </div>
      </div>

      <section className="panel">
        <div className="row g-3 align-items-end mb-3">
          <div className="col-12 col-lg-8">
            <label className="form-label" htmlFor="search">
              Search
            </label>
            <input
              className="form-control"
              id="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => {
                setPagination((prev) => ({ ...prev, page: 1 }));
                setSearch(event.target.value);
              }}
            />
          </div>
          <div className="col-12 col-lg-4">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              value={status}
              onChange={(event) => {
                setPagination((prev) => ({ ...prev, page: 1 }));
                setStatus(event.target.value);
              }}
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <Loading label="Loading leads..." />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle crm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="fw-semibold">{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.source}</td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-1">
                          <Link className="btn btn-sm btn-outline-secondary icon-btn" to={`/leads/${lead._id}`} title="View">
                            <Eye size={16} />
                          </Link>
                          <Link
                            className="btn btn-sm btn-outline-primary icon-btn"
                            to={`/leads/${lead._id}/edit`}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger icon-btn"
                            onClick={() => handleDelete(lead._id)}
                            type="button"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td className="text-center py-4" colSpan="7">
                        No leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mt-3">
              <span className="text-muted small">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} leads)
              </span>
              <div className="btn-group">
                <button
                  className="btn btn-outline-secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="btn btn-outline-secondary"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Leads;
