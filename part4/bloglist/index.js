const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
require('dotenv').config()

const app = express()


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

logger.info('connecting to', mongoUrl)

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})