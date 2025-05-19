import React, { useState } from "react";
import jpEnData from "./jp_en_100.json";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

type Question = {
  和文: string;
  英文: string;
};

const QuizApp = () => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [step, setStep] = useState<"input" | "quiz" | "result">("input");

  const startQuiz = () => {
    const shuffled = [...jpEnData]
      .sort(() => Math.random() - 0.5)
      .slice(0, numQuestions);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setUserInput("");
    setShowAnswer(false);
    setStep("quiz");
  };

  const handleNext = () => {
    if (
      userInput.trim().toLowerCase() ===
      questions[currentIndex].英文.toLowerCase()
    ) {
      setCorrectCount((prev) => prev + 1);
    }
    setShowAnswer(true);
  };

  const handleContinue = () => {
    setShowAnswer(false);
    setUserInput("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStep("result");
    }
  };

  const resetQuiz = () => {
    setStep("input");
    setUserInput("");
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setShowAnswer(false);
  };

  const getProgress = () =>
    Math.round(((currentIndex + (showAnswer ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="p-4">
      {step === "input" && (
        <div>
          <Input
            type="number"
            min={1}
            max={jpEnData.length}
            value={numQuestions}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > 0 && val <= jpEnData.length) setNumQuestions(val);
            }}
            placeholder={`1〜${jpEnData.length}で問題数を入力`}
          />
          <Button onClick={startQuiz} className="mt-2">
            スタート
          </Button>
        </div>
      )}

      {step === "quiz" && (
        <Card>
          <CardContent>
            {/* 進捗バー */}
            <div className="mb-4">
              <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {currentIndex + (showAnswer ? 1 : 0)} / {questions.length}
              </p>
            </div>

            <p className="text-xl font-semibold mb-2">
              {questions[currentIndex].和文}
            </p>

            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="英訳を入力"
              disabled={showAnswer}
            />

            {!showAnswer && (
              <Button onClick={handleNext} className="mt-2">
                答え合わせ
              </Button>
            )}

            {showAnswer && (
              <div className="mt-2">
                {userInput.trim().toLowerCase() ===
                questions[currentIndex].英文.toLowerCase() ? (
                  <p className="text-green-600 font-semibold">正解です！</p>
                ) : (
                  <>
                    <p className="text-red-600 font-semibold">不正解です。</p>
                    <p>正解: {questions[currentIndex].英文}</p>
                  </>
                )}

                <Button onClick={handleContinue} className="mt-2">
                  {currentIndex + 1 === questions.length
                    ? "結果を見る"
                    : "次の問題へ"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === "result" && (
        <Card>
          <CardContent>
            <p className="text-lg font-bold">結果発表</p>
            <p>
              正解数: {correctCount} / {questions.length}
            </p>
            <Button onClick={resetQuiz} className="mt-4">
              もう一度挑戦
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizApp;
