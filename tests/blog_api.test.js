const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

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


afterAll(() => {
    mongoose.connection.close()
})