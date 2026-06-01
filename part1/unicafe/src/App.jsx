import { useState } from 'react'

const Button = ( { onClick, text } ) => {
  return (<button onClick={onClick}>{text}</button>)
}

const StatisticsLine = ( { text, value, suffix } ) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {suffix}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.good == 0 && props.neutral == 0 && props.bad == 0) return <p>No feedback given</p>
  else {
    const average = (-1 * props.bad + 0 * props.neutral + 1 * props.good) / props.total
    const positive = (props.good/props.total)*100

    return (
      <table>
        <tbody>
          <StatisticsLine text={'good'} value={props.good} />
          <StatisticsLine text={'neutral'} value={props.neutral} />
          <StatisticsLine text={'bad'} value={props.bad} />
          <StatisticsLine text={'total'} value={props.total} />
          <StatisticsLine text={'average'} value={average} />
          <StatisticsLine text={'positive'} value={positive} suffix={'%'} />
        </tbody>
      </table>
    )
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodFeedback = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
  }

  const handleNeutralFeedback = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(updatedNeutral + good + bad)
  }

  const handleBadFeedback = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(updatedBad + neutral + good)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodFeedback} text={'good'} />
      <Button onClick={handleNeutralFeedback} text={'neutral'} />
      <Button onClick={handleBadFeedback} text={'bad'} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  )
}

export default App