import express from 'express';
import { addMessage, getMessages } from '../Controller/MessageController.js';

const route=express.Router();

route.post('/',addMessage);
route.get("/:chatId/:senderId", getMessages);

export default route;