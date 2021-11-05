const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

const vacanciesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "The vacancy title is required",
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    required: "Location is required",
  },
  salary: {
    type: String,
    default: 0,
    trim: true,
  },
  contract: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  skills: [String],
  candidates: [
    {
      name: String,
      email: String,
      cv: String,
    },
  ],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: "The author is required",
  },
});
vacanciesSchema.pre("save", function (next) {
  // creates URL
  const url = slug(this.title);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

module.exports = mongoose.model("Vacancy", vacanciesSchema);
