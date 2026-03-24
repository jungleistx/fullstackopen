import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>give feedback</h1>

      <button></button>
      <button></button>
      <button></button>

      <section>
        <h2>statistics</h2>
        <p>good</p>
        <p>neutral</p>
        <p>bad</p>
      </section>

    </div>
  )
}

export default App