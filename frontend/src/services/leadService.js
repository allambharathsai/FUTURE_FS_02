import api from "./api";

export const getLeadStats = () => api.get("/leads/stats/summary");

export const getLeads = (params) => api.get("/leads", { params });

export const getLead = (id) => api.get(`/leads/${id}`);

export const createLead = (payload) => api.post("/leads", payload);

export const updateLead = (id, payload) => api.put(`/leads/${id}`, payload);

export const deleteLead = (id) => api.delete(`/leads/${id}`);

export const updateLeadStatus = (id, payload) => api.put(`/leads/status/${id}`, payload);
