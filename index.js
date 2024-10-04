
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoute');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));
  
// Express session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(cookieParser());


app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`))