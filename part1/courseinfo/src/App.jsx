
const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}


const Part = (props) => {
  return (
    <>
      <p>
        {props.name} {props.exercises}
      </p>
    </>
  )
}


const Content = (props) => {
  return (
    <>
       {props.parts.map((part, index) => (
        <Part name={part.name} exercises={part.exercises} key={index}/>
       ))}
    </>
  )
}


const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.ex1 + props.ex2 + props.ex3}</p>
    </>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={[part1, part2, part3]}/>
      {/* <Total ex1={exercises1} ex2={exercises2} ex3={exercises3}/> */}
    </div>
  )
}


export default App
