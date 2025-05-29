import Lesson from '../models/Lesson.js';
import CourseProgress from '../models/CourseProgress.js';
import { validateQuizSubmission } from '../utils/quizUtils.js';

const createLesson = async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { score, feedback } = validateQuizSubmission(lesson.quiz, answers);
    const passed = score >= lesson.quiz.passingScore;

    // Update progress if passed
    if (passed) {
      await CourseProgress.findOneAndUpdate(
        { user: userId, 'lessons.lesson': lessonId },
        { 
          $set: { 
            'lessons.$.completed': true,
            'lessons.$.quizScore': score,
            'lessons.$.completedAt': new Date()
          }
        }
      );
    }

    res.json({ score, passed, feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createLesson,
  getLesson,
  submitQuiz,
  updateLesson,
  deleteLesson
};