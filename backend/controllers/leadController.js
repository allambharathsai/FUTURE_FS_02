const { leads } = require("../config/store");

const getLeads = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const { items, total } = await leads.list({
    search: req.query.search,
    status: req.query.status,
    page,
    limit
  });

  res.json({
    leads: items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1
    }
  });
};

const getLeadById = async (req, res) => {
  const lead = await leads.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.json(lead);
};

const createLead = async (req, res) => {
  const { name, email, phone, source, status, notes } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and phone are required" });
  }

  const lead = await leads.create({
    name,
    email,
    phone,
    source,
    status,
    notes
  });

  return res.status(201).json(lead);
};

const updateLead = async (req, res) => {
  const updatedLead = await leads.update(req.params.id, req.body);

  if (!updatedLead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.json(updatedLead);
};

const deleteLead = async (req, res) => {
  const deleted = await leads.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.json({ message: "Lead deleted successfully" });
};

const updateLeadStatus = async (req, res) => {
  const { status, notes } = req.body;

  if (!["New", "Contacted", "Converted"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const payload = { status };
  if (notes !== undefined) {
    payload.notes = notes;
  }

  const updatedLead = await leads.update(req.params.id, payload);

  if (!updatedLead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.json(updatedLead);
};

const getLeadStats = async (req, res) => {
  const stats = await leads.stats();
  const { total, converted } = stats;

  const conversionRate = total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0;

  res.json({
    ...stats,
    conversionRate,
  });
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  getLeadStats
};
