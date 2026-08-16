import { useState } from "react"
import loginService from '../services/login'
import blogService from '../services/blogs'


const LoginForm = (p) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const loginUser = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      p.setUser(user)
      setUsername('')
      setPassword('')
    }
    catch {
      p.failedLogin()
    }
  }

  return (
    <div>
      <h2>Log in to the application</h2>

      <form onSubmit={loginUser}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm