// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { response } = require('express');


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1, name:1})
  response.json(blogs);
});


blogsRouter.post('/', async(request, response) => {
  const body = request.body;
  const user = request.user

  if (!request.token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url){
    return response.status(400).end()
  }

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes?body.likes:0,
      user: user._id
  });

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
  

});

blogsRouter.delete('/:id', async(req,res)=>{

  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!req.token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!blog){
    return res.status(400).json({ error: 'Cant find blog'})
  }
  if (blog.user.toString() !== user.id){
    return res.status(400).json({ error: 'Not the same person posted'})
  }

  await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()

})

blogsRouter.put('/:id',async(req,res)=> {
  
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
  }

  await Blog.findByIdAndUpdate(req.params.id, blog,{new:true})
  res.status(200).end()
})

module.exports = blogsRouter;
