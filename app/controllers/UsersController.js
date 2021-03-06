const express = require('express')
const _ = require('lodash')
const router = express.Router()
const { User } = require('../models/User')
const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')


// admin route
router.get('/', authenticateUser, authorizeUser, function(req,res) {
    User.find()
    .then(function(users) {
        res.send(users)
    })
    .catch(function(err) {
        res.send(err)
    })
})

// localhost:3000/users/register
router.post('/register', function (req, res) {
    // strong parameters - whitelisting incoming request body (security purposes) ..recieve only these fields before it hits the server
    let body = _.pick(req.body, ['username', 'email', 'password'])
    const user = new User(body)
    user.save()
        .then(function (user) {
            res.send(user)
        })
        .catch(function (err) {
            res.send(err)
        })
})

// localhost:3000/users/login 
router.post('/login', function (req, res) {
    const body = req.body
    User.findByCredentials(body.email, body.password)
        .then(function (user) {
            if(user.tokens.length <= 3) {
                return user.generateToken()
            } else {
               res.send({notice : 'You have logged in from 3 devices already'})
            }
        })
        .then(function (token) {
            res.setHeader('x-auth', token).send({})
        })
        .catch(function (err) {
            res.send(err)
        })

})

// localhost:3000/users/account 
router.get('/account', authenticateUser, function (req, res) {
    const { user } = req
    res.send(user)
})


// localhost:3000/users/logout
router.delete('/logout', authenticateUser, function (req, res) {
    const { user, token } = req
    User.findByIdAndUpdate(user._id, {  tokens: [] } )
        .then(function () {
            res.send({ notice: 'successfully logged out' })
        })
        .catch(function (err) {
            res.send(err)
        })
})

module.exports = {
    usersRouter: router
}