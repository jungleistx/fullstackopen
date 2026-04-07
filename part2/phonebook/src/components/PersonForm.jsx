const PersonForm = (p) => {
  return (
	<form onSubmit={p.onSubmit}>
		<div>
			name: <input value={p.name} onChange={p.nameChange}/>
		</div>
		<div>
			number: <input value={p.number} onChange={p.numberChange}/>
		</div>
		<div>
			<button type="submit">add</button>
		</div>
	</form>
  )
}

export default PersonForm
