// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1, name:1})
  response.json(blogs);
});


blogsRouter.post('/', async(request, response, next) => {
  const body = request.body;

  const user = await User.findById(body.userId)

  if (!body.title || !body.url){
    return response.status(400).end()
  }

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.like?body.like:0,
      user: user._id
  });

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
  

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
