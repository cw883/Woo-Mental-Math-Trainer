'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, MathProblem } from '@/lib/types';
import { ProblemGenerator, isUsingDefaultSettings } from '@/lib/problemGenerator';
import { api } from '@/lib/api';

interface GameSessionProps {
  settings: Settings;
  onComplete: (sessionId: number, score: number) => void;
}

interface LocalProblem {
  question: string;
  answer: number;
  user_answer: number;
  time_spent_ms: number;
  typo_count: number;
}

export default function GameSession({ settings, onComplete }: GameSessionProps) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [typoCount, setTypoCount] = useState(0);
  const [problemStartTime, setProblemStartTime] = useState(Date.now());
  const [previousInputLength, setPreviousInputLength] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const generatorRef = useRef<ProblemGenerator>(new ProblemGenerator(settings));
  const scoreRef = useRef(0);  // Use ref to avoid timer dependency issues
  const completedProblemsRef = useRef<LocalProblem[]>([]);  // Store problems locally
  const sessionStartTimeRef = useRef(Date.now());  // Track actual start time

  // Initialize first problem only (don't create session yet)
  useEffect(() => {
    const problem = generatorRef.current.generateProblem();
    setCurrentProblem(problem);
    setProblemStartTime(Date.now());
    inputRef.current?.focus();
  }, []);

  // Timer countdown using real time
  useEffect(() => {
    if (!isSessionActive) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      const remaining = Math.max(0, 120 - elapsed);

      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsSessionActive(false);
      }
    }, 100); // Update more frequently for accuracy

    return () => clearInterval(timer);
  }, [isSessionActive]);

  // Handle session end when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && scoreRef.current > 0) {
      const endSession = async () => {
        try {
          // Create session and submit all problems at once
          const isDefault = isUsingDefaultSettings(settings);
          const response = await api.createSession(isDefault);
          const sessionId = response.session_id;

          // Submit all completed problems
          for (const problem of completedProblemsRef.current) {
            await api.submitProblem(sessionId, problem);
          }

          // Complete the session
          await api.completeSession(sessionId, scoreRef.current);
          onComplete(sessionId, scoreRef.current);
        } catch (error) {
          console.error('Failed to complete session:', error);
        }
      };
      endSession();
    }
  }, [timeRemaining, onComplete]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Track backspaces/deletions as typos
    if (newValue.length < previousInputLength) {
      setTypoCount((prev) => prev + 1);
    }

    setPreviousInputLength(newValue.length);
    setUserInput(newValue);

    // Auto-check for correct answer
    if (currentProblem && isSessionActive) {
      const userAnswer = parseInt(newValue, 10);
      if (!isNaN(userAnswer) && userAnswer === currentProblem.answer) {
        // Correct answer! Store locally
        const timeSpentMs = Date.now() - problemStartTime;

        // Store the problem locally
        completedProblemsRef.current.push({
          question: currentProblem.question,
          answer: currentProblem.answer,
          user_answer: userAnswer,
          time_spent_ms: timeSpentMs,
          typo_count: typoCount,
        });

        // Increment score and move to next problem
        setScore((prev) => {
          const newScore = prev + 1;
          scoreRef.current = newScore;
          return newScore;
        });

        // Generate new problem
        const nextProblem = generatorRef.current.generateProblem();
        setCurrentProblem(nextProblem);

        // Reset for next problem
        setUserInput('');
        setTypoCount(0);
        setPreviousInputLength(0);
        setProblemStartTime(Date.now());
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Since auto-check handles correct answers, this is now just for clearing wrong answers
    // We don't submit wrong answers to the backend anymore
    setUserInput('');
    setPreviousInputLength(0);
  };

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Header with score and timer */}
      <div className="absolute top-8 right-8 text-right">
        <div className="text-4xl font-bold text-black">{score}</div>
        <div className="text-sm text-black">correct</div>
      </div>

      <div className="absolute top-8 left-8">
        <div className="text-4xl font-bold text-black">{timeRemaining}</div>
        <div className="text-sm text-black">seconds</div>
      </div>

      {/* Main problem display */}
      <div className="text-center">
        <div className="text-7xl font-bold mb-8 text-black">
          {currentProblem.question}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="text-5xl text-center text-black border-b-4 border-gray-300 focus:border-blue-500 outline-none w-64 bg-transparent"
            autoFocus
            disabled={!isSessionActive}
            inputMode="numeric"
            pattern="[0-9-]*"
          />
        </form>

        {!isSessionActive && (
          <div className="mt-8 text-xl text-black">
            Session ended! Final score: {score}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 text-center text-black text-sm">
        <p>Type your answer and press Enter</p>
        <p className="mt-2">Press F5 to start a new session</p>
      </div>
    </div>
  );
}
