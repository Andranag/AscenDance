import { useParams } from 'react-router-dom';
import { Container, Header, Segment, Button } from 'semantic-ui-react';

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);
    };

    fetchCourse();
  }, [courseId]);

  const handleComplete = async (lessonId) => {
    const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setCourse(data);
  };

  if (!course) return <div>Loading...</div>;

  return (
    <Container>
      <Header as='h1'>{course.title}</Header>
      <Segment>
        <Header as='h2'>{course.lessons[0].title}</Header>
        <p>{course.lessons[0].content}</p>
        {!course.lessons[0].completed && (
          <Button primary onClick={() => handleComplete(course.lessons[0]._id)}>
            Mark as Complete
          </Button>
        )}
      </Segment>
    </Container>
  );
};

export default CoursePage;
