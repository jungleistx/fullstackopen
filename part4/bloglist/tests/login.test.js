const assert = require('node:assert')
const { test, after, before, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetUserDb } = require('./test_helper')

const api = supertest(app)


describe('login user', () => {

  before(async () => {
    await resetUserDb()
  })


  test('success root user with valid pw', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'mysterypw' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(result.body.token)
    assert.strictEqual(result.body.username, 'root')
  })


  test('fails root user with wrong pw', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(!result.body.token)
    assert(result.body.error.includes('invalid username or password'))
  })


  test('fails with nonexistent user', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'nouser', password: 'random' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(!result.body.token)
    assert(result.body.error.includes('invalid username or password'))
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
