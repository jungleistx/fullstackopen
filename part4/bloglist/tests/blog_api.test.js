const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, blogsInDb, initialBlogs } = require('./test_helper')
const testHelper = require('./test_helper')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithManyBlogs, listWithThreeBlogs } = require('../utils/list_helper')
const { favoriteBlog, mostBlogs, mostLikes, totalLikes } = require('../utils/list_helper')

const api = supertest(app)

describe('testing blogfunctions and api', () => {

  describe('tests not connecting to database', () => {
    test('dummy returns one', () => {
      const blogs = []

      const result = listHelper.dummy(blogs)
      assert.strictEqual(result, 1)
    })

    describe('favorite blog', () => {
      test('of empty list is 0', () => {
        assert.deepStrictEqual(favoriteBlog([]), 0)
      })

      test('in a list with one blog is correct', () => {
        assert.deepStrictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
      })

      test('in a list with many blogs is correct', () => {
        assert.deepStrictEqual(favoriteBlog(listWithManyBlogs), listWithManyBlogs[2])
      })
    })

    describe('most blogs', () => {
      test('of empty list is null', () => {
        assert.deepStrictEqual(mostBlogs([]), null)
      })

      test('in a list with one blog is correct', () => {
        const mostPopularAuthor = {
          author: 'Edsger W. Dijkstra',
          blogs: 1
        }

        assert.deepStrictEqual(mostBlogs(listWithOneBlog), mostPopularAuthor)
      })

      test('in a list with many blogs is correct', () => {
        const mostPopularAuthor = {
          author: 'Robert C. Martin',
          blogs: 3
        }

        assert.deepStrictEqual(mostBlogs(listWithManyBlogs), mostPopularAuthor)
      })
    })

    describe('most likes', () => {
      test('of empty list is null', () => {
        assert.deepStrictEqual(mostLikes([]), null)
      })

      test('in a list with one blog is correct', () => {
        const mostPopularAuthor = {
          author: 'Edsger W. Dijkstra',
          likes: 5
        }

        assert.deepStrictEqual(mostLikes(listWithOneBlog), mostPopularAuthor)
      })

      test('in a list with many blogs is correct', () => {
        const mostPopularAuthor = {
          author: 'Edsger W. Dijkstra',
          likes: 17
        }

        assert.deepStrictEqual(mostLikes(listWithManyBlogs), mostPopularAuthor)
      })

      test('in a list where one blog has most likes', () => {
        const mostPopularAuthor = {
          author: 'Michael Chan',
          likes: 75
        }

        assert.deepStrictEqual(mostLikes(listWithThreeBlogs), mostPopularAuthor)
      })
    })

    describe('total likes', () => {
      test('of empty list is zero', () => {
        assert.strictEqual(totalLikes([]), 0)
      })

      test('when list has only one blog equals to likes'), () => {
        assert.strictEqual(totalLikes(listWithOneBlog), 5)
      }

      test('of bigger list is calculated correctly', () => {
        assert.strictEqual(totalLikes(listWithManyBlogs), 36)
      })
    })
  })

  describe('tests connecting to database', () => {
    beforeEach(async () => {
      await resetDb()
    })

    describe('get all blogs', () => {
      test('correct amount of blogs is returned as json', async () => {
        const response = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
      })
    })

    describe('verify id', () => {
      test('blogs have id instead of _id', async () => {
        const response = await api
          .get('/api/blogs')
          .expect(200)

        const blog = response.body[0]
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
      })
    })

    describe('adding new blog', () => {
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

      test('missing likes property defaults to 0', async () => {
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

      test('fails with missing title property', async () => {
        const newBlog = {
          author: 'Test Author',
          url: 'www.missingtitle.com',
          likes: 15
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
      })

      test('fails with missing url property', async () => {
        const newBlog = {
          title: 'Blog missing url',
          author: 'Test Author',
          likes: 10
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})