import React, { useState } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';

// Task 1: Core-GUI тусгаарлалт
// QuizCore instance-г компонентын гадна үүсгэж, логикийг GUI-аас тусгаарлана
const quizCore = new QuizCore();

interface QuizState {
  currentQuestion: ReturnType<typeof quizCore.getCurrentQuestion>;
  selectedAnswer: string | null;
  quizFinished: boolean;
}

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestion: quizCore.getCurrentQuestion(),
    selectedAnswer: null,
    quizFinished: false,
  });

  // Task 2: Хариулт сонгоход state шинэчлэх
  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  };

  // Task 3: Next Question / Submit товчийн логик
  const handleButtonClick = (): void => {
    if (state.selectedAnswer === null) return;

    quizCore.answerQuestion(state.selectedAnswer);

    if (quizCore.hasNextQuestion()) {
      quizCore.nextQuestion();
      setState({
        currentQuestion: quizCore.getCurrentQuestion(),
        selectedAnswer: null,
        quizFinished: false,
      });
    } else {
      setState((prevState) => ({ ...prevState, quizFinished: true }));
    }
  };

  // Task 3: Дууссаны дараа оноог харуулах
  if (state.quizFinished) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>
          Final Score: {quizCore.getScore()} out of {quizCore.getTotalQuestions()}
        </p>
      </div>
    );
  }

  const { currentQuestion, selectedAnswer } = state;

  if (!currentQuestion) {
    return <div><p>No questions available.</p></div>;
  }

  const isLastQuestion = !quizCore.hasNextQuestion();

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <button onClick={handleButtonClick} disabled={selectedAnswer === null}>
        {isLastQuestion ? 'Submit' : 'Next Question'}
      </button>
    </div>
  );
};

export default Quiz;