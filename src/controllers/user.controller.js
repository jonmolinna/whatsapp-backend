import User from '../models/User.js';
import bcrypt from 'bcryptjs';

import { validateRegister, validateLogin } from '../util/validator.user.js';
import { generateToken } from '../util/token.js';

export const createUser = async (req, res) => {
    const { name, username, password, confirmPassword } = req.body;

    try {
        const { valid, errors } = validateRegister(name, username, password, confirmPassword);

        if (!valid) {
            throw errors
        };

        const user = await User.findOne({ username });
        if (user) {
            throw errors.username = {
                username: 'El usuario ya existe',
            }
        };

        const contrasena = await bcrypt.hash(password, 6);

        await User.create({ name, username, password: contrasena });

        return res.status(200).json({ message: 'Usuario Creado con exito' });
        
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const { valid, errors } = validateLogin(username, password);

        if (!valid) {
            throw errors
        };

        const user = await User.findOne({ username });
        if (!user) {
            throw errors.username = {
                username: "Credenciales no válidas",
            }
        };

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw errors.password = {
                password: 'Credenciales no válidas'
            }
        }

        const token = generateToken(user);

        return res.status(200).json({
            id: user._id,
            name: user.name,
            username: user.username,
            token
        });
        
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};