const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.password){
        if (body.password && body.password.length<3 ){
            response.status(400).json({error:`length of password: ${body.password} should at least 3 char`})
        }else{
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(body.password, saltRounds)
        
            const user = new User({
                username: body.username,
                name: body.name,
                passwordHash,
            })
        
            const savedUser = await user.save()
        
            response.json(savedUser)
        }
    }else{
        response.status(400).json({error:'Password missing!'})
    }

})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})


module.exports = usersRouter
