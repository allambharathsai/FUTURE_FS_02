import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { createLead, getLead, updateLead } from "../services/leadService";

const emptyLead = {
  name: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  notes: ""
};

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(emptyLead);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    getLead(id)
      .then(({ data }) =>
        setLead({
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: data.source,
          status: data.status,
          notes: data.notes || ""
        })
      )
      .catch(() => setError("Unable to load lead"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = id ? await updateLead(id, lead) : await createLead(lead);
      navigate(`/leads/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save lead");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setLead((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <Loading label="Loading lead..." />;
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Lead Management</p>
          <h1>{id ? "Edit Lead" : "Create Lead"}</h1>
        </div>
      </div>

      <section className="panel">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                className="form-control"
                id="name"
                value={lead.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                className="form-control"
                id="email"
                type="email"
                value={lead.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="form-control"
                id="phone"
                value={lead.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="source">
                Source
              </label>
              <select
                className="form-select"
                id="source"
                value={lead.source}
                onChange={(event) => updateField("source", event.target.value)}
              >
                {["Website", "LinkedIn", "Instagram", "Referral", "Other"].map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                value={lead.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                {["New", "Contacted", "Converted"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                className="form-control"
                id="notes"
                rows="5"
                value={lead.notes}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Link className="btn btn-outline-secondary" to="/leads">
              Cancel
            </Link>
            <button className="btn btn-primary" disabled={saving} type="submit">
              {saving ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LeadForm;
