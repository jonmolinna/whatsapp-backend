import express from 'express';
const router = express.Router();

import { verifyToken } from '../util/token.js';
import { createUser, login } from '../controllers/user.controller.js';
import { createMessage, getMessages } from '../controllers/message.controller.js';

// Users (Auth)
router.post('/addUser', createUser);
router.post('/login', login);

// Messages
router.post('/sendMessage', verifyToken, createMessage);
router.get('/getMessages', verifyToken, getMessages);


export default router;