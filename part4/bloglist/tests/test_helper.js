const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')

const api = supertest(app)


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


const createUser = async (username, pw) => {
  const passwordHash = await bcrypt.hash(pw, 10)
  const user = new User({ username: username, passwordHash })

  await user.save()

  return user
}


const resetUserDb = async () => {
  await User.deleteMany({})
  await createUser('root', 'mysterypw')
}


const getToken = async (username, pw) => {
  const result = await api
    .post('/api/login')
    .send({ username: username, password: pw })

  return result.body.token || null
}


const getTokenUserId = async (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET)

  return decodedToken.id || null
}


const postNewBLog = async (token) => {
  const newBlog = {
    title: 'Blog from test',
    author: 'Peter Teston',
    url: 'www.testblog.com',
    likes: 247
  }

  const result = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  return result.body || null
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  resetDb,
  resetUserDb,
  usersInDb,
  getToken,
  getTokenUserId,
  postNewBLog,
  createUser
}