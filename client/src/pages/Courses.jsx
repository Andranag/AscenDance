import { Container, Grid } from 'semantic-ui-react';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    <Container>
      <Grid columns={3}>
        {courses.map(course => (
          <Grid.Column key={course._id}>
            <CourseCard course={course} />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses;
