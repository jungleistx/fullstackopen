const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: decodedToken.id
  })

  const savedBlog = await blog.save()
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  // remove the blog from user.blogs
  const user = await User.findById(decodedToken.id)
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()

  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const filter = request.params.id
  const update = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    filter,
    update,
    { returnDocument: 'after' }
  )

  response.status(200).json(updatedBlog)
})


module.exports = blogsRouter