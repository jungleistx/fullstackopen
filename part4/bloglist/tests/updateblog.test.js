const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, blogsInDb, initialBlogs } = require('./test_helper')

const api = supertest(app)

describe('updating a blog', () => {

  beforeEach(async () => {
    await resetDb()
  })


  test('ok 200 updating title with valid id', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newTitle = 'Changed title'

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ title: newTitle })
      .expect(200)

    assert.notDeepStrictEqual(response.body, blogToUpdate)
    assert.strictEqual(response.body.title, newTitle)

    const blogsAtEnd = await blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newTitle))
  })


  test('ok 200 updating likes with valid id', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = 1000

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikes })
      .expect(200)

    assert.notDeepStrictEqual(response.body, blogToUpdate)
    assert.strictEqual(response.body.likes, newLikes)

    const blogsAtEnd = await blogsInDb()
    const likes = blogsAtEnd.map(b => b.likes)
    assert(likes.includes(newLikes))
  })


  test('ok 200 updating multiple fields with valid id', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = 1001
    const newUrl = 'www.newurl.es'

    const newBlog = {
      url: newUrl,
      likes: newLikes,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    assert.strictEqual(response.body.id, blogToUpdate.id)
    assert.strictEqual(response.body.likes, newLikes)
    assert.strictEqual(response.body.url, newUrl)

    assert.notDeepStrictEqual(response.body, blogToUpdate)

    const blogsAtEnd = await blogsInDb()
    const urls = blogsAtEnd.map(b => b.url)
    assert(urls.includes(newUrl))
    const likes = blogsAtEnd.map(b => b.likes)
    assert(likes.includes(newLikes))
  })


  test('router returns updated data', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = 1000
    const newTitle = 'Updated title'
    const originalUrl = blogToUpdate.url
    const originalAuthor = blogToUpdate.author

    const newBlog = {
      likes: newLikes,
      title: newTitle
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, newLikes)
    assert.strictEqual(response.body.title, newTitle)
    assert.strictEqual(response.body.url, originalUrl)
    assert.strictEqual(response.body.author, originalAuthor)

    const blogsAtEnd = await blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newTitle))
    const urls = blogsAtEnd.map(b => b.url)
    assert(urls.includes(originalUrl))
  })


  test('blog amount unchanged', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ title: 'New length title' })
      .expect(200)

    assert.notDeepStrictEqual(response.body, blogToUpdate)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  test('blog unchanged when sent empty body', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({})
      .expect(200)

    assert.deepStrictEqual(response.body, blogToUpdate)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  test('fails 400 with invalid id', async () => {
    await api
      .put('/api/blogs/wrongid')
      .send({ author: 'Failing Authorr' })
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  test('blog unchanged with nonexistent field', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ random: 'Nonexisting field' })
      .expect(200)

    assert.deepStrictEqual(response.body, blogToUpdate)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
