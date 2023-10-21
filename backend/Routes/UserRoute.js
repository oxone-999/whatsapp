import express from 'express'
import { deleteUser, getAllUser, getUser, updateUser } from '../Controller/UserController.js';
const route = express.Router();

route.get('/', getAllUser)
route.get("/:id", getUser);
route.put("/:id", updateUser);
route.delete("/:id", deleteUser);



export default route;