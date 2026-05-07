const mongoose = require('mongoose')


const argvLen = process.argv.length

if (argvLen < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const url =  `mongodb+srv://fso_phonebookuser:${password}@cluster0.85bumku.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (argvLen === 3) {
	Person.find({}).then(results => {
		console.log('phonebook:');
		results.forEach(note => {
			console.log(`${note.name} ${note.number}`)
		})
		mongoose.connection.close()
	})
}
else if (argvLen === 5) {
	const newName = process.argv[3]
	const newNumber = process.argv[4]

	const person = new Person({
		name: newName,
		number: newNumber,
	})

	person.save().then(result => {
		console.log(`added ${newName} number ${newNumber} to phonebook`);
		mongoose.connection.close()
	})
}