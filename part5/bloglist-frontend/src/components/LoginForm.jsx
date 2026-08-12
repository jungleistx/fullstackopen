const LoginForm = (p) => (
  <div>
    <h2>Log in to the application</h2>

    <form onSubmit={p.onSubmit}>
      <div>
        <label>
          username
          <input
            type="text"
            value={p.username}
            onChange={p.usernameChange}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={p.password}
            onChange={p.passwordChange}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)

export default LoginForm