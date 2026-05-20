const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Lead = require("../models/Lead");
const User = require("../models/User");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "db.json");

let mode = "mongo";

const ensureFileStore = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [], leads: [] }, null, 2));
  }
};

const readStore = () => {
  ensureFileStore();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
};

const writeStore = (data) => {
  ensureFileStore();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

const toPublicUser = (user) => {
  if (!user) return null;
  const publicUser = { ...user };
  delete publicUser.password;
  publicUser._id = publicUser._id || publicUser.id;
  return publicUser;
};

const matchesLeadFilter = (lead, { search, status }) => {
  const statusMatches = !status || status === "All" || lead.status === status;
  const searchValue = (search || "").toLowerCase();
  const searchMatches =
    !searchValue ||
    lead.name.toLowerCase().includes(searchValue) ||
    lead.email.toLowerCase().includes(searchValue);

  return statusMatches && searchMatches;
};

const setStoreMode = (nextMode) => {
  mode = nextMode;
  if (mode === "file") {
    ensureFileStore();
  }
};

const getStoreMode = () => mode;

const users = {
  async findByEmail(email) {
    if (mode === "mongo") {
      return User.findOne({ email: email.toLowerCase() });
    }

    const store = readStore();
    return store.users.find((user) => user.email === email.toLowerCase()) || null;
  },

  async findById(id) {
    if (mode === "mongo") {
      return User.findById(id).select("-password");
    }

    const store = readStore();
    return toPublicUser(store.users.find((user) => user._id === id));
  },

  async createAdmin(email, password) {
    if (mode === "mongo") {
      const existingAdmin = await User.findOne({ email: email.toLowerCase() });
      if (!existingAdmin) {
        await User.create({ email, password });
      }
      return;
    }

    const store = readStore();
    const existingAdmin = store.users.find((user) => user.email === email.toLowerCase());
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 12);
      store.users.push({
        _id: crypto.randomUUID(),
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      writeStore(store);
    }
  }
};

const leads = {
  async list({ search, status, page, limit }) {
    if (mode === "mongo") {
      const filter = {};

      if (status && status !== "All") {
        filter.status = status;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }

      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Lead.countDocuments(filter)
      ]);

      return { items, total };
    }

    const store = readStore();
    const filtered = store.leads
      .filter((lead) => matchesLeadFilter(lead, { search, status }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (page - 1) * limit;

    return {
      items: filtered.slice(start, start + limit),
      total: filtered.length
    };
  },

  async findById(id) {
    if (mode === "mongo") {
      return Lead.findById(id);
    }

    const store = readStore();
    return store.leads.find((lead) => lead._id === id) || null;
  },

  async create(payload) {
    if (mode === "mongo") {
      return Lead.create(payload);
    }

    const store = readStore();
    const now = new Date().toISOString();
    const lead = {
      _id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      source: payload.source || "Website",
      status: payload.status || "New",
      notes: payload.notes || "",
      createdAt: now,
      updatedAt: now
    };
    store.leads.push(lead);
    writeStore(store);
    return lead;
  },

  async update(id, payload) {
    if (mode === "mongo") {
      const lead = await Lead.findById(id);
      if (!lead) return null;

      ["name", "email", "phone", "source", "status", "notes"].forEach((field) => {
        if (payload[field] !== undefined) {
          lead[field] = payload[field];
        }
      });

      return lead.save();
    }

    const store = readStore();
    const index = store.leads.findIndex((lead) => lead._id === id);
    if (index === -1) return null;

    store.leads[index] = {
      ...store.leads[index],
      ...payload,
      email: payload.email ? payload.email.toLowerCase() : store.leads[index].email,
      updatedAt: new Date().toISOString()
    };
    writeStore(store);
    return store.leads[index];
  },

  async remove(id) {
    if (mode === "mongo") {
      const lead = await Lead.findById(id);
      if (!lead) return false;
      await lead.deleteOne();
      return true;
    }

    const store = readStore();
    const initialLength = store.leads.length;
    store.leads = store.leads.filter((lead) => lead._id !== id);
    writeStore(store);
    return store.leads.length !== initialLength;
  },

  async stats() {
    if (mode === "mongo") {
      const [total, newLeads, contacted, converted, bySource] = await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: "New" }),
        Lead.countDocuments({ status: "Contacted" }),
        Lead.countDocuments({ status: "Converted" }),
        Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }])
      ]);

      return {
        total,
        new: newLeads,
        contacted,
        converted,
        bySource: bySource.map((item) => ({ source: item._id, count: item.count }))
      };
    }

    const store = readStore();
    const sourceCounts = store.leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    return {
      total: store.leads.length,
      new: store.leads.filter((lead) => lead.status === "New").length,
      contacted: store.leads.filter((lead) => lead.status === "Contacted").length,
      converted: store.leads.filter((lead) => lead.status === "Converted").length,
      bySource: Object.entries(sourceCounts).map(([source, count]) => ({ source, count }))
    };
  }
};

module.exports = {
  getStoreMode,
  leads,
  setStoreMode,
  users
};
