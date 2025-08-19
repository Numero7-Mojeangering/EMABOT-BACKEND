const express = require('express')
const cors = require('cors')

const app = express()

const mongoose = require('./config/db')

app.use(cors())
app.use(express.json())

module.exports = app