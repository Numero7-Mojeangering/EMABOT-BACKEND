const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Mongo DB est connecter avec succès.")
}).catch((err) => {
    console.log('Mongo Erreur: ', err)
})


module.exports = mongoose

