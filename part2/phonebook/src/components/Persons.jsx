const Persons = ({ persons, onClick }) => {
  return (
	<table>
		<tbody>
			{persons.map(person => {
				return (
					<tr key={person.name}>
						<td>{person.name}</td>
						<td>{person.number}</td>
						<td><button onClick={() => onClick(person)}>delete</button></td>
					</tr>
				)
			})}
		</tbody>
	</table>
  )
}

export default Persons