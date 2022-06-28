import Message from "../models/Message.js";
import User from "../models/User.js";

// Crear un Mensaje
export const createMessage = async (req, res) => {
  const { to, content } = req.body;
  const errors = {};

  try {
    const recipient = await User.findOne({ username: to });

    if (!recipient) throw (errors.message = "El usuario no existe");
    if (recipient.username === req.userToken.username)
      throw (errors.message = "No puedes enviar mensaje a ti mismo");
    if (content.trim() === "") throw (errors.message = "Ingrese un mensaje");

    const message = await Message.create({
      message: content,
      from: req.userToken.username,
      to: to,
      status: false,
      private: true,
    });

    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

// Obtener Mensajes por Usuario
export const getMessages = async (req, res) => {
  const { to } = req.query;
  const errors = {};

  try {
    const otherUser = await User.findOne({ username: to });

    if (!otherUser) throw (errors.message = "Usuario no encontrado");

    const users = [req.userToken.username, otherUser.username];

    const messages = await Message.find({
      from: { $in: users },
      to: { $in: users },
    }).sort({ createdAt: "desc" });

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

// Obtener usuarios - grupos y sus ultimos mensajes
export const getUsersLastMessage = async (req, res) => {
  try {
    let users = await User.find(
      { _id: { $ne: req.userToken.id } },
      { password: 0, updatedAt: 0 }
    );

    let allUserMessages = await Message.find(
      {
        $or: [
          { from: req.userToken.username },
          { to: req.userToken.username },
        ]
      }
    ).sort({ 'createdAt': 'desc' });

    let usersMessage = [];

    users = users.map(otherUser => {
      let latestMessage = allUserMessages.find(
        m => m.from === otherUser.username || m.to === otherUser.username
      )
      let newUsuario = {
        _id: otherUser._id,
        name: otherUser.name,
        username: otherUser.username,
        createdAt: otherUser.createdAt,
        latestMessage: latestMessage ? latestMessage : null
      };
      usersMessage.push(newUsuario);
    });

    return res.status(200).json({ users: usersMessage });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};


// Obtener usuario y el ultimo fecha de conexcion
export const getUserLastTime = async (req, res) => {
  const { to } = req.query;

  try {
    let message = await Message.find({ from: to }).sort({ 'updatedAt': 'desc' }).limit(1);
    let user = await User.find({ username: to });
    const time = {};

    if (message.length > 0) {
      time.updatedAt = message[0].updatedAt
      time.username = message[0].from
    } else {
      time.updatedAt = user[0].updatedAt,
        time.username = user[0].username
    }

    return res.status(200).json({ message: time });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};


// Delete Mensaje
export const deleteMessage = async (req, res) => {
  const { idMessage } = req.query;
  const username = req.userToken.username;
  try {
    const message = await Message.findOneAndUpdate(
      {
        $and: [
          { _id: idMessage },
          { from: username },
        ]
      },
      {
        status: true
      }
    );

    if (message) {
      return res.status(200).json({ message: "Se elimino el mensaje" });
    }
    else {
      return res.status(400).json({ message: 'No tienes autorizacion' });
    }

  } catch (err) {
    return res.status(500).json({ error: err });
  }
};