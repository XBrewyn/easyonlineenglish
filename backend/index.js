require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const routers = require('./routers');
const middlewareToken = require('./middleware/token');
const initialDatabase = require('./initialDatabase');
const connectToDatabase = require('./db');

const app = express();
const BUILD_PATH = './build';
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middlewareToken);
app.use('/api/v1', routers);

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', "img-src 'self' data: *");
  next();
});

app.use(express.static(path.join(__dirname, BUILD_PATH)));

// Server React SPA
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  connectToDatabase().then(() => {
    initialDatabase();
  });
});
