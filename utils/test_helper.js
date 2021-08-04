const User = require('../models/user')
const Blog = require('../models/blog')

// blogs
const initialBlogs = [
    {
        title: 'HTML is easy',
        author: 'bill',
        url: 'www.google.com',
        likes: 2
    },
    {
        title: 'HTML is hard',
        author: 'bill_bb',
        url: 'www.nvc.com',
        likes: 22
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', url: "www.ddd." })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blog = await Blog.find({})
    return blog.map(blog => blog.toJSON())
  }
  
// users

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
}