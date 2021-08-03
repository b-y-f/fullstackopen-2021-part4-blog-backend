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

blogsRouter.delete('/:id', async(req,res)=>{
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()

})

blogsRouter.put('/:id',async(req,res)=> {
  
  const body = req.body
  const blog = {
    title: body.title,
    url: body.url,
    author:body.author
  }

  await Blog.findByIdAndUpdate(req.params.id, blog,{new:true})
  res.status(200).end()
})

module.exports = blogsRouter;
