const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe('when didnt meet restrictions', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('test if username or password missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUserMissUsername = {
            name: 'Superuser',
            password: 'salainen',
        }

        const newUserMissPass = {
            username: 'root',
            name: 'Superuser',
        }

        const result1 = await api
            .post('/api/users')
            .send(newUserMissUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result1.body.error).toContain('`username` is required')

        const result2 = await api
            .post('/api/users')
            .send(newUserMissPass)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result2.body.error).toContain('Password missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('test if username and password length >= 3', async () => {
        const usersAtStart = await helper.usersInDb()

        const userNameNotLong = {
            username: 'Su',
            name: 'susan',
            password: 'salainen',
        }

        const passwordNotLong = {
            username: 'Superuser',
            name: 'susan',
            password: 'sa',
        }

        const bothNotLong = {
            username: 'Su',
            name: 'susan',
            password: 'sa',
        }

        
        await api
            .post('/api/users')
            .send(userNameNotLong)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        
        await api
            .post('/api/users')
            .send(passwordNotLong)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        
        await api
            .post('/api/users')
            .send(bothNotLong)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        


        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


afterAll(() => {
    mongoose.connection.close()
})