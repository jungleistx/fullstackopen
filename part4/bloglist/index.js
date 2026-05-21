const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
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

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})