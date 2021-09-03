import express from "express";
import upload from "./middleware/upload.js";
import cors from "cors";

export  const app = express();


app.use(cors());
app.use(express.json());

  app.get('/', (req, res) => {
    // res.json('Server works...');
    res.sendFile('index.html', { root: 'client' });
});


app.use('/uploads', express.static('uploads'));
app.use('/', express.static('client'));

app.use(upload.single('image'));
app.post('/uploads', (req, res) => {
    console.log(req.file);
    res.status(201).json(req.file.path);
});