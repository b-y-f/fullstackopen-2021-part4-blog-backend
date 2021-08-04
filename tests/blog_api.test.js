const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

// TODO 4.23*: bloglist expansion, step11
// After adding token based authentication the tests for adding a new blog broke down. 
// Fix the tests. Also write a new test  to ensure adding a blog fails with the
// proper status code 401 Unauthorized if a token is not provided.


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    // register a dummy user
    
  })

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
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
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    })

test('verify if like is missing', async ()=> {
    const res = await api.get('/api/blogs')
    const likes = res.body.filter(r => r.likes===0 || r.likes===undefined)
    expect(likes).toHaveLength(0)
})

test('test if title and url missing', async()=> {
    const newTestBlog = {
        url:"wwwwwww.bbb",
        author:"bill",
        likes:100
    }

    await api
    .post('/api/blogs')
    .send(newTestBlog)
    .expect(400)

})

test('test if successful deleted post',async()=>{
    const res = await api.get('/api/blogs')
    const targetId = res.body[0].id
    await api
        .delete(`/api/blogs/${targetId}`)
        .expect(204)

    const res2 = await api.get('/api/blogs')
    expect(res2.body).toHaveLength(res.body.length - 1)
})

test('test update blog post', async()=>{
    const res = await api.get('/api/blogs')
    const targetId = res.body[1].id
    const update_info = {
        title: 'Updated',
        url: 'www.update.com',
    }

    await api
        .put(`/api/blogs/${targetId}`)
        .send(update_info)
        .expect(200)

    const res2 = await api.get('/api/blogs')
    expect(res2.body[1].title).toContain('Updated')
    expect(res2.body[1].url).toContain('www.update.com')
})

afterAll(() => {
    mongoose.connection.close()
})