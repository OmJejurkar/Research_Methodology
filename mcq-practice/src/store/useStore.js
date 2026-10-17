import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        document.documentElement.classList.toggle('dark', newMode);
      },

      // Quiz progress per week (stored as { week: { bestScore, lastScore, attempts, correctMap } })
      weekProgress: {},

      // Full test history
      fullTestHistory: [],

      // Current quiz session
      currentSession: null,

      // Start a quiz session
      startSession: (questions, mode, weekNumber = null) => {
        const session = {
          id: Date.now(),
          mode, // 'week' | 'full'
          weekNumber,
          questions,
          answers: {}, // { questionId: selectedOption or [selectedOptions] }
          startTime: Date.now(),
          submitted: false,
        };
        set({ currentSession: session });
      },

      // Set an answer
      setAnswer: (questionId, answer) => {
        const session = get().currentSession;
        if (!session) return;
        set({
          currentSession: {
            ...session,
            answers: { ...session.answers, [questionId]: answer },
          },
        });
      },

      // Clear an answer
      clearAnswer: (questionId) => {
        const session = get().currentSession;
        if (!session) return;
        const answers = { ...session.answers };
        delete answers[questionId];
        set({ currentSession: { ...session, answers } });
      },

      // Submit session and calculate results
      submitSession: () => {
        const session = get().currentSession;
        if (!session) return null;

        const results = calculateResults(session);

        const submittedSession = {
          ...session,
          submitted: true,
          endTime: Date.now(),
          results,
        };

        set({ currentSession: submittedSession });

        // Update progress
        if (session.mode === 'week' && session.weekNumber) {
          const weekProgress = { ...get().weekProgress };
          const week = session.weekNumber;
          const prev = weekProgress[week] || { bestScore: 0, lastScore: 0, attempts: 0, correctMap: {} };

          const scorePercent = results.percentage;
          weekProgress[week] = {
            bestScore: Math.max(prev.bestScore, scorePercent),
            lastScore: scorePercent,
            attempts: prev.attempts + 1,
            correctMap: {
              ...prev.correctMap,
              ...results.correctMap,
            },
          };
          set({ weekProgress });
        } else if (session.mode === 'full') {
          const history = [...get().fullTestHistory, {
            id: submittedSession.id,
            date: new Date().toISOString(),
            totalQuestions: results.total,
            score: results.correct,
            percentage: results.percentage,
          }];
          set({ fullTestHistory: history });
        }

        return results;
      },

      // Get current session results
      getResults: () => {
        const session = get().currentSession;
        if (!session || !session.submitted) return null;
        return session.results;
      },

      // Reset current session
      resetSession: () => set({ currentSession: null }),

      // Clear all progress
      clearAllProgress: () => set({ weekProgress: {}, fullTestHistory: [], currentSession: null }),
    }),
    {
      name: 'mcq-practice-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        weekProgress: state.weekProgress,
        fullTestHistory: state.fullTestHistory,
      }),
    }
  )
);

function calculateResults(session) {
  const { questions, answers } = session;
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  const correctMap = {};
  const detailedResults = [];

  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    const isAttempted = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
    let isCorrect = false;

    if (!isAttempted) {
      unattempted++;
    } else {
      // Handle MSQ (multiple correct answers)
      if (q.correctAnswer.length > 1 && !['True', 'False'].includes(q.correctAnswer)) {
        // MSQ: correctAnswer like "ABC" or "ABD"
        const correctSet = new Set(q.correctAnswer.split(''));
        let userSet;
        if (Array.isArray(userAnswer)) {
          userSet = new Set(userAnswer);
        } else {
          userSet = new Set([userAnswer]);
        }
        isCorrect = correctSet.size === userSet.size && [...correctSet].every(v => userSet.has(v));
      } else {
        // MCQ or TF
        if (Array.isArray(userAnswer)) {
          isCorrect = userAnswer.length === 1 && userAnswer[0] === q.correctAnswer;
        } else {
          isCorrect = userAnswer === q.correctAnswer;
        }
      }

      if (isCorrect) {
        correct++;
        correctMap[q.id] = true;
      } else {
        wrong++;
        correctMap[q.id] = false;
      }
    }

    detailedResults.push({
      question: q,
      userAnswer,
      isAttempted,
      isCorrect,
    });
  });

  return {
    total: questions.length,
    correct,
    wrong,
    unattempted,
    percentage: Math.round((correct / questions.length) * 100),
    correctMap,
    detailedResults,
  };
}

// Initialize dark mode from persisted state
const initDarkMode = () => {
  const stored = localStorage.getItem('mcq-practice-store');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.darkMode) {
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }
};

initDarkMode();

export default useStore;
