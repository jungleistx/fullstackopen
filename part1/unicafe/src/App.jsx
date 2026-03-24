import { useState } from 'react'


const ReviewButton = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)


const Statistic = ({ text, value }) => {
  if (text === "positive") {
    return (
      <tr>
        <td>{text} </td>
        <td>{value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text} </td>
      <td>{value}</td>
    </tr>
  )
}


const Statistics = ({ good, neutral, bad}) => {
  const total = good + neutral + bad

  if (total > 0) {
    const score = (good - bad) / total
    const positive = good / total * 100

    return (
      <>
        <h2>statistics</h2>

        <table>
          <tbody>
            <Statistic text="good" value={good}/>
            <Statistic text="neutral" value={neutral}/>
            <Statistic text="bad" value={bad}/>
            <Statistic text="all" value={total}/>
            <Statistic text="positive" value={positive}/>
            <Statistic text="average" value={score}/>
          </tbody>
        </table>
      </>
    )
  }
  return (
    <>
      <h2>statistics</h2>
      <p>No feedback given</p>
    </>
  )
}


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
      <section>
        <h1>give feedback</h1>

        <ReviewButton onClick={handleGoodReview} text="good"/>
        <ReviewButton onClick={handleNeutralReview} text="neutral"/>
        <ReviewButton onClick={handleBadReview} text="bad"/>
      </section>

      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
