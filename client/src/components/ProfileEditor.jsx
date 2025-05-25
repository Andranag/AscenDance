import { Form, Button } from 'semantic-ui-react';

const ProfileEditor = ({ user, onUpdate }) => (
  <Form onSubmit={(e) => {
    e.preventDefault();
    onUpdate({ name: user.name, email: user.email });
  }}>
    <Form.Input
      fluid
      icon='user'
      iconPosition='left'
      name='name'
      value={user.name}
      onChange={(e) => user.name = e.target.value}
    />
    <Form.Input
      fluid
      icon='mail'
      iconPosition='left'
      name='email'
      value={user.email}
      onChange={(e) => user.email = e.target.value}
    />
    <Button type='submit' primary>Update Profile</Button>
  </Form>
);

export default ProfileEditor;
