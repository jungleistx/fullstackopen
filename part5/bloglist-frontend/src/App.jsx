import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({})


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      console.log('user in handlelogin', user);
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage({
        message: 'login successfull',
        type: 'success'
      })
      setTimeout(() => {
        setNotificationMessage({})
      }, 5000)
    }
    catch {
      console.log('wrong credentials');
      setNotificationMessage({
        message: 'wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotificationMessage({})
      }, 5000)
    }
  }


  const handleLogout = () => {
      setUser(null)
      setUsername('')
      setPassword('')
      window.localStorage.removeItem('loggedBlogappUser')
  }


  const addBlog = async (blogObject) => {
    console.log('blogObject', blogObject);
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNotificationMessage({
      message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      type: 'success'
    })
    setTimeout(() => {
      setNotificationMessage({})
    }, 5000)
  }


  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
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
          <BlogForm
            createBlog={addBlog}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      }

      {!user &&
        <LoginForm
          onSubmit={handleLogin}
          username={username}
          usernameChange={handleUsernameChange}
          password={password}
          passwordChange={handlePasswordChange}
        />
      }
    </div>
  )
}

export default App