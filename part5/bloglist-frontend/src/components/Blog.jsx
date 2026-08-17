import { useState } from "react"


const Blog = ({ blog, updateLike }) => {
  const [isShown, setIsShown] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonText = isShown ? 'hide' : 'view'

  const addLike = () => {
    updateLike(blog)
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
        </div>
      </div>
    }
    </>
)}

export default Blog
