const express = require('express');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const config = require('./utils/config');
const loginRouter = require('./controllers/login')
require('express-async-errors')


app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/login', loginRouter)


mongoose.connect(config.mongoUrl,
    {useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, useCreateIndex: true})
    .then(() => {
      logger.info('connected to MongoDB ');
    })
    .catch((error) => {
      logger.info('error connecting to MongoDB:', error.message);
    });

const blogsRouter = require('./controllers/blogs');
app.use('/api/blogs', blogsRouter);
const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
