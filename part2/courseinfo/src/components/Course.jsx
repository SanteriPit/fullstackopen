const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Header = ({ name }) => {
    return <h2>{name}</h2>;
}

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map(part => 
        <Part part={part} key={part.id} />
      )}
    </>
  )
}

const Total = ({ course }) => {
  const initialExercises = 0
  const totalExercises = course.parts.reduce(
    (currentValue, part) => currentValue + part.exercises,
    initialExercises
  )

  return (
    <h4>total of {totalExercises} courses</h4>
  );
}

const Course = ({ courses }) => {
  return (
    <div>
      <h1>Courses & exercises</h1>
      {courses.map(course => 
        <div key={course.id}>
          <Header name={course.name} />
          <Content course={course} />
          <Total course={course} />
        </div>
      )}
    </div>
  )
}
 
export default Course;