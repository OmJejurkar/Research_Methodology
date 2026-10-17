import questionsData from '../data/questions.json';

/**
 * Get all weeks metadata
 */
export function getAllWeeks() {
  return questionsData.weeks.map((w) => ({
    week: w.week,
    title: w.title,
    topic: w.topic,
    questionCount: w.questions.length,
  }));
}

/**
 * Get questions for a specific week
 */
export function getWeekQuestions(weekNumber) {
  const week = questionsData.weeks.find((w) => w.week === weekNumber);
  return week ? week.questions : [];
}

/**
 * Get all 120 questions
 */
export function getAllQuestions() {
  return questionsData.weeks.flatMap((w) => w.questions);
}

/**
 * Get course info
 */
export function getCourseInfo() {
  return {
    course: questionsData.course,
    institution: questionsData.institution,
    totalWeeks: questionsData.totalWeeks,
    totalQuestions: questionsData.totalQuestions,
  };
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get question by ID
 */
export function getQuestionById(id) {
  return getAllQuestions().find((q) => q.id === id);
}

/**
 * Parse correct answer into array of keys
 */
export function parseCorrectAnswer(correctAnswer) {
  if (!correctAnswer) return [];
  if (correctAnswer === 'True' || correctAnswer === 'False') return [correctAnswer];
  return correctAnswer.split('');
}

/**
 * Format date
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get score color class
 */
export function getScoreColor(percentage) {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get score bg class
 */
export function getScoreBg(percentage) {
  if (percentage >= 80) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
  if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
  return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
}
