import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true,
    enum: [
      'Lindy Hop',
      'Balboa',
      'Solo Jazz',
      'Blues',
      'Boogie Woogie',
      'Shag',
      'Rhythm and Blues'
    ],
    set: (value) => {
      if (!value) return undefined;
      const normalizedValue = value.trim();
      // Map common variations to their canonical forms
      const styleMap = {
        'lindy hop': 'Lindy Hop',
        'balboa': 'Balboa',
        'solo jazz': 'Solo Jazz',
        'blues': 'Blues',
        'boogie woogie': 'Boogie Woogie',
        'shag': 'Shag',
        'rhythm and blues': 'Rhythm and Blues'
      };
      // First try to get the canonical form
      const canonicalStyle = styleMap[normalizedValue.toLowerCase()];
      if (canonicalStyle) return canonicalStyle;
      // If not found in map, check if it matches exactly with any enum value
      const enumValues = [
        'Lindy Hop',
        'Balboa',
        'Solo Jazz',
        'Blues',
        'Boogie Woogie',
        'Shag',
        'Rhythm and Blues'
      ];
      return enumValues.includes(normalizedValue) ? normalizedValue : undefined;
    }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    required: true,
    enum: [
      'Beginner',
      'Intermediate',
      'Advanced',
      'All Levels'
    ],
    set: (value) => {
      if (!value) return undefined;
      const normalizedValue = value.trim();
      // Map common variations to their canonical forms
      const levelMap = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'all levels': 'All Levels'
      };
      // First try to get the canonical form
      const canonicalLevel = levelMap[normalizedValue.toLowerCase()];
      if (canonicalLevel) return canonicalLevel;
      // If not found in map, check if it matches exactly with any enum value
      const enumValues = [
        'Beginner',
        'Intermediate',
        'Advanced',
        'All Levels'
      ];
      return enumValues.includes(normalizedValue) ? normalizedValue : undefined;
    }
  },
  lessons: [{
    title: String,
    content: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  duration: {
    type: String,
    default: '2 hours'
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);