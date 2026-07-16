const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


const randomUser = async () => {
  const users = await User.find({})
  const randomIndex = Math.floor(Math.random() * users.length)
  return users[randomIndex]
}


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const newUser = await randomUser()
  if (!newUser) {
    return response.status(400).json({ error: 'no users in database' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: newUser
  })

  const savedBlog = await blog.save()

  newUser.blogs = newUser.blogs.concat(savedBlog._id)
  await newUser.save()

  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
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