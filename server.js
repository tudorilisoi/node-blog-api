'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

const { BlogPosts } = require('./blogPostsModel');
const blogPostsRouter = require('./blogPostsRouter');


app.use(morgan('common'));

BlogPosts.create('in the beginning', 'there was the word', 'anonymous');
BlogPosts.create('in vino', 'veritas, verily, warily, scarily', 'leo tolstoy');

app.use('/blog-posts', blogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`listening with great excitement on port ${process.env.PORT || 8080}`);
})

