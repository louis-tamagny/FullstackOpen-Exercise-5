import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import '@testing-library/jest-dom'

describe('<Blog /> is rendered', () => {
  let container

  const handleLike = jest.fn()
  const handleRemove = jest.fn()

  beforeEach(() => {
    container = render(<Blog
      blog={{ title:'blog title', author:'blog author', likes: 0, url:'blog url', user:{ name:'user name' } }}
      handleLike={handleLike}
      handleRemove={handleRemove}
    />).container
  })

  test('first render hides url and likes', () => {
    expect(container.querySelector('#titleAuthor')).not.toBeNull()
    expect(container.querySelector('#url')).toBeNull()
    expect(container.querySelector('#likes')).toBeNull()
  })

  test('view button is clicked once, details are shown', async () => {
    userEvent.setup()

    const viewButton = container.querySelector('#viewButton')
    await userEvent.click(viewButton)

    expect(container.querySelector('#url')).not.toBeNull()
    expect(container.querySelector('#likes')).not.toBeNull()
  })

  test('like button is clicked twice, event handler called twice', async () => {
    userEvent.setup()

    const viewButton = container.querySelector('#viewButton')
    await userEvent.click(viewButton)

    const likeButton = container.querySelector('#likeButton')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})

