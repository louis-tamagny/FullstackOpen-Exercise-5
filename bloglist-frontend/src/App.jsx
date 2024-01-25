import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageColor, setMessageColor] = useState('red')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser !== null) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const displayMessage = (text, color) => {
    setMessage(text)
    setMessageColor(color)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/login', { username: username, password: password })
      console.log(response.data)
      if (response.data) {
        setUser(response.data)
        setUsername('')
        setPassword('')
        window.localStorage.setItem('loggedInUser', JSON.stringify(response.data))
        displayMessage('Login successful !', 'green')
      }
    } catch (error) {
      displayMessage(error.response.data.error, 'red')
    }
  }
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    displayMessage('Logout successful !', 'green')
  }

  const blogFormRef = useRef()

  const handleCreateBlog = async (newBlog) => {
    try {
      const response = await axios.post('/api/blogs',
        newBlog,
        { headers: { 'Authorization': 'Bearer '+ user.token } })

      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(response.data))
      displayMessage(`a new blog ${response.data.title} by ${response.data.author} added`, 'green')

    } catch (error) {
      displayMessage(error.response.data.error, 'red')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} color={messageColor}/>
        <h2>Log in to application</h2>
        <form type='submit' onSubmit={handleLogin}>
          <label>Username: </label>
          <input value={username} onChange={({ target }) => setUsername(target.value)} type='text'></input><br/>
          <label>Password: </label>
          <input value={password} onChange={({ target }) => setPassword(target.value)} type='password'></input><br/>
          <input type='submit' value='Login'></input>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} color={messageColor}/>
      <h2>blogs</h2>
      <p>{user.name} logged in
        <button onClick={handleLogout}>Logout</button>
      </p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App