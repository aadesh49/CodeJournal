import cors from 'cors';
import express from 'express'
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { User } from './models/User.model.js';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })
import fs from 'fs'
import { Post } from './models/Post.model.js';
import dotenv from 'dotenv';
dotenv.config();

//file
import path from 'path';
import { fileURLToPath } from 'url';

//for encryption of data
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(saltRounds);

const app = express();

//to allow this origin to be used
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use(express.json())
app.use(cookieParser())
// app.use('/uploads', express.static(__dirname + '/uploads'))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//to connect the Database
mongoose.connect(process.env.MONGODB_URL);

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body
    try {
        const newUser = await User.create({ username, email, password: bcrypt.hashSync(password, salt) });
        res.json(newUser);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    const userDoc = await User.findOne({ username });
    const checkPassword = bcrypt.compareSync(password, userDoc.password);

    if (checkPassword) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        })
    } else {
        res.status(400).json("Wrong credentials");
    }
})

app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            // If the token is invalid or expired
            return res.status(403).json({ message: 'Invalid Token', error: err });
        }

        // Send user info if token is valid
        res.json(info);
    });
})

app.post('/logout', async (req, res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', upload.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ex = parts[parts.length - 1];
    const newPath = path + '.' + ex
    fs.renameSync(path, newPath);

    const token = req.cookies.token;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            // If the token is invalid or expired
            return res.status(403).json({ message: 'Invalid Token', error: err });
        }
        const { title, summary, content } = req.body;
        try {
            const postDoc = await Post.create({
                title, summary, content, image: newPath, author: info.id
            });
            res.json(postDoc);
        } catch (e) {
            res.status(400).json(e);
        }
    });

})

/* app.put('/post', upload.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      console.log(postDoc);
      
      await postDoc.update({
        title,
        summary,
        content,
        image: newPath ? newPath : postDoc.image,
      });
  
      res.json(postDoc);
    });
  
  }); */

app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params                         //as we are on post page, we can access id from url(params)
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json({ postDoc })
})

app.listen(4000, () => console.log("Server running on port 4000"));