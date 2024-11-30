const mongoose = require("mongoose");

const farmDataSchema = new mongoose.Schema({
  farm: { type: String, required: true },
  moisture: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, unique: true, required: true },
});

module.exports = mongoose.model("FarmData", farmDataSchema);
