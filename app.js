const express = require('express');
const cors = require('cors');

const app = express();

const mongoose = require('./config/db');

const adminRoute = require('./routes/adminRoute');
const articlesRoute = require('./routes/articlesRoute');

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoute);
app.use('/api/articles', articlesRoute);

module.exports = app;