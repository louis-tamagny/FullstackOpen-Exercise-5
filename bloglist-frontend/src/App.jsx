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

  const sortBlogs = () => blogs.sort((a, b) => { return b.likes - a.likes })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/login', { username: username, password: password })
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
      const completeNewUser = response.data
      completeNewUser.user = { username: user.username, name: user.name, id: user.id }
      setBlogs(blogs.concat(completeNewUser))
      displayMessage(`a new blog ${response.data.title} by ${response.data.author} added`, 'green')

    } catch (error) {
      displayMessage(error.response.data.error, 'red')
    }
  }

  const handleLike = async (blog) => {
    try {
      await axios.put(`/api/blogs/${blog.id}`,
        { ...blog, likes: blog.likes + 1 },
        { headers: { 'Authorization': 'Bearer '+ user.token } })

      blog.likes++
      displayMessage(`likes for ${blog.title} have been updated : ${blog.likes}`, 'green')
    } catch (error) {
      displayMessage(error.response.data.error, 'red')
    }
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {return null}

    try {
      console.log('trying to delete', blog)
      await axios.delete(`/api/blogs/${blog.id}`,
        { headers: { 'Authorization': 'Bearer '+ user.token } })
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      displayMessage(`${blog.title} was deleted successfully`, 'green')
    } catch (error) {
      displayMessage(error.response.data.error, 'red')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} color={messageColor}/>
        <h2>Log in to application</h2>
        <form id='loginForm' type='submit' onSubmit={handleLogin}>
          <label>Username: </label>
          <input id='usernameInput' 
            value={username} 
            onChange={({ target }) => setUsername(target.value)} 
            type='text'
          ></input><br/>
          <label>Password: </label>
          <input id='passwordInput' 
            value={password} 
            onChange={({ target }) => setPassword(target.value)} 
            type='password'
          ></input><br/>
          <input id='loginFormSubmit' type='submit' value='Login'></input>
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
      {sortBlogs().map(blog =>
        <Blog key={blog.id} blog={blog}
          handleLike={() => handleLike(blog) }
          handleRemove={() => handleRemove(blog) } />
      )}
    </div>
  )
}

export default App