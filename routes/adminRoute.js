const express = require('express')
const routes = require('express').Router()

const adminController = require('../controllers/adminController')

routes.post('/register', adminController.registerAdmin);
routes.post('/login', adminController.loginAdmin);

module.exports = routes