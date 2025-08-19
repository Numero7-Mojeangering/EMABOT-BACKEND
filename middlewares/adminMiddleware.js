const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = decoded; // Ajoute l'utilisateur décodé à la requête
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide' });
    }
    console.log('req.user', req.user);
};

module.exports = adminMiddleware;