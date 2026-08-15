import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = (p) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (e) => {
    e.preventDefault()

    const returnedBlog = await blogService.create({ title, author, url })
    p.concatNewBlog(returnedBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
      <div>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
    </>
  )
}

export default BlogForm