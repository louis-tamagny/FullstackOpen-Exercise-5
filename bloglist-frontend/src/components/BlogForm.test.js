import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

test('right props are given to the event handler', async () => {
  userEvent.setup()
  const handleCreateBlog = jest.fn()

  const container = render(<BlogForm handleCreateBlog={ handleCreateBlog }/>).container

  await userEvent.type(container.querySelector('#titleInput'), 'a new blog')
  await userEvent.type(container.querySelector('#authorInput'), 'a new author')
  await userEvent.type(container.querySelector('#urlInput'), 'a new url')

  await userEvent.click(container.querySelector('#submitInput'))

  expect(handleCreateBlog.mock.calls).toHaveLength(1)
  expect(handleCreateBlog.mock.calls[0][0]).toStrictEqual({ title:'a new blog', author:'a new author', url:'a new url' })
})
