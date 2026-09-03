const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: 'username' }).click();
  await page.getByRole('textbox', { name: 'username' }).fill(username);
  await page.getByRole('textbox', { name: 'password' }).click();
  await page.getByRole('textbox', { name: 'password' }).fill(password);
  await page.getByRole('button', { name: 'login' }).click();
}


const createUser = async (request, username, password) => {
  await request.post('http://localhost:3001/api/users', {
    data: {
      username: username,
      password: password
    }
  })
}


const resetTestDb = async (request) => {
  await request.post('http://localhost:3001/api/testing/reset')
}

export {
  loginWith,
  createUser,
  resetTestDb
}