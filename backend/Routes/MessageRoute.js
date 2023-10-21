import express from 'express';
import { addMessage, getMessages } from '../Controller/MessageController.js';

const route=express.Router();

route.post('/',addMessage);
route.get('/:chatId',getMessages);

export default route;