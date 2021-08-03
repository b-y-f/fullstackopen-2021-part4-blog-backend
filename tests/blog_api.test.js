const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
},10000)

test('check unique identifier', async ()=> {
    const res = await api.get('/api/blogs')

    expect(res.body[0].id).toBeDefined()
})

// 4.10
test('check if can create new blog', async ()=>{
    const newTestBlog = {
        title:"4.10 test",
        author:"bill",
        url:"www.google.com/test",
        likes:100
    }

    await api
        .post('/api/blogs')
        .send(newTestBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    })



afterAll(() => {
    mongoose.connection.close()
})