const express = require('express');
const routes = require('express').Router();
const multer = require('multer');
const upload = require('../middlewares/uploadMiddlewares');
const auth = require('../middlewares/adminMiddleware');

const articlesController = require('../controllers/articlesController');

routes.post('/createarticle', auth, upload, articlesController.createArticle);
routes.get('/getarticles', auth, articlesController.getArticles);
routes.delete('/deletearticle/:id', auth, articlesController.deleteArticle);
routes.put('/updatearticle/:id', auth, articlesController.modifyArticle);
routes.get('/getarticleimage/:id', auth, articlesController.getArticleImage);

module.exports = routes;