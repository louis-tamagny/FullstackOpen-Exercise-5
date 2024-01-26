import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import '@testing-library/jest-dom'

describe('<Blog /> is rendered', () => {
  let container

  const handleLike = jest.fn()
  const handleRemove = jest.fn()

  beforeEach(async () => {
    container = render(<Blog
      blog={{ title:'blog title', author:'blog author', likes: 0, url:'blog url', user:{ name:'user name' } }}
      handleLike={handleLike}
      handleRemove={handleRemove}
    />).container
  })

  test('first render hides url and likes', async () => {
    expect(await container.querySelector('#titleAuthor')).not.toBeNull()
    expect(await container.querySelector('#url')).toBeNull()
    expect(await container.querySelector('#likes')).toBeNull()
  })
})

