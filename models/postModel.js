const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');
// have title, body, photo, author, and tags
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title"],
      // unique: true,
      trim: true,
      maxlength: [40, "A post name must have less or equal then 40 characters"],
      minlength: [5, "A post name must have more or equal then 5 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    slug: String,
    body: {
      type: String,
      trim: true,
      required: [true, "A post must have a description"],
    },
    photo: { type: String, default: "tour-1-1.jpg" },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
postSchema.pre("save", function(next) {
  // console.log("postSchema preee");
  this.slug = slugify(this.title, { lower: true });
  next();
});
// postSchema.post(/^findOneAnd/, function(doc, next) {
//   console.log("in findOneAnd");
//   this.slug = slugify(doc.title, { lower: true });
//   next();
// });

// QUERY MIDDLEWARE
postSchema.pre(/^find/, function(next) {
  // console.log("postSchema last");
  this.populate({
    path: "author",
    select: "name",
  });
  next();
});

// postSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
