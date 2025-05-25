const mongoose = require('mongoose');
const Course = require('./src/models/Course');
console.log('Seed file loaded:', Course);

const MONGODB_URI = 'mongodb+srv://andersanagnostou:Nxq8pA9owsyOlj8n@cluster0.0roelyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const seedData = [
  {
    title: 'Introduction to Modern Dance',
    description: 'Learn the basics of modern dance techniques and movements.',
    lessons: [
      {
        title: 'Warm-up Exercises',
        content: 'Basic stretching and flexibility exercises',
        type: 'video'
      },
      {
        title: 'Basic Steps',
        content: 'Introduction to fundamental modern dance steps',
        type: 'video'
      },
      {
        title: 'Rhythm and Timing',
        content: 'Understanding musicality in modern dance',
        type: 'article'
      }
    ]
  },
  {
    title: 'Ballet Fundamentals',
    description: 'Master the essential techniques of ballet dance.',
    lessons: [
      {
        title: 'Barre Work',
        content: 'Basic ballet barre exercises',
        type: 'video'
      },
      {
        title: 'Center Work',
        content: 'Ballet exercises without the barre',
        type: 'video'
      },
      {
        title: 'Pirouettes',
        content: 'Introduction to ballet turns',
        type: 'article'
      }
    ]
  },
  {
    title: 'Hip Hop Dance',
    description: 'Learn the energetic moves of hip hop dance.',
    lessons: [
      {
        title: 'Grooves and Isolations',
        content: 'Basic hip hop movement patterns',
        type: 'video'
      },
      {
        title: 'Footwork',
        content: 'Hip hop footwork techniques',
        type: 'video'
      },
      {
        title: 'Freestyle',
        content: 'Introduction to hip hop freestyle dancing',
        type: 'article'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Existing courses cleared');

    // Insert new courses
    const courses = await Course.insertMany(seedData);
    console.log(`Successfully added ${courses.length} courses`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
