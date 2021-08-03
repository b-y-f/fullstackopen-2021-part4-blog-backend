// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((notes) => {
    response.json(notes);
  });
});


blogsRouter.post('/', (request, response, next) => {
  const body = request.body;

  const note = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.like?body.like:0,
  });

  note.save()
      .then((savedNote) => {
        response.json(savedNote);
      })
      .catch((error) => next(error));
});

module.exports = blogsRouter;
