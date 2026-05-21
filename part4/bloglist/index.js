const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
const app = express()
const config = require('./utils/config')


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch(error => {
    logger.error('error connecting to mongoDB', error.message)
  })


app.use(express.json())

app.use('/api/blogs', blogsRouter)


const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})