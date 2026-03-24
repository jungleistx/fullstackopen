import { useState } from 'react'


const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)


const Statistic = (props) => (
  <p>{props.text} {props.value}</p>
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodReview = () => {
    setGood(good + 1)
  }

  const handleNeutralReview = () => {
    setNeutral(neutral + 1)
  }

  const handleBadReview = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={handleGoodReview} text="good"/>
      <Button onClick={handleNeutralReview} text="neutral"/>
      <Button onClick={handleBadReview} text="bad"/>

      <section>
        <h2>statistics</h2>
        <Statistic text="good" value={good}/>
        <Statistic text="neutral" value={neutral}/>
        <Statistic text="bad" value={bad}/>
      </section>

    </div>
  )
}

export default App
