import express from 'express';
import { createChat, findChat, userChat } from '../Controller/ChatController.js';

const route = express.Router();
route.post('/', createChat);
route.get('/:userId', userChat);
route.get('/find/:firstId/:secondId', findChat);
export default route;