const Articles = require('../models/articles');
const path = require('path');
const fs = require('fs');

const createLogger = require('../config/logger');
const logger = createLogger('articlesController');

exports.createArticle = async (req, res) => {
    try
    {
        const {
            name,
            description
        } = req.body;

        const image = req.file ? req.file.path : null;

        const price = parseFloat(req.body.price);

        const createdBy = req.user.id;

        const newArticle = new Articles({
            name,
            price,
            description,
            image,
            createdBy
        });

        await newArticle.save();

        res.status(201).json({success: true, message: 'Article crée.', article: newArticle });

        logger.info(`Article ${newArticle._id} created by user ${req.user.id}`);
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'Erreur interne.'});
        logger.error(`Create Article Error: ${error.message}`);
        console.log('Error: Create Article', error);
    }
}

exports.getArticles = async (req, res) => {
    try
    {
        const userID = req.user.id;
        const articles = await Articles.find({createdBy: userID});
        res.status(200).json({success: true, articles});
        logger.info(`Article retreived by user ${req.user.id}`);
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'Erreur interne.'});
        logger.error(`Get Article Error: ${error.message}`);
        console.log('Error: Get Article', error);
    }
}

exports.deleteArticle = async (req, res) => {
    try
    {
        const articleID = req.params.id;
        const userID = req.user.id;
        const article = await Articles.findOneAndDelete({createdBy: userID, _id: articleID});

        if (!article)
        {
            return res.status(400).json({success: false, message: 'Produit non trouvée.'})
        }

        res.status(200).json({success: true, message: 'Produit supprimée.', article});
        logger.info(`Article ${articleID} deleted by user ${req.user.id}`);
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'Erreur interne.'});
        logger.error(`Delete Article Error: ${error.message}`);
        console.log('Error: Delete Article', error);
    }
}

exports.modifyArticle = async (req, res) => {
    try
    {
        const articleID = req.params.id;
        const userID = req.user.id;

        console.log(req);
        console.log(req.body);

        const updatedData = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            description: req.body.description
        }

        if (req.file)
        {
            updatedData.image = req.file.path;
        }

        const article = await Articles.findOneAndUpdate({createdBy: userID, _id: articleID}, updatedData, {new: true});

        if (!article)
        {
            return res.status(400).json({success: false, message: 'Produit non trouvée.'})
        }

        res.status(200).json({success: true, message: 'Produit mis à jour.', article});
        logger.info(`Article ${articleID} modified by user ${req.user.id}`);
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'Erreur interne.'});
        logger.error(`Modify Article Error: ${error.message}`);
        console.log('Error: Modify Article', error);
    }
}

exports.getArticleImage = async (req, res) => {
    try {
        const articleID = req.params.id;
        const userID = req.user.id;

        // Find the article in DB
        const article = await Articles.findOne({ createdBy: userID, _id: articleID });

        if (!article || !article.image) {
            return res.status(400).json({ success: false, message: "L'article ou l'image de l'article non trouvée." });
        }

        // Always build the path inside "uploads" to prevent path traversal attack or paths errors.
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        const imageName = path.basename(article.image); // strips any ../
        const imagePath = path.join(uploadsDir, imageName);

        // Check file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(400).json({ success: false, message: "Le fichier de l'image est introuvable." });
        }

        // Send image file
        logger.info(`Article ${articleID} get image by user ${req.user.id}`);
        return res.status(200).sendFile(imagePath);
    } catch (error) {
        console.error('Error: Get Article Image', error);
        logger.error(`Get Article Image Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Erreur interne.' });
    }
};