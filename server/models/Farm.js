const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const farmSchema = new mongoose.Schema({
  owner: {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
  },
  moistureThreshold: { type: Number },
});

farmSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.owner.password = await bcrypt.hash(this.owner.password, 10);
  }
  next();
});

farmSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.owner.password);
};

module.exports = mongoose.model("Farm", farmSchema);
