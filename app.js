 
import express from "express";
import mongoose from "mongoose";
import upload from "./middleware/upload.js";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import { mongo_URI } from "./client/js/config/app-keys.js";

mongoose.connect(mongo_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB is connected...'))
  .catch(err => console.log(err));

export const app = express();


app.use(cors());
// app.options('/*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   res.next();
// });

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/', express.static('client'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.use(upload.single('image'));
app.post('/uploads', (req, res) => {
    console.log(req.file);
    res.status(201).json(req.file.path);
});
