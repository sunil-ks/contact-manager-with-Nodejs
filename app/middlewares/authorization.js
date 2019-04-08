

const authorizeUser = (req, res, next) => {
    if(req.user.roles.includes('admin')) {
        next()
    } else {
        res.status('403').send ( {
            notice : 'The page does not exist'
        })
    }
}

module.exports = {
    authorizeUser
}