
const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}


const Content = (props) => {
  return (
    <>
      <p>
        {props.p1} {props.ex1}
      </p>
      <p>
        {props.p2} {props.ex2}
      </p>
      <p>
        {props.p3} {props.ex3}
      </p>
    </>
  )
}




const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <Header course={course} />
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <Content p1={part1} ex1={exercises1}
        p2={part2} ex2={exercises2}
        p3={part3} ex3={exercises3}/>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App