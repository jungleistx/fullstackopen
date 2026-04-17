const Notification = ({ message }) => {
	if (!message) {
		return null
	}

	const styling = {
		color: 'red',
		background: 'lightgrey',
		fontSize: '20px',
		borderStyle: 'solid',
		borderRadius: '5px',
		padding: '10p',
		marginBottom: '10px'
	}

  return (
	<div style={styling}>
		{message}
	</div>
  )
}

export default Notification