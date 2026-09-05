const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createUser, resetTestDb, createBlog } = require('../helper')
const testUsername = 'root'
const testPassword = 'pass1'
const title = 'new title'
const author = 'john peters'
const url = 'www.test.net'


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await resetTestDb(request)
    await createUser(request, testUsername, testPassword)
    await page.goto('http://localhost:5173')
  })

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle('Blog app')
  })

  describe('Login', () => {
    test('login form is shown', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Log in to the application' })).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
    })

    test('succeeds with valid credentials', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

      await loginWith(page, testUsername, testPassword)

      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
      await expect(page.getByText(`${testUsername} logged in`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with invalid credentials', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

      await loginWith(page, testUsername, 'wrong_pw')

      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'blogs' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Log in to the application' })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUsername, testPassword)
    })

    test('can create a new blog', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'create new blog' })).toBeVisible()

      await createBlog(page, title, author, url)

      // notification
      await expect(page.getByText(`a new blog ${title} by ${author} added`)).toBeVisible()

      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
      await expect(page.getByText(`${title} ${author}`)).toBeVisible();
    })

    describe('After adding new blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, title, author, url)
      })

      test('view/hide button works', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'create new blog' })).toBeVisible()

        // when hidden
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await expect(page.getByText(`${title} ${author}`)).toBeVisible();
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible();
        // when opened
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible();
        await expect(page.getByText(url)).toBeVisible()
        await expect(page.getByText(`${title}hide`)).toBeVisible()
        await expect(page.getByRole('button', { name: 'hide' })).toBeVisible()
        await expect(page.getByText(author, { exact: true })).toBeVisible()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible();
        // when hidden
        await page.getByRole('button', { name: 'hide' }).click();
        await expect(page.getByText(`${title} ${author}`)).toBeVisible();
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible();
        await expect(page.getByText('likes 0')).not.toBeVisible()
        await expect(page.getByText(url)).not.toBeVisible()
      })

      test('blog can be liked', async ({ page }) => {
        // when hidden
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        // when opened
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible();
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await expect(page.getByRole('button', { name: 'hide' })).toBeVisible()
        // when hidden
        await page.getByRole('button', { name: 'hide' }).click();
        await expect(page.getByText('likes 1')).not.toBeVisible()
        // when opened again
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })
    })
  })
})