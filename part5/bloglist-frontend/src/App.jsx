import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState({})

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs => (
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  )
}, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = (loggedUser) => {
    setUser(loggedUser)
    setNotificationMessage({
      message: 'login successfull',
      type: 'success'
    })
    setTimeout(() => {
      setNotificationMessage({})
    }, 5000)
  }


  const failedLogin = () => {
    setNotificationMessage({
      message: 'wrong credentials',
      type: 'error'
    })
    setTimeout(() => {
      setNotificationMessage({})
    }, 5000)
  }


  const handleLogout = () => {
      setUser(null)
      window.localStorage.removeItem('loggedBlogappUser')
  }


  const addBlog = async (newBlog) => {
    setBlogs(blogs.concat(newBlog))
    blogFormRef.current.toggleVisibility()
    setNotificationMessage({
      message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: 'success'
    })
    setTimeout(() => {
      setNotificationMessage({})
    }, 5000)
  }


  const updateBlogLike = async (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id
    }
    try {
      const returnedBlog = await blogService.update(updatedBlog)
      const updatedBlogs = blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b)
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    }
    catch {
      setNotificationMessage({
        message: 'liked but not registered',
        type: 'error'
      })
      setTimeout(() => {
        setNotificationMessage({})
      }, 5000)
    }
  }


  const deleteBlog = async (blogToDelete) => {
    await blogService.deleteBlog(blogToDelete)

    setBlogs(blogs.filter((b) => b.id !== blogToDelete.id))
  }

  return (
    <div>
      <Notification
        message={notificationMessage.message}
        type={notificationMessage.type}
      />

      {user &&
        <>
          <h2>blogs</h2>
          <p>{user.username} logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              concatNewBlog={addBlog}
            />
          </Togglable>

          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateLike={updateBlogLike}
              user={user}
              deleteBlog={deleteBlog}
            />
          )}
        </>
      }

      {!user &&
        <LoginForm
          setUser={handleLogin}
          failedLogin={failedLogin}
        />
      }
    </div>
  )
}

export default App