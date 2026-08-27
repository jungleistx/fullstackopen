import { render, screen } from '@testing-library/react'
import BlogForm from '../../src/components/BlogForm'
import userEvent from '@testing-library/user-event'


describe('<BlogForm />', () => {
  test('create new blog', async () => {
    const addBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm addBlog={addBlog}/>)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'don duck')
    await user.type(urlInput, 'www.test.com')
    await user.click(submitButton)

    expect(addBlog.mock.calls).toHaveLength(1)

    expect(addBlog.mock.calls[0][0].title).toBe('test title')
    expect(addBlog.mock.calls[0][0].author).toBe('don duck')
    expect(addBlog.mock.calls[0][0].url).toBe('www.test.com')
  })
})