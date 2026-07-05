const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { resetDb } = require('./test_helper')

const api = supertest(app)

describe('get all blogs', () => {

  beforeEach(async () => {
    await resetDb()
  })


  test('correct amount of blogs is returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
