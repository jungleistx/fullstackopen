### Part 4

---
### <ins> bloglist </ins>
- backend for blogs.
Possibility to POST, DELETE, PUT and GET blogs.

#### How to run
  - ```npm install```
  - create `.env` with MONGODB_URI, SECRET and PORT
  - ```npm start```

#### Endpoints
- /api/blogs
- /api/login
- /api/users

#### Testing with Postman
- Create user: POST http://localhost:3003/api/users { username, password }
  
- Login and get token:
POST http://localhost:3003/api/login { username, password }
  
- Get all blogs:
GET http://localhost:3003/api/blogs

- Post new blog:
POST http://localhost:3003/api/blogs
{ title, author, url, likes }
  - add token as Authorization Bearer Token

- Delete blog:
  DELETE http://localhost:3003/api/blogs
  - add token as Authorization Bearer Token

#### Testing
- ```npm test```
or
- `npm test <tests/filename>`

