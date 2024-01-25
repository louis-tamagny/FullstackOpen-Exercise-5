import { useState } from 'react'

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
        title:<input type='text' value={title} onChange={({ target }) => setTitle(target.value)}/><br/>
        author:<input type='text' value={author} onChange={({ target }) => setAuthor(target.value)}/><br/>
        url:<input type='text' value={url} onChange={({ target }) => setUrl(target.value)}/><br/>
        <input type='submit' value='create'/>
      </form>
    </div>
  )
}

export default BlogForm