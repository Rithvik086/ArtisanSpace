import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authroutes from "./routes/authroutes.js"
import useroutes from './routes/userRoutes.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '../.env') });

import dbConnect from './config/dbconnect.js';

dbConnect();

const app = express();
const port = 3000;
const hostname = '127.0.0.1';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.set('view engine', 'ejs');

app.get(['/signup', '/'], (req, res) => {
  res.render('auth', { page: 'signup' });
});

app.get('/login', (req, res) => {
  res.render('auth', { page: 'login' });
});



 app.use('/auth',authroutes)
 app.use('/users',useroutes)

// Starts an Express server locally on port 3000
app.listen(port, hostname, () => {
  console.log(`Listening on http://${hostname}:${port}/`);
});
