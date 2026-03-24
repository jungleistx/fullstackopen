import { useState } from 'react'


const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodReview = () => {
    setGood(good + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={handleGoodReview} text="good"/>

      <section>
        <h2>statistics</h2>
        <p>good {good}</p>
        <p>neutral</p>
        <p>bad</p>
      </section>

    </div>
  )
}

export default App
