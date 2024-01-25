import { useState } from 'react'

const Blog = ({ blog }) => {
  const blogStyle = {
    padding: 5,
    border: '1px solid',
    margin: '2px'
  }
  const [fullView, setFullView] = useState(false)

  const toggleFullView = () => { setFullView(!fullView)}

  if (fullView) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleFullView}>hide</button><br/>
        {blog.url}<br/>
        {blog.likes} <button>like</button><br/>
        {blog.user.name}
      </div>
    )
  }
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleFullView}>view</button><br/>
    </div>
  )
}

export default Blog