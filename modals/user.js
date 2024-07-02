const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    username: { type: String, required: true, unique: true, minlength: 5 },
    password: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("App-Users", userSchema);

module.exports = Users;
