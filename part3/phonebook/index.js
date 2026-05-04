http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

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
	response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  }
  else {
    return response.status(404).json({
      error: 'id not found'
    })
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


app.get('/info', (request, response) => {
	response.send(`
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date().toString()}</p>
		`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})