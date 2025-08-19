const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('../models/admin');

const createLogger = require('../config/logger');
const logger = createLogger('adminController');

exports.registerAdmin = async (req, res) => {
    try {
        const {
            lastname,
            firstname,
            email,
            phone,
            password
        } = req.body;

        const isContactDefined = await admin.findOne({ $or:[{email},{phone}] });

        if (isContactDefined)
        {
            return res.status(400).json({message: 'Email ou telephone déjà utiliser.'});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newAdmin = new admin({
            lastname,
            firstname,
            email,
            phone,
            password: hashPassword
        });

        await newAdmin.save();

        res.status(201).json(
            {success: true, message: "Administrateur ajouter avec success"}
        )

        logger.info(`New admin registered ${newAdmin._id}`);
    }
    catch(error)
    {
        res.status(500).json({message: 'Erreur interne.'})
        logger.error(`Register new admin error: ${error.message}`);
    }
}

exports.loginAdmin = async (req, res) => {
    try
    {
        const {
            email,
            password
        } = req.body;

        const Admin = await admin.findOne({email});

        if (!Admin)
        {
            return res.status(400).json({message: "Email ou mdp incorrect."});
        }

        const okPass = await bcrypt.compare(password, Admin.password);

        if (!okPass)
        {
            return res.status(400).json({message: "Email ou mdp incorrect."});
        }

        const token = jwt.sign(
            {
                id: Admin._id,
                email: Admin.email
            },
            process.env.JWT_SECRET || 'default_secret',
            {
                expiresIn: '1d'
            }
        );

        const ad = {
            id: Admin._id,
            lastname: Admin.lastname,
            firstname: Admin.firstname,
            phone: Admin.phone,
            email: Admin.email
        }
        
        res.status(201).json(
            {
                success: true,
                message: "Administrateur connecter avec success",
                token,
                admin: ad
            }
        )

        logger.info(`Admin connection ${Admin._id}`);
    }
    catch (error)
    {
        res.status(500).json({message: 'Erreur interne.'});
        logger.error(`Admin login error: ${error.message}`);
    }
}