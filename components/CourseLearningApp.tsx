"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CourseData, Question } from "@/data/course-types";
import legacyStyles from "./CourseLearningApp.module.css";
import modernStyles from "./CourseLearningAppModern.module.css";
import modernV3Styles from "./CourseLearningAppModernV3.module.css";

type View = "overview" | "lessons" | "topics" | "skills" | "exam" | "review" | "flashcards" | "quiz" | "result";
type Progress = { total: number; right: number; wrong: string[] };

const EMPTY_PROGRESS: Progress = { total: 0, right: 0, wrong: [] };

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
    .toLowerCase();
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sample<T>(items: T[], count: number) {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function isCorrect(question: Question, answer: string | string[]) {
  if (question.type === "multi") {
    const selected = (Array.isArray(answer) ? answer : []).map(normalize).sort();
    const correct = (Array.isArray(question.correct) ? question.correct : []).map(normalize).sort();
    return JSON.stringify(selected) === JSON.stringify(correct);
  }
  const value = Array.isArray(answer) ? answer[0] ?? "" : answer;
  if (question.type === "fill") {
    const accepted = question.accepted?.length
      ? question.accepted
      : [String(question.correct)];
    return accepted.map(normalize).includes(normalize(value));
  }
  return normalize(value) === normalize(String(question.correct));
}

export default function CourseLearningApp({ course }: { course: CourseData }) {
  const { meta, lessons, questions } = course;
  // Mỗi phiên bản giao diện được giữ độc lập để có thể hoàn tác an toàn.
  const styles = meta.version >= 3
    ? modernV3Styles
    : meta.version >= 2
      ? modernStyles
      : legacyStyles;
  const storageKey = `edubee-progress:${meta.id}:v${meta.version}`;
  const [view, setView] = useState<View>("overview");
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizTitle, setQuizTitle] = useState("");
  const [result, setResult] = useState({ score: 0, total: 0 });
  const [examChapter, setExamChapter] = useState("all");
  const [examDifficulty, setExamDifficulty] = useState(meta.defaultDifficulty ?? "mix");
  const [examCount, setExamCount] = useState(10);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashBack, setFlashBack] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) setProgress(JSON.parse(stored));
      } catch {
        setProgress(EMPTY_PROGRESS);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  const chapters = useMemo(
    () => [...new Map(lessons.map((lesson) => [lesson.chapterId, lesson])).values()],
    [lessons],
  );
  const skills = useMemo(() => [...new Set(questions.map((item) => item.skill))].sort(), [questions]);
  const difficulties = useMemo(() => [...new Set(questions.map((item) => item.difficulty))], [questions]);
  const currentQuestion = queue[questionIndex];
  const currentOptions = useMemo(
    () => (currentQuestion?.options ? shuffle(currentQuestion.options) : []),
    [currentQuestion],
  );
  const accuracy = progress.total ? Math.round((progress.right / progress.total) * 100) : 0;

  function saveProgress(next: Progress) {
    setProgress(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function openView(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuiz(pool: Question[], title: string, count?: number) {
    const next = count ? sample(pool, count) : shuffle(pool);
    if (!next.length) return;
    setQueue(next);
    setQuestionIndex(0);
    setScore(0);
    setAnswer("");
    setChecked(false);
    setQuizTitle(title);
    openView("quiz");
  }

  function chooseOption(option: string) {
    if (checked || !currentQuestion) return;
    if (currentQuestion.type === "multi") {
      const selected = Array.isArray(answer) ? answer : [];
      setAnswer(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
    } else {
      setAnswer(option);
    }
  }

  function submitAnswer() {
    if (!currentQuestion || checked) return;
    const hasAnswer = Array.isArray(answer) ? answer.length > 0 : answer.trim().length > 0;
    if (!hasAnswer) return;
    const ok = isCorrect(currentQuestion, answer);
    setChecked(true);
    if (ok) setScore((value) => value + 1);
    const wrong = ok
      ? progress.wrong.filter((id) => id !== currentQuestion.id)
      : [...new Set([...progress.wrong, currentQuestion.id])];
    saveProgress({ total: progress.total + 1, right: progress.right + (ok ? 1 : 0), wrong });
  }

  function nextQuestion() {
    if (questionIndex + 1 >= queue.length) {
      const finalScore = score + (checked && currentQuestion && isCorrect(currentQuestion, answer) ? 0 : 0);
      setResult({ score: finalScore, total: queue.length });
      openView("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
    setAnswer("");
    setChecked(false);
  }

  function startExam() {
    const pool = questions.filter(
      (question) =>
        (examChapter === "all" || question.chapterId === examChapter) &&
        (examDifficulty === "mix" || question.difficulty === examDifficulty),
    );
    startQuiz(pool, `Đề kiểm tra ${Math.min(examCount, pool.length)} câu`, examCount);
  }

  const filteredLessons = lessons.filter((lesson) =>
    normalize(`${lesson.title} ${lesson.chapter}`).includes(normalize(search)),
  );
  const wrongQuestions = questions.filter((question) => progress.wrong.includes(question.id));
  const flashQuestion = questions[flashIndex % questions.length];
  const defaultQuestions = meta.defaultDifficulty
    ? questions.filter((question) => question.difficulty === meta.defaultDifficulty)
    : questions;
  const lessonLabel = meta.lessonLabel ?? "Bài";
  const chapterLabel = meta.chapterLabel ?? "Chủ đề";
  const itemLabel = meta.itemLabel ?? "Câu hỏi";

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: "overview", label: "Tổng quan", icon: "⌂" },
    { id: "lessons", label: `Theo ${lessonLabel.toLowerCase()}`, icon: "▤" },
    { id: "topics", label: chapterLabel, icon: "◫" },
    { id: "skills", label: "Kỹ năng", icon: "◎" },
    { id: "exam", label: "Kiểm tra", icon: "✓" },
    { id: "review", label: "Ôn câu sai", icon: "↻" },
    { id: "flashcards", label: "Flashcards", icon: "◇" },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.back}>← Về trang chủ</Link>
        <div className={styles.courseBrand}>
          <span>{meta.subject}</span><strong>{meta.grade}</strong>
          <small>{meta.book}</small>
        </div>
        <nav className={styles.nav} aria-label="Điều hướng khóa học">
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id ? styles.active : ""} onClick={() => openView(item.id)}>
              <i>{item.icon}</i><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className={styles.sideProgress}>
          <strong>{accuracy}%</strong><span>{progress.total} lượt đã làm</span>
          <div><i style={{ width: `${accuracy}%` }} /></div>
          <small>Độ chính xác</small>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.mobileHeader}>
          <Link href="/">←</Link><strong>{meta.shortTitle}</strong><span>{accuracy}%</span>
        </header>

        {view === "overview" && (
          <section className={styles.section}>
            <div className={styles.pageHeading}><div><span>{meta.sourceLabel}</span><h1>Tổng quan khóa học</h1></div><p>Phiên bản dữ liệu {meta.version}</p></div>
            <div className={styles.hero}>
              <div>
                <span className={styles.kicker}>HỌC HIỂU · LUYỆN ĐÚNG TRỌNG TÂM</span>
                <h2>{meta.title}</h2><p>{meta.description}</p>
                <button className={styles.primary} onClick={() => startQuiz(defaultQuestions, "Luyện nhanh 10 câu", 10)}>Bắt đầu 10 câu →</button>
              </div>
              <div className={styles.heroStats}>
                <article><strong>{lessons.length}</strong><span>{lessonLabel}</span></article>
                <article><strong>{chapters.length}</strong><span>{chapterLabel}</span></article>
                <article><strong>{questions.length}</strong><span>{itemLabel}</span></article>
                <article><strong>{new Set(questions.map((item) => item.type)).size}</strong><span>Dạng bài</span></article>
              </div>
            </div>
            <div className={styles.statsRow}>
              <article><strong>{accuracy}%</strong><span>Độ chính xác</span></article>
              <article><strong>{progress.total}</strong><span>Lượt đã luyện</span></article>
              <article><strong>{progress.wrong.length}</strong><span>Câu cần ôn lại</span></article>
            </div>
            <div className={styles.contentCard}><h3>Lộ trình gợi ý</h3><div className={styles.path}>
              {["Chọn bài học", "Luyện câu hỏi", "Xem giải thích", "Ôn lại câu sai"].map((label, index) => <div key={label}><b>0{index + 1}</b><span>{label}</span></div>)}
            </div></div>
          </section>
        )}

        {view === "lessons" && (
          <section className={styles.section}>
            <div className={styles.pageHeading}><div><span>{lessons.length} {lessonLabel.toUpperCase()}</span><h1>Luyện theo {lessonLabel.toLowerCase()}</h1></div></div>
            <input className={styles.search} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên bài hoặc chủ đề…" />
            <div className={styles.cardGrid}>{filteredLessons.map((lesson) => {
              const pool = questions.filter((question) => question.lesson === lesson.lesson);
              return <button className={styles.lessonCard} key={lesson.lesson} onClick={() => startQuiz(pool, `${lessonLabel} ${lesson.lesson}: ${lesson.title}`)}>
                <small>{lesson.chapter}</small><h3>{lessonLabel} {lesson.lesson}. {lesson.title}</h3><p>{lesson.page ? `Trang ${lesson.page} · ` : ""}{pool.length} {itemLabel.toLowerCase()}</p>
              </button>;
            })}</div>
          </section>
        )}

        {view === "topics" && (
          <section className={styles.section}><div className={styles.pageHeading}><div><span>{chapters.length} {chapterLabel.toUpperCase()}</span><h1>Luyện theo {chapterLabel.toLowerCase()}</h1></div></div>
            <div className={styles.cardGrid}>{chapters.map((chapter) => {
              const pool = questions.filter((question) => question.chapterId === chapter.chapterId);
              return <button className={styles.lessonCard} key={chapter.chapterId} onClick={() => startQuiz(pool, `${chapterLabel}: ${chapter.chapter}`)}><small>{chapter.chapterId}</small><h3>{chapter.chapter}</h3><p>{lessons.filter((lesson) => lesson.chapterId === chapter.chapterId).length} {lessonLabel.toLowerCase()} · {pool.length} {itemLabel.toLowerCase()}</p></button>;
            })}</div>
          </section>
        )}

        {view === "skills" && (
          <section className={styles.section}><div className={styles.pageHeading}><div><span>{skills.length} NHÓM KỸ NĂNG</span><h1>Luyện theo kỹ năng</h1></div></div>
            <div className={styles.cardGrid}>{skills.map((skill) => {
              const pool = questions.filter((question) => question.skill === skill);
              return <button className={styles.lessonCard} key={skill} onClick={() => startQuiz(pool, `Kỹ năng: ${skill}`)}><small>KỸ NĂNG</small><h3>{skill}</h3><p>{pool.length} {itemLabel.toLowerCase()}</p></button>;
            })}</div>
          </section>
        )}

        {view === "exam" && (
          <section className={styles.section}><div className={styles.pageHeading}><div><span>TẠO ĐỀ LINH HOẠT</span><h1>Đề kiểm tra</h1></div></div>
            <div className={styles.formCard}><label>Phạm vi<select value={examChapter} onChange={(event) => setExamChapter(event.target.value)}><option value="all">Tất cả chủ đề</option>{chapters.map((item) => <option key={item.chapterId} value={item.chapterId}>{item.chapter}</option>)}</select></label>
              <label>Mức độ<select value={examDifficulty} onChange={(event) => setExamDifficulty(event.target.value)}><option value="mix">Trộn mức độ</option>{difficulties.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}</select></label>
              <label>Số câu<select value={examCount} onChange={(event) => setExamCount(Number(event.target.value))}><option>10</option><option>15</option><option>20</option><option>30</option></select></label>
              <button className={styles.primary} onClick={startExam}>Bắt đầu làm bài</button>
            </div>
          </section>
        )}

        {view === "review" && (
          <section className={styles.section}><div className={styles.pageHeading}><div><span>ÔN TẬP CÁ NHÂN</span><h1>Câu cần luyện lại</h1></div></div>
            <div className={styles.emptyCard}>{wrongQuestions.length ? <><strong>{wrongQuestions.length} câu đang chờ ôn</strong><p>Làm đúng để câu hỏi tự động rời khỏi danh sách này.</p><button className={styles.primary} onClick={() => startQuiz(wrongQuestions, "Ôn câu làm sai")}>Bắt đầu ôn lại</button></> : <><strong>Chưa có câu nào cần ôn</strong><p>Các câu trả lời sai sẽ tự động được lưu tại đây.</p></>}</div>
          </section>
        )}

        {view === "flashcards" && flashQuestion && (
          <section className={styles.section}><div className={styles.pageHeading}><div><span>GHI NHỚ NHANH</span><h1>Flashcards</h1></div></div>
            <button className={styles.flashcard} onClick={() => setFlashBack((value) => !value)}>{flashBack ? <><small>ĐÁP ÁN</small><h2>{Array.isArray(flashQuestion.correct) ? flashQuestion.correct.join("; ") : flashQuestion.correct}</h2><p>{flashQuestion.explanation}</p></> : <><small>{lessonLabel.toUpperCase()} {flashQuestion.lesson}</small><h2>{flashQuestion.term ?? flashQuestion.question}</h2>{flashQuestion.meaning ? <p>Nghĩa của từ/cụm từ này là gì?</p> : <p>Bấm vào thẻ để xem đáp án</p>}</>}</button>
            <div className={styles.flashActions}><button onClick={() => { setFlashIndex((value) => (value - 1 + questions.length) % questions.length); setFlashBack(false); }}>← Trước</button><span>{flashIndex + 1}/{questions.length}</span><button onClick={() => { setFlashIndex((value) => (value + 1) % questions.length); setFlashBack(false); }}>Tiếp →</button></div>
          </section>
        )}

        {view === "quiz" && currentQuestion && (
          <section className={`${styles.section} ${styles.quizSection}`}>
            <div className={styles.quizTop}><button onClick={() => openView("overview")}>×</button><strong>{quizTitle}</strong><span>Câu {questionIndex + 1}/{queue.length}</span></div>
            <div className={styles.quizProgress}><i style={{ width: `${((questionIndex + (checked ? 1 : 0)) / queue.length) * 100}%` }} /></div>
            <div className={styles.questionCard}>
              <div className={styles.tags}><span>{currentQuestion.difficulty}</span><span>{currentQuestion.chapter}</span><span>{currentQuestion.skill}</span></div>
              <h1>{currentQuestion.question}</h1>
              {currentQuestion.type === "fill" ? <input className={styles.fillInput} value={String(answer)} disabled={checked} onChange={(event) => setAnswer(event.target.value)} placeholder="Nhập câu trả lời…" /> : <div className={styles.options}>{currentOptions.map((option, index) => {
                const selected = Array.isArray(answer) ? answer.includes(option) : answer === option;
                const correct = checked && (Array.isArray(currentQuestion.correct) ? currentQuestion.correct.includes(option) : normalize(option) === normalize(String(currentQuestion.correct)));
                const wrong = checked && selected && !correct;
                return <button key={option} className={`${selected ? styles.selected : ""} ${correct ? styles.correct : ""} ${wrong ? styles.wrong : ""}`} onClick={() => chooseOption(option)}><b>{String.fromCharCode(65 + index)}</b><span>{option}</span>{currentQuestion.type === "multi" && <i>{selected ? "✓" : ""}</i>}</button>;
              })}</div>}
              {checked && <div className={isCorrect(currentQuestion, answer) ? styles.goodFeedback : styles.badFeedback}><strong>{isCorrect(currentQuestion, answer) ? "Chính xác!" : `Đáp án: ${Array.isArray(currentQuestion.correct) ? currentQuestion.correct.join("; ") : currentQuestion.correct}`}</strong><p>{currentQuestion.explanation}</p></div>}
              <div className={styles.quizActions}>{!checked ? <button className={styles.primary} onClick={submitAnswer}>Kiểm tra đáp án</button> : <button className={styles.primary} onClick={nextQuestion}>{questionIndex + 1 === queue.length ? "Xem kết quả" : "Câu tiếp theo →"}</button>}</div>
            </div>
          </section>
        )}

        {view === "result" && (
          <section className={styles.section}><div className={styles.resultCard}><span>HOÀN THÀNH</span><h1>{result.score}/{result.total}</h1><p>Đúng {result.total ? Math.round((result.score / result.total) * 100) : 0}% trong lượt làm này.</p><div><button className={styles.primary} onClick={() => startQuiz(queue, quizTitle)}>Làm lại</button><button onClick={() => openView("lessons")}>Chọn bài khác</button></div></div></section>
        )}
      </main>

      <nav className={styles.mobileNav} aria-label="Điều hướng nhanh">
        {navItems.slice(0, 5).map((item) => <button key={item.id} className={view === item.id ? styles.active : ""} onClick={() => openView(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}
      </nav>
    </div>
  );
}
