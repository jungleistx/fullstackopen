const Filter = ({ value, onChange }) => {
  return (
	<form>
		find countries
		<input
			value={value}
			onChange={onChange}
		/>
	</form>
  )
}

export default Filter