const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('../models/admin')

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
    }
    catch(error)
    {
        res.status(500).json({message: 'Erreur interne.'})
    }
}