const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, blogsInDb, initialBlogs } = require('./test_helper')

const api = supertest(app)

describe('deleting a blog', () => {

  beforeEach(async () => {
    await resetDb()
  })


  test.only('succeeds 204 with valid id', async () => {
    const blogsAtStart = await blogsInDb()


    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenForDelete}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const user = await User.findById(userId)
    assert(!user.blogs.includes(blogToDelete.id))
  })


  test('fails 400 with invalid id', async () => {
    await api
      .delete('/api/blogs/wrong')
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
