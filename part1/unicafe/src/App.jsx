import { useState } from 'react'


const ReviewButton = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)


const Statistic = (props) => (
  <p>{props.text} {props.value}</p>
)


const Average = ({ text, pos, neg, total }) => {
  if (total > 0) {
    const score = (pos-neg) / total

    return (
      <p>{text} {score}</p>
    )
  }

  else {
    return (
      <p>{text} 0</p>
    )
  }
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad

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
      <section>
        <h1>give feedback</h1>

        <ReviewButton onClick={handleGoodReview} text="good"/>
        <ReviewButton onClick={handleNeutralReview} text="neutral"/>
        <ReviewButton onClick={handleBadReview} text="bad"/>
      </section>

      <section>
        <h2>statistics</h2>

        <Statistic text="good" value={good}/>
        <Statistic text="neutral" value={neutral}/>
        <Statistic text="bad" value={bad}/>
        <Statistic text="all" value={total}/>
        <Average text="average" pos={good} neg={bad} total={total}/>
      </section>

    </div>
  )
}

export default App
