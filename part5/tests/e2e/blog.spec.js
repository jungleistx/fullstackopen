const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createUser, resetTestDb } = require('../helper')
const testUsername = 'root'
const testPassword = 'pass1'


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
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible();

      await loginWith(page, testUsername, testPassword)

      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible();
      await expect(page.getByText(`${testUsername} logged in`)).toBeVisible();
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible();
    });
  })
})