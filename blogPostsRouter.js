const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { BlogPosts } = require('./blogPostsModel');

BlogPosts.create('in the beginning', 'there was the word', 'anonymous');
BlogPosts.create('in vino', 'veritas, verily, warily, scarily', 'leo tolstoy');

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
})

router.post('/',jsonParser, (req, res) => {
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
