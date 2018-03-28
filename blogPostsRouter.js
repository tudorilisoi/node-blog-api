'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');


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

router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
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

  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(post => res.status(201).json(post))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field) {
      const message = `The ${field} field is missing in the request body.`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if ((req.params.id && req.body.id) && (req.params.id === req.body.id)) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match.`;
    console.error(message);
    return res.status(400).send(message);
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      tpUpdate[field] = req.body[field];
    }
  });

  BlogPost
  .findByIdAndUpdate(req.params.id, { $set: toUpdate })
  .then(post => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server erorr'}));
});

router.delete('/:id', (req, res) => {
  BlogPost
  .findByIdAndRemove(req.params.id)
  .then(post => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server erorr'}));
});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});


module.exports = router;
