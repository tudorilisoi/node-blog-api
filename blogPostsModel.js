'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//blog schema
const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    firstName: String,
    lastName: String
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    publishDate: this.publishDate
  };
}


const BlogPost = mongoose.model('BlogPost', blogPostSchema)

module.exports = {BlogPost};
