import { CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { parseCorrectAnswer } from '../utils/dataUtils';

export default function QuestionCard({
  question,
  index,
  userAnswer,
  onAnswer,
  showResult = false,
  reviewMode = false,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const options = Object.entries(question.options);
  const correctKeys = parseCorrectAnswer(question.correctAnswer);
  const isMSQ = correctKeys.length > 1;

  const isSelected = (key) => {
    if (!userAnswer) return false;
    if (Array.isArray(userAnswer)) return userAnswer.includes(key);
    return userAnswer === key;
  };

  const handleSelect = (key) => {
    if (showResult || reviewMode) return;
    if (isMSQ) {
      // Toggle in array
      const current = Array.isArray(userAnswer) ? userAnswer : [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      onAnswer(question.id, next.length ? next : null);
    } else {
      onAnswer(question.id, userAnswer === key ? null : key);
    }
  };

  const getOptionStyle = (key) => {
    if (showResult || reviewMode) {
      const isCorrect = correctKeys.includes(key);
      const isUserSelected = isSelected(key);
      if (isCorrect) return 'option-btn option-btn-correct';
      if (isUserSelected && !isCorrect) return 'option-btn option-btn-wrong';
      return 'option-btn option-btn-default opacity-60';
    }
    if (isSelected(key)) return 'option-btn option-btn-selected';
    return 'option-btn option-btn-default';
  };

  const getStatusIcon = () => {
    if (!reviewMode && !showResult) return null;
    const isAttempted = userAnswer !== null && userAnswer !== undefined;
    if (!isAttempted) return <MinusCircle className="w-5 h-5 text-gray-400" />;

    const selectedKeys = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    const isCorrect =
      correctKeys.length === selectedKeys.length &&
      correctKeys.every((k) => selectedKeys.includes(k));

    if (isCorrect) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="card p-6 animate-slide-up">
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-5">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed whitespace-pre-line">
              {question.question}
            </p>
            {getStatusIcon()}
          </div>
          {isMSQ && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              Multiple correct answers
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {options.map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={getOptionStyle(key)}
            disabled={showResult || reviewMode}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border-2 mt-0.5 transition-all ${
                  isSelected(key) && !showResult && !reviewMode
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : showResult || reviewMode
                    ? correctKeys.includes(key)
                      ? 'bg-green-500 border-green-500 text-white'
                      : isSelected(key)
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500'
                }`}
              >
                {key}
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{value}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation (review mode) */}
      {(showResult || reviewMode) && question.explanation && (
        <div className="mt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            {showExplanation ? (
              <>
                <ChevronUp className="w-4 h-4" /> Hide explanation
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show explanation
              </>
            )}
          </button>
          {showExplanation && (
            <div className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200 animate-fade-in">
              {question.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
