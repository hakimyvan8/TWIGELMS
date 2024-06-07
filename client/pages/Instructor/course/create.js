import axios from 'axios';
//let's import the InstructorRoute component we created in the last last
import InstructorRoute from '../../../components/routes/InstructorRoute';

const CourseCreate = () => {
    return (
//we will wrap the InstructorIndex component with the InstructorRoute component
<InstructorRoute>
<h1 className='jumbotron text-center square'>Create Course</h1>
</InstructorRoute>
    )
};

export default CourseCreate;

//this pages will be only accessible to authenticated users as instructor' role