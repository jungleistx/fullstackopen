const LoginForm = (p) => (
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
)

export default LoginForm