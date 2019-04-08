const express = require('express')
const router = express.Router() 

const { contactsRouter } = require('../app/controllers/ContactsController')
const { usersRouter } = require('../app/controllers/UsersController')
const { adminRouter } = require('../app/controllers/admin/AdminController')

router.use('/admin', adminRouter)
router.use('/contacts', contactsRouter)
router.use('/users', usersRouter)

module.exports = {
    routes: router 
}