const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
const app = express()


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

logger.info('connecting to', mongoUrl)

app.use('/api/blogs', blogsRouter)


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})