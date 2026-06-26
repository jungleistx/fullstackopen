### Part 4

---
### <ins> bloglist </ins>
- backend for blogs.
Possibility to POST and GET blogs.

#### How to run
  - ```npm install```
  - create `.env` with MONGODB_URI and PORT
  - ```npm start```

#### Testing with Postman
- Get all blogs
GET http://localhost:3003/api/blogs

- Post new blog
POST http://localhost:3003/api/blogs
body { "title", "author", "url", "likes" }


#### Testing
- ```npm test```
or
- `npm test <tests/filename>`

