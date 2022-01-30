import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import Pusher from "pusher";

import rutas from './rutas/index.js';
import { PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, PUSHER_APPID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } from './config.js';

// App Config
const app = express();
const port = PORT;

const pusher = new Pusher({
    appId: PUSHER_APPID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true
});

// Midlewares
app.use(cors());
app.use(express.json());

// DB Config
const mongoURI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.zip0t.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI);

mongoose.connection.once('open', () => {
    console.log('DB Connected');

    const changeStream = mongoose.connection.collection('Message').watch();
    changeStream.on('change', (change) => {
        pusher.trigger('messages', 'newMessage', {
            'change': change
        });
    });
});

// Rutas
app.get('/', (req, res) => res.status(200).json({ msg: "I message Backend" }));
app.use('/api/message', rutas);

// Listen
app.listen(port, () => console.log(`Listening on Localhost: ${port}`));