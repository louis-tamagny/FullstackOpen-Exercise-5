import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const blogStyle = {
    padding: 5,
    border: '1px solid',
    margin: '2px'
  }
  const [fullView, setFullView] = useState(false)

  const toggleFullView = () => { setFullView(!fullView)}

  if (fullView) {
    return (
      <div className='blog' style={blogStyle}>
        <div id="titleAuthor">{blog.title} {blog.author}</div>
        <button id="viewButton" onClick={toggleFullView}>hide</button><br />
        <div id="url">{blog.url}</div>
        <div id="likes">likes {blog.likes}</div><button className='likeButton' onClick={ handleLike }>like</button><br />
        {blog.user.name}<br />
        <button 
          style={{ display: (blog.user.name === JSON.parse(window.localStorage.getItem('loggedInUser')).name)? '' : 'none',
            backgroundColor: 'lightblue' }}
          className='deleteButton'
          onClick={ handleRemove }
        >remove</button>
      </div>
    )
  }
  return (
    <div className='blog' style={blogStyle}>
      <div id="titleAuthor">{blog.title} {blog.author}</div>
      <button className="viewButton" onClick={toggleFullView}>view</button><br/>
    </div>
  )
}

Blog.proptypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog