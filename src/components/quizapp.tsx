import React, { useState, useMemo } from "react";
import jpEnData from "../data/jp_en_100.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 日本語フォント（Base64形式）読み込み
import { NotoSansJP } from "../fonts/NotoSansJP-Regular";

type Question = {
  和文: string;
  英文: string;
  chapter: number;
};

export const QuizApp = () => {
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");
  const [questionCount, setQuestionCount] = useState<number | "all">("all");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // 存在するchapterだけ取得（自動更新対応）
  const availableChapters = useMemo(() => {
    const chapters = Array.from(new Set(jpEnData.map((q) => q.chapter)));
    chapters.sort((a, b) => a - b);
    return chapters;
  }, [jpEnData]);

  const quizData = useMemo(() => {
    const filtered = jpEnData.filter(
      (q) => selectedChapter === "all" || q.chapter === selectedChapter
    );
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return questionCount === "all" ? shuffled : shuffled.slice(0, questionCount);
  }, [selectedChapter, questionCount]);

  const currentQuestion = quizData[currentIndex];

  const handleSubmit = () => {
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.英文.trim().toLowerCase();
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) setScore((prev) => prev + 1);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setAnswer("");
    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleStart = () => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setAnswer("");
    setShowResult(false);
    setShowAnswer(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJP);
    doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
    doc.setFont("NotoSansJP");

    doc.setFontSize(14);
    doc.text(
      `Chapter ${selectedChapter === "all" ? "All" : selectedChapter} - 英文・和文一覧`,
      14,
      20
    );

    const dataToExport = jpEnData.filter(
      (item) => selectedChapter === "all" || item.chapter === selectedChapter
    );

    autoTable(doc, {
      head: [["No", "英文", "和文"]],
      body: dataToExport.map((item, i) => [i + 1, item.英文, item.和文]),
      startY: 30,
      styles: { font: "NotoSansJP", fontSize: 10 },
      columnStyles: {
        0: {
          cellWidth: 15,
          halign: "center",
          fontStyle: "bold",
          minCellHeight: 10,
          overflow: "ellipsize",
          cellPadding: 3,
        },
        1: { cellWidth: 80 },
        2: { cellWidth: 80 },
      },
    });

    doc.save(`Chapter_${selectedChapter === "all" ? "All" : selectedChapter}.pdf`);
  };

  const exportOnlyJapanesePDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJP);
    doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
    doc.setFont("NotoSansJP");

    doc.setFontSize(14);
    doc.text(
      `Chapter ${selectedChapter === "all" ? "All" : selectedChapter} - 和文一覧`,
      14,
      20
    );

    const dataToExport = jpEnData.filter(
      (item) => selectedChapter === "all" || item.chapter === selectedChapter
    );

    autoTable(doc, {
      head: [["No", "和文"]],
      body: dataToExport.map((item, i) => [i + 1, item.和文]),
      startY: 30,
      styles: { font: "NotoSansJP", fontSize: 10 },
      columnStyles: {
        0: {
          cellWidth: 15,
          halign: "center",
          fontStyle: "bold",
          minCellHeight: 10,
          overflow: "ellipsize",
          cellPadding: 3,
        },
        1: { cellWidth: 160 },
      },
    });

    doc.save(`Chapter_${selectedChapter === "all" ? "All" : selectedChapter}_OnlyJapanese.pdf`);
  };

  if (showResult) {
    return (
      <div>
        <h2>結果</h2>
        <p>
          {quizData.length}問中 {score}問正解！
        </p>
        <button onClick={() => window.location.reload()}>もう一度</button>
      </div>
    );
  }

  return (
    <div>
      <h1>英語の構文150</h1>

      {!quizStarted && (
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Chapter:
            <select
              value={selectedChapter}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedChapter(val === "all" ? "all" : parseInt(val));
              }}
            >
              <option value="all">All</option>
              {availableChapters.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginLeft: "1rem" }}>
            問題数:
            <select
              value={questionCount}
              onChange={(e) => {
                const val = e.target.value;
                setQuestionCount(val === "all" ? "all" : parseInt(val));
              }}
            >
              <option value="all">All</option>
              {[5, 10, 20, 30, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>

          <button style={{ marginLeft: "1rem" }} onClick={exportPDF}>
            英文・和文PDF出力
          </button>

          <button style={{ marginLeft: "1rem" }} onClick={exportOnlyJapanesePDF}>
            和文だけPDF出力
          </button>

          <button style={{ marginLeft: "1rem" }} onClick={handleStart}>
            スタート
          </button>
        </div>
      )}

      {quizStarted && currentQuestion && !showResult && (
        <div>
          <p>
            <strong>
              問題 {currentIndex + 1} / {quizData.length}
            </strong>
          </p>
          <p>{currentQuestion.和文}</p>

          {!showAnswer ? (
            <>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button onClick={handleSubmit}>回答</button>
            </>
          ) : (
            <>
              <p style={{ color: lastAnswerCorrect ? "green" : "red" }}>
                {lastAnswerCorrect ? "正解！" : "不正解！"}
              </p>
              <p>
                正解: <strong>{currentQuestion.英文}</strong>（Chapter:{" "}
                {currentQuestion.chapter}）
              </p>
              <button onClick={handleNext}>次の問題</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
