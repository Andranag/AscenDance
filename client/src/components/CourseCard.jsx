import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <Card>
    <Card.Content>
      <Card.Header>{course.title}</Card.Header>
      <Card.Description>{course.description}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Link to={`/course/${course._id}`} className='ui primary button'>
        Start Course
      </Link>
    </Card.Content>
  </Card>
);

export default CourseCard;
