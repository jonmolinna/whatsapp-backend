import Message from '../models/Message.js';
import User from '../models/User.js';

// Crear un Mensaje
export const createMessage = async (req, res) => {
    const { to, content } = req.body;
    const errors = {};

    try {
        const recipient = await User.findOne({ username: to });

        if (!recipient) throw errors.message = "El usuario no existe";
        if (recipient.username === req.userToken.username) throw errors.message = 'No puedes enviar mensaje a ti mismo';
        if (content.trim() === "") throw errors.message = "Ingrese un mensaje";

        await Message.create({
            message: content,
            from: req.userToken.username,
            to: to,
            status: false,
            private: true,
        });

        return res.status(200).json({ msg: 'Se creo un mensaje' });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

// Obtener Mensajes
export const getMessages = async (req, res) => {
    const { to } = req.query;
    const errors = {};

    try {
        const otherUser = await User.findOne({ username: to });

        if (!otherUser) throw errors.message = "Usuario no encontrado";

        const users = [req.userToken.username, otherUser.username];

        const messages = await Message.find({
            from: { $in: users },
            to: { $in: users },
        })
        .sort({ 'createdAt': 'desc'});

        return res.status(200).json({ messages });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
