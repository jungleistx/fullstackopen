const Persons = ({ persons }) => {
  return (
	<table>
		<tbody>
			{persons.map(person => {
				return (
					<tr key={person.name}>
						<td>{person.name}</td>
						<td>{person.number}</td>
					</tr>
				)
			})}
		</tbody>
	</table>
  )
}

export default Persons