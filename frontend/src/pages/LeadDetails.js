import { ArrowLeft, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { getLead, updateLeadStatus } from "../services/leadService";

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState("New");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getLead(id)
      .then(({ data }) => {
        setLead(data);
        setStatus(data.status);
        setNotes(data.notes || "");
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load lead"))
      .finally(() => setLoading(false));
  }, [id]);

  const saveStatus = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { data } = await updateLeadStatus(id, { status, notes });
      setLead(data);
      setMessage("Lead updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update lead");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading label="Loading lead details..." />;
  }

  if (!lead) {
    return <div className="alert alert-warning">{error || "Lead not found."}</div>;
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Lead Details</p>
          <h1>{lead.name}</h1>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/leads">
            <ArrowLeft size={17} className="me-1" />
            Back
          </Link>
          <Link className="btn btn-primary" to={`/leads/${lead._id}/edit`}>
            <Pencil size={17} className="me-1" />
            Edit
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <section className="panel">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2>Full Information</h2>
              <StatusBadge status={lead.status} />
            </div>
            <dl className="details-grid">
              <dt>Email</dt>
              <dd>{lead.email}</dd>
              <dt>Phone</dt>
              <dd>{lead.phone}</dd>
              <dt>Source</dt>
              <dd>{lead.source}</dd>
              <dt>Status</dt>
              <dd>{lead.status}</dd>
              <dt>Created</dt>
              <dd>{new Date(lead.createdAt).toLocaleString()}</dd>
              <dt>Last Updated</dt>
              <dd>{new Date(lead.updatedAt).toLocaleString()}</dd>
              <dt>Notes</dt>
              <dd>{lead.notes || "No notes added yet."}</dd>
            </dl>
          </section>
        </div>
        <div className="col-12 col-xl-5">
          <section className="panel">
            <h2>Follow-up Notes</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <div className="mb-3">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {["New", "Contacted", "Converted"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                className="form-control"
                id="notes"
                rows="7"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" disabled={saving} onClick={saveStatus} type="button">
              {saving ? "Updating..." : "Update Lead"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
