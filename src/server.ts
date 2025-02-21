import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './lib/db';
import authRouter from './routes/auth.router';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import folderRouter from './routes/folder.router';
import fileRouter from './routes/file.router';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Welcome to Storage Managemant System!');
});

// routes
app.use('/api/auth', authRouter);
app.use("/api/folder",folderRouter);
app.use("/api/file",fileRouter);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})

