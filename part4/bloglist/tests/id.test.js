const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb } = require('./test_helper')

const api = supertest(app)

describe('verify id', () => {

  beforeEach(async () => {
    await resetDb()
  })


  test('blogs have id instead of _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)

    const blog = response.body[0]
    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
