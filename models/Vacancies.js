const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

const vacanciesSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: "The vacancy title is required",
    trim: true,
  },
  Company: {
    type: String,
    trim: true,
  },
  Location: {
    type: String,
    trim: true,
    required: "Location is required",
  },
  Salary: {
    type: String,
    default: 0,
    trim: true,
  },
  contract: {
    type: String,
  },
  Description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  Skills: [String],
  candidates: [
    {
      name: String,
      email: String,
      cv: String,
    },
  ],
});
vacanciesSchema.pre("save", function (next) {
  // creates URL
  const url = slug(this.title);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

module.exports = mongoose.model("Vacancy", vacanciesSchema);
