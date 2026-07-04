const Blog = require('../models/blog')


const initialBlogs = [
  {
    title: 'First title of blog',
    author: 'Mary Firston',
    url: 'www.firsturl.net',
    likes: 72
  },
  {
    title: 'Second title of blog',
    author: 'Jonh Segunda',
    url: 'www.segunda.inet',
    likes: 21
  }
]


const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Random title',
    author: 'Jonh Doe',
    url: 'www.random.inet',
    likes: 10
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}