const express = require('express')
const _ = require('lodash')
const router = express.Router() 
const { Contact } = require('../models/Contact')
const { authenticateUser } = require('../middlewares/authentication')

// localhost:3000/contacts
router.get('/', authenticateUser, function (req, res) {
    Contact.find({
        user: req.user._id
    })
        .then(function (contacts) {
            res.send(contacts)
        })
        .catch(function (err) {
            res.send(err)
        })
})

router.post('/', authenticateUser, function (req, res) {
    const body = req.body // const { body } = req 
    const contact = new Contact(body)
    contact.user = req.user._id
    contact.save()
        .then(function (contact) {
            res.send({
                contact,
                notice: 'successfully created a contact'
            })
        })
        .catch(function (err) {
            res.send(err)
        })
})


// localhost:3000/contacts/:id
router.get('/:id', authenticateUser, function (req, res) {
    const id = req.params.id
    Contact.findOne({
        user: req.user._id,
        _id: id 
    })
        .then(function (contact) {
            // when you are trying to find the record by the id, if the rec is not found, it returns null, not be understood as promise being rejected
            if (contact) {
                res.send(contact)
            } else {
                res.status('404').send({})
            }
        })
        .catch(function (err) {
            res.send(err)
        })
})


//localhost:3000/contacts/:id
router.delete('/:id', authenticateUser, function (req, res) {
    const id = req.params.id
    Contact.findOneAndDelete({
        _id: id, 
        user: req.user._id 
    })
        .then(function (contact) {
            if (contact) {
                res.send({
                    contact,
                    notice: 'successfully removed the contact'
                })
            } else {
                res.status('404').send({})
            }
        })
        .catch(function (err) {
            res.send(err)
        })
})

router.put('/:id', authenticateUser, function (req, res) {
    const id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'mobile'])
    Contact.findOneAndUpdate({ _id: id, user: req.user._id}, body, { new: true, runValidators: true })
        .then(function (contact) {
            if (contact) {
                res.send({
                    contact,
                    notice: 'successfully udated the contact'
                })
            } else {
                res.status('404').send({})
            }
        })
        .catch(function (err) {
            res.send(err)
        })
})

module.exports = {
    contactsRouter: router  
}