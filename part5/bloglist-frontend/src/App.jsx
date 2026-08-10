import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      // blogService.setToken(user.token)
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
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch {
      console.log('wrong credentials');
      // setErrorMessage('wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  return (
    <div>
      {user &&
        <>
          <h2>blogs</h2>
          <p>{user.username} logged in</p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      }

      {!user &&
        <>
          <h2>log in to the application</h2>
          <LoginForm
            onSubmit={handleLogin}
            username={username}
            usernameChange={handleUsernameChange}
            password={password}
            passwordChange={handlePasswordChange}
          />
        </>
      }
    </div>
  )
}

export default App