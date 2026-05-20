const express = require("express");
const {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  getLeadStats,
  updateLead,
  updateLeadStatus
} = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/stats/summary", getLeadStats);
router.put("/status/:id", updateLeadStatus);
router.route("/").get(getLeads).post(createLead);
router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

module.exports = router;
