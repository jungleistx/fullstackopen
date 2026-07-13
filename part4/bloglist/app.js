const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const app = express()
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch(error => {
    logger.error('error connecting to mongoDB', error.message)
  })


app.use(express.json())

app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app