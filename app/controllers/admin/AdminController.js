const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { Contact } = require('../../models/Contact')
const { User } = require('../../models/User')
const { authenticateUser } = require('../../middlewares/authentication')
const { authorizeUser } = require('../../middlewares/authorization')

// localhost:3000/admin/contacts
router.get('/contacts', authenticateUser, authorizeUser, function(req,res) {
    Contact.find()
    .then(function(contacts) {
        res.send(contacts)
    })
    .catch(function(err) {
        res.send(err)
    })
})

// localhost:3000/admin/users
router.get('/users', authenticateUser, authorizeUser, function(req,res) {
    User.find()
    .then(function(users) {
        res.send(users)
    })
    .catch(function(err) {
        res.send(err)
    })
})

// POST- localhost:3000/admin/users
router.post('/users', authenticateUser, authorizeUser, function (req, res) {
    let body = _.pick(req.body, ['username', 'password', 'email', 'roles'])
    const user = new User(body)
    user.save()
        .then(function (user) {
            res.send(user)
        })
        .catch(function (err) {
            res.send(err)
        })
})

//PUT - localhost:3000/admin/users/:id
router.put('/users/:id', authenticateUser, authorizeUser, function (req, res) {
    const id = req.params.id
    let body = _.pick(req.body, ['allowAccess'])
    User.findOneAndUpdate({ _id: id}, body, { new: true })
       .then(function(user) {
           res.send(user)
       })
       .catch(function(err) {
           res.send(err)
       })
})


module.exports = {
    adminRouter: router
}