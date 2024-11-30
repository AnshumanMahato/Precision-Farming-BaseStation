const express = require("express");
const farmController = require("../controllers/farmController");

const router = express.Router();

router
  .route("/:farmId/data")
  .post(farmController.insertFarmData)
  .get(farmController.getFarmData);

router.route("/:farmId/analyse").get(farmController.getFarmAnalysis);

module.exports = router;
