import React from 'react';
const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
  }
  
  const Total = ({ course }) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue.exercises;
    const sum = course.parts.reduce(reducer, 0)
  
    return(
      <p>Number of exercises {sum}</p>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => 
          <Part part={part} />)}
        {/* <Part part={course.parts[0]} /> */}
        {/* <Part part={course.parts[1]} /> */}
        {/* <Part part={course.parts[2]} /> */}
        <Total course={course} />
      </div>
    )
  }
  const Course = ({course}) => {
    return (
      <>
      <Header course={course}/>
      <Content course={course}/>
      </>
    )
  }
export default Course
