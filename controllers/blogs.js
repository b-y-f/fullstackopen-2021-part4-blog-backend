// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((notes) => {
    response.json(notes);
  });
});


blogsRouter.post('/', async(request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url){
    response.status(400).end()
  }else{
    const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.like?body.like:0,
  });

  const savedBlog = await blog.save()
  response.json(savedBlog)
  }

});

module.exports = blogsRouter;
