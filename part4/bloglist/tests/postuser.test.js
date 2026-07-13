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


  test.only('succeeds with valid data', async () => {
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

    console.log('usersAtEnd', usersAtEnd);

    assert.strictEqual(usersAtEnd.length, 2)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('testuser'))
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
