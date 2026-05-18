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


app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error);
      return response.status(500).end()
    })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date().toString()}</p>
      `)
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})