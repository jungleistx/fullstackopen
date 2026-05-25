const _ = require('lodash')


const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return 0

  return blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  })
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return null

  const counts = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys(counts), author => counts[author])

  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}