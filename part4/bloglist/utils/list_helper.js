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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}