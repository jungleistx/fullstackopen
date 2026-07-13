const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'First title of blog',
    author: 'Mary Firston',
    url: 'www.firsturl.net',
    likes: 72
  },
  {
    title: 'Second title of blog',
    author: 'Jonh Segunda',
    url: 'www.segunda.inet',
    likes: 21
  }
]


const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Random title',
    author: 'Jonh Doe',
    url: 'www.random.inet',
    likes: 10
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


const resetDb = async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
}


const resetUserDb = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('mysterypw', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  resetDb,
  resetUserDb,
  usersInDb
}