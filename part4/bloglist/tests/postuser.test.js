const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetUserDb, usersInDb } = require('./test_helper')

const api = supertest(app)

describe('adding new user', () => {

  beforeEach(async () => {
    await resetUserDb()
  })

  test('succeeds with valid data', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'testuser',
      password: 'validpw'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('testuser'))
  })

  test('fails when password too short', async () => {
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send({ username: 'testuser', password: 'ab' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('password must be atleast 3 characters'))
  })

  test('fails when username too short', async () => {
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send({ username: 'te', password: 'abcd' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('validation failed: username'))
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
