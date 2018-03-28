'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { BlogPost } = require('./blogPostsModel');

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('common'));
app.use(jsonParser);

app.get('/blog-posts', (req, res) => {
  BlogPost
    .find()
    // .limit(5)
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

app.get('/blog-posts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    })
});

app.post('/blog-posts', (req, res) => {
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

app.put('/blog-posts/:id', (req, res) => {
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

app.delete('/blog-posts/:id', (req, res) => {
  BlogPost
  .findByIdAndRemove(req.params.id)
  .then(post => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server erorr'}));
});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});



let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};


module.exports = {app, runServer, closeServer};
