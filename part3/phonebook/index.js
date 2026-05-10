http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/people')

app.use(express.static('dist'))
app.use(express.json())

morgan.token('person', (req) => {
  if (req.method === 'POST')
    return JSON.stringify(req.body)
  return null
})

app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :person'
))


let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]


const generateIdForPerson = () => {
  const personIds = persons.map(p => p.id)
  const max = Number.MAX_SAFE_INTEGER

  while (true) {
    const number = String(Math.floor(Math.random() * max))

    if (!personIds.includes(number)) {
      return number
    }
  }
}


app.post('/api/persons/', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateIdForPerson(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      return response.status(404).json({
        error: 'id not found'
      })
    })
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date().toString()}</p>
    `)
  }).catch(error => {
    response.status(500).json({ error: 'database error' })
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})