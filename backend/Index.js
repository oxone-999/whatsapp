import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import CharRoute from './Routes/ChatRoute.js';
import MessageRoute from './Routes/MessageRoute.js';
dotenv.config();
const app = express();

app.use(bodyParser.json({extended: true }));
app.use(bodyParser.urlencoded({extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }).
then(() => app.listen(process.env.PORT, () => console.log(`listenting at ${process.env.PORT}`))).
catch((error) => {
    console.log(error.message);
})

app.use('/api/auth', AuthRoute);
app.use('/api/users', UserRoute);
app.use('/api/chat', CharRoute);
app.use('/api/message', MessageRoute);
