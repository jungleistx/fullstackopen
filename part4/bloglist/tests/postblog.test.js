const assert = require('node:assert')
const { test, after, beforeEach, before, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, blogsInDb, initialBlogs, resetUserDb, getTokenUserId, getToken } = require('./test_helper')

const api = supertest(app)

let token = null
let userId = null

describe('adding new blog', () => {

  before(async () => {
    await resetUserDb()
    token = await getToken('root', 'mysterypw')
    userId = await getTokenUserId(token)
  })

  beforeEach(async () => {
    await resetDb()
  })


  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Blog to add',
      author: 'Peter Addington',
      url: 'www.newblog.com',
      likes: 1001
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Blog to add'))

    assert.strictEqual(userId, result.body.user)
  })


  test('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: 'Blog missing likes',
      author: 'Peter Addington',
      url: 'www.newblog.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
    assert.strictEqual(response.body.user, userId)
  })


  test('fails with missing title property', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'www.missingtitle.com',
      likes: 15
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert(result.body.error.includes('Path `title` is required'))
  })


  test('fails with missing url property', async () => {
    const newBlog = {
      title: 'Blog missing url',
      author: 'Test Author',
      likes: 10
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert(result.body.error.includes('Path `url` is required'))
  })


  test('fails with invalid token', async () => {
    const newBlog = {
      title: 'Blog to fail',
      author: 'Peter Nottington',
      url: 'www.failblog.com',
      likes: 10
    }
    const invalidToken = 'randominvalidstring'

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('token invalid'))
    assert(!result.body.user)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  test('fails when posting to wrong url', async () => {
    const newBlog = {
      title: 'Blog to disappear',
      author: 'Peter Missington',
      url: 'www.lostblog.com',
      likes: 4040
    }

    const result = await api
      .post('/api/wrongurl')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(404)

    assert(result.body.error.includes('unknown endpoint'))

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
