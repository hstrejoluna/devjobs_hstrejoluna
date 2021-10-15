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
  Contract: {
    type: String,
  },
  Description: {
    type: String,
    trim: true,
  },
  Url: {
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
  const Url = slug(this.Title);
  this.Url = `${Url}-${shortid.generate()}`;
  next();
});

module.exports = mongoose.model("Vacancy", vacanciesSchema);
