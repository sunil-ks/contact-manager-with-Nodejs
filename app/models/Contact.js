const mongoose = require('mongoose')
const axios = require('axios')
const { genderApiKey, googleApiKey } = require('../../config/api_keys')

const Schema = mongoose.Schema // const { Schema } = mongoose
// telling a document what fields it should have , like what properties an object should have
const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    gender : {
        type : String
    },
    city : {
        type : String
    },
    geo : {
        lat : String,
        long : String
    }
})

contactSchema.pre('save', function (next) {
    // const gender_api_key = 'pRPLCejozFwCHFbVCR'
    // const place_api_key = 'AIzaSyAjhH-5OzObMll7shQgtXB0iMnr0FMKwwc'

    const contact = this
    if (contact.isNew) {
        //axios - gender api
        const url = `https://gender-api.com/get?name=${contact.name}&key=${genderApiKey}`
        axios.get(url) 
        .then(function(response) {
           if(response.data.errmsg) {
               return Promise.reject('Invalid API key')
           }
           contact.gender = response.data.gender
           next()
        })
        //axios - google geo api
        const place_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${contact.city}&inputtype=textquery&fields=geometry&key=${googleApiKey}` 
        axios.get(place_url)
        .then(function(place_response){
            contact.geo.lat = place_response.data.candidates[0].geometry.location.lat
            contact.geo.long = place_response.data.candidates[0].geometry.location.lng
            
        })
        .catch(function(err) {
            console.log(err.message)
        })
    } else {
        next()
    }
})



// model based on the schmea - a model will become our object constructor function
// model names must be singular and must follow PascalCase
const Contact = mongoose.model('Contact', contactSchema) 

module.exports = {
    Contact
}