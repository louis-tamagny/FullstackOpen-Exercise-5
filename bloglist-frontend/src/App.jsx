import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import ErrorMessage from './components/ErrorMessage'
import blogService from './services/blogs'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const displayMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/login', {username: username, password: password})
      console.log(response.data)
      if (response.data) {
        setUser(response.data)
        setUsername('')
        setPassword('')
      }
    } catch (error) {
      displayMessage(error.response.data.error)
    }
  }

  if (user === null) {
    return (
      <div>
        <ErrorMessage message={message}/>
        <h2>Log in to application</h2>
        <form type='submit' onSubmit={handleLogin}>
          <label>Username: </label>
          <input id='username' value={username} onChange={({target}) => setUsername(target.value)} type='text'></input><br/>
          <label>Password: </label>
          <input id='password' value={password} onChange={({target}) => setPassword(target.value)} type='password'></input><br/>
          <input id='login' type='submit' value='Login'></input>
        
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App