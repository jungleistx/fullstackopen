import { useState } from 'react'


const Blog = ({ blog, updateLike, user, deleteBlog }) => {
  const [isShown, setIsShown] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteStyle = {
    background: 'red',
    border: 'solid',
    borderWidth: 1,
    margin: 5,
  }

  const buttonText = isShown ? 'hide' : 'view'
  const showDelete = user.username === blog.user.username ? true : false

  const addLike = () => {
    updateLike(blog)
  }

  const clickDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }


  return (
    <>
      {!isShown &&
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setIsShown(!isShown)}>{buttonText}</button>
        </div>
      </div>
      }

      {isShown &&
      <div style={blogStyle}>
        <div>
          <div>{blog.title}
            <button onClick={() => setIsShown(!isShown)}>{buttonText}</button>
          </div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
            <button onClick={addLike}>like</button>
          </div>
          <div>{blog.author}</div>
          {showDelete &&
            <button style={deleteStyle} onClick={clickDelete}>
              delete
            </button>
          }
        </div>
      </div>
      }
    </>
  )}

export default Blog
