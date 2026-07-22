const assert = require('node:assert')
const { test, after, beforeEach, before, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, blogsInDb, resetUserDb, getTokenUserId, postNewBLog, createUser, getToken } = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

let tokenForDelete = null
let userId = null
let blogToDelete = null

describe('deleting a blog', () => {

  before(async () => {
    await resetUserDb()
    tokenForDelete = await getToken('root', 'mysterypw')
    userId = await getTokenUserId(tokenForDelete)
  })

  beforeEach(async () => {
    await resetDb()
    blogToDelete = await postNewBLog(tokenForDelete)
  })


  test('succeeds 204 with valid data', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenForDelete}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    const ids = blogsAtEnd.map(b => b.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })


  test('succeeds 204 and deleted from user.blogs', async () => {
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenForDelete}`)
      .expect(204)

    const user = await User.findById(userId)
    assert(!user.blogs.includes(blogToDelete.id))
  })


  test('fails 400 with invalid id', async () => {
    const blogsAtStart = await blogsInDb()

    const result = await api
      .delete('/api/blogs/wrong')
      .set('Authorization', `Bearer ${tokenForDelete}`)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert(result.body.error.includes('malformatted id'))
  })


  test('fails 401 with wrong token', async () => {
    const blogsAtStart = await blogsInDb()
    const wrongToken = 'randomwrongtoken'

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    assert(result.body.error.includes('token invalid'))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })


  test('fails 401 with no token', async () => {
    const blogsAtStart = await blogsInDb()

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    assert(result.body.error.includes('token invalid'))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })


  test('fails 401 with wrong user', async () => {
    const blogsAtStart = await blogsInDb()
    await createUser('toor', 'randompw')
    const wrongToken = await getToken('toor', 'randompw')

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert(result.body.error.includes('unauthorized to delete this blog'))
  })


  test('fails 404 when wrong url', async () => {
    const blogsAtStart = await blogsInDb()

    const result = await api
      .delete(`/api/noexist/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenForDelete}`)
      .expect(404)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert(result.body.error.includes('unknown endpoint'))
  })


  after(async () => {
    await mongoose.connection.close()
  })
})
