import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()

    handleCreateBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return  (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={createBlog}>
        title:<input id='titleInput' type='text' value={title} onChange={({ target }) => setTitle(target.value)}/><br/>
        author:<input id='authorInput' type='text' value={author} onChange={({ target }) => setAuthor(target.value)}/><br/>
        url:<input id='urlInput' type='text' value={url} onChange={({ target }) => setUrl(target.value)}/><br/>
        <input id='submitInput' type='submit' value='create'/>
      </form>
    </div>
  )
}

BlogForm.proptypes = {
  handleCreateBlog: PropTypes.func.isRequired
}

export default BlogForm