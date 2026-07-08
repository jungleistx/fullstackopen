const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, blogsInDb, initialBlogs } = require('./test_helper')

const api = supertest(app)

describe('adding new blog', () => {

  beforeEach(async () => {
    await resetDb()
  })


  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Blog to add, trying comma',
      author: 'Peter Addington',
      url: 'www.newblog.com',
      likes: 1001
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Blog to add, trying comma'))
  })


  test ('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: 'Blog missing likes',
      author: 'Peter Addington',
      url: 'www.newblog.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
