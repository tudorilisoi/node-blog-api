'use strict';
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { BlogPost } = require('./blogPostsModel');

const jsonParser = bodyParser.json();
router.use(jsonParser);

router.get('/', (req, res) => {
  BlogPost
    .find()
    .limit(5)
    .then(blogPosts => {
      res.json({
        blogPosts: blogPosts.map(
          (post) => post.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    })
});

router.post('/', (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field) {
      const message = `The ${field} field is missing in the request body.`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(post);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field) {
      const message = `The ${field} field is missing in the request body.`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match.`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating blog post: ${req.params.id}`);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
