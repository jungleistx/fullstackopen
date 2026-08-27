import { render, screen } from '@testing-library/react'
import Blog from '../../src/components/Blog'
import userEvent from '@testing-library/user-event'
import { beforeEach } from 'vitest'

const testUser = {
  username: 'testusername',
  name: 'testname'
}

const blog = {
  title: 'testtitle',
  author: 'testauthor',
  likes: 5000,
  url: 'www.fso.com',
  user: testUser
}

let mockHandler
const user = userEvent.setup()


describe('<Blog />', () => {
  beforeEach(() => {
    mockHandler = vi.fn()
    render(<Blog blog={blog} user={testUser} updateLike={mockHandler}/>)
  })


  test('renders title and author', () => {
    const element = screen.getByText('testtitle testauthor')
    expect(element).toBeDefined()

    const urlText = screen.queryByText('www.fso.com')
    expect(urlText).toBeNull()
  })


  test('render likes and url when button clicked', async () => {
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(1)

    const urlText = screen.getByText('www.fso.com')
    expect(urlText).toBeDefined()

    const likes = screen.getAllByText('likes 5000')
    expect(likes).toBeDefined()
  })


  test('click likebutton twice', async () => {
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})