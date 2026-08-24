import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog'


describe('<Blog />', () => {
  test('renders title and author', async () => {
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

    render(<Blog blog={blog} user={testUser}/>)

    const element = screen.getByText('testtitle testauthor')
    expect(element).toBeDefined()

    const urlText = screen.queryByText('www.fso.com')
    expect(urlText).toBeNull()
  })
})