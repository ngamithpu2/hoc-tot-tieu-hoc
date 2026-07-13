"use client";

import { useMemo, useState } from "react";
import { courseCatalog as courses } from "@/data/course-catalog";

const gradeOptions = ["Tất cả", "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"];

export default function Home() {
  const [grade, setGrade] = useState("Tất cả");
  const [loginOpen, setLoginOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);

  const visibleCourses = useMemo(
    () => (grade === "Tất cả" ? courses : courses.filter((course) => course.grade === grade)),
    [grade],
  );

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Học Tốt Tiểu Học - Trang chủ">
          <span className="brand-mark">H</span>
          <span>Học Tốt <b>Tiểu Học</b></span>
        </a>
        <nav aria-label="Điều hướng chính">
          <a href="#courses">Khóa học</a>
          <a href="#journey">Lộ trình</a>
          <a href="#trial">Học thử</a>
          <a href="#parents">Dành cho phụ huynh</a>
        </nav>
        <div className="header-actions">
          <button className="cart-button" aria-label="Giỏ hàng chưa có khóa học">
            Giỏ hàng <span>0</span>
          </button>
          <button className="button button-small" onClick={() => setLoginOpen(true)}>Đăng nhập</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>★</span> Mỗi ngày một chặng nhỏ</div>
          <h1>Biến việc học thành<br/><em>một hành trình tiến bộ</em></h1>
          <p>Khóa học tiểu học bám sát kiến thức cốt lõi, giúp con hiểu bài, luyện tập đúng trọng tâm và nhìn thấy sự tiến bộ sau mỗi chặng.</p>
          <div className="hero-actions">
            <a className="button" href="#courses">Khám phá khóa học <span>→</span></a>
            <a className="text-link" href="#trial"><span className="play">▶</span> Học thử miễn phí</a>
          </div>
          <div className="trust-row">
            <div className="avatars" aria-hidden="true"><span>TV</span><span>KH</span><span>EN</span></div>
            <p><b>Đã có 3 khóa học lớp 4</b><br/>Tiếng Việt, Khoa học và Tiếng Anh</p>
          </div>
        </div>

        <div className="journey-card" aria-label="Minh họa hành trình học tập">
          <div className="card-topline">
            <span>HÀNH TRÌNH CỦA MINH AN</span>
            <span className="level">Lớp 4</span>
          </div>
          <div className="progress-copy"><strong>Tuần này</strong><span>4/5 chặng</span></div>
          <div className="progress"><span /></div>
          <div className="map">
            <div className="path path-one" />
            <div className="path path-two" />
            <div className="stop done stop-one"><span>✓</span><small>Khởi động</small></div>
            <div className="stop done stop-two"><span>✓</span><small>Kiến thức</small></div>
            <div className="stop active stop-three"><span>3</span><small>Luyện tập</small></div>
            <div className="stop stop-four"><span>4</span><small>Thử thách</small></div>
            <div className="trophy">🏆<small>Về đích</small></div>
            <div className="mascot">★<i>✎</i></div>
          </div>
          <div className="achievement"><span>⚡</span><div><b>Chuỗi học 7 ngày!</b><small>Con đang tiến bộ rất đều</small></div><strong>+50 XP</strong></div>
        </div>
        <span className="hero-dot dot-one"/><span className="hero-dot dot-two"/><span className="hero-spark">✦</span>
      </section>

      <section className="benefits" aria-label="Lợi ích nổi bật">
        <article><span className="benefit-icon mint">✓</span><div><b>Bám sát chương trình</b><p>Nội dung hệ thống theo từng lớp, từng môn</p></div></article>
        <article><span className="benefit-icon yellow">↗</span><div><b>Thấy rõ tiến bộ</b><p>Báo cáo theo từng kỹ năng và chặng học</p></div></article>
        <article><span className="benefit-icon coral">♡</span><div><b>Học đúng nhịp của con</b><p>Luyện lại không giới hạn, không tạo áp lực</p></div></article>
      </section>

      <section className="section courses-section" id="courses">
        <div className="section-heading">
          <div><span className="section-kicker">KHÓA HỌC NỔI BẬT</span><h2>Chọn đúng chặng, học đúng trọng tâm</h2></div>
          <p>Mỗi khóa học là một hành trình rõ ràng từ kiến thức cốt lõi đến luyện tập và kiểm tra.</p>
        </div>
        <div className="grade-filter" aria-label="Lọc khóa học theo lớp">
          {gradeOptions.map((item) => <button key={item} className={grade === item ? "active" : ""} onClick={() => setGrade(item)}>{item}</button>)}
        </div>
        <div className="course-grid">
          {visibleCourses.length ? visibleCourses.map((course) => (
            <article className="course-card" key={course.title}>
              <div className={`course-cover ${course.tone}`}>
                <span className="course-grade">{course.grade}</span><span className="course-icon">{course.icon}</span>
                <div><small>{course.subject}</small><strong>{course.title}</strong></div>
              </div>
              <div className="course-body">
                <p>{course.description}</p>
                <div className="course-meta"><span>▤ {course.lessons} bài học</span><span>✎ {course.questions} câu hỏi</span></div>
                <div className="course-footer"><strong>{course.status}</strong><a href={`/lop-4/khoa-hoc/${course.slug}`}>Bắt đầu học →</a></div>
              </div>
            </article>
          )) : <div className="empty-state">Khóa học {grade} đang được hoàn thiện. Sếp có thể tiếp tục khám phá các lớp khác.</div>}
        </div>
      </section>

      <section className="section journey-section" id="journey">
        <div className="section-heading centered"><span className="section-kicker">LỘ TRÌNH HỌC TẬP</span><h2>Một bài học, bốn chặng tiến bộ</h2><p>Con không chỉ chọn đáp án — con được dẫn dắt để hiểu, luyện và tự kiểm tra.</p></div>
        <div className="steps">
          <article><span>01</span><div className="step-symbol">◉</div><h3>Khởi động</h3><p>Câu hỏi ngắn giúp con nhớ lại kiến thức liên quan.</p></article>
          <article><span>02</span><div className="step-symbol">✦</div><h3>Nắm kiến thức</h3><p>Nội dung trọng tâm được trình bày ngắn gọn, dễ hiểu.</p></article>
          <article><span>03</span><div className="step-symbol">✎</div><h3>Luyện tập</h3><p>Bài tập đa dạng, có giải thích ngay sau mỗi câu.</p></article>
          <article><span>04</span><div className="step-symbol">🏅</div><h3>Chinh phục</h3><p>Bài kiểm tra giúp con xác nhận mức độ thành thạo.</p></article>
        </div>
      </section>

      <section className="section trial-section" id="trial">
        <div className="trial-copy">
          <span className="section-kicker">HỌC THỬ NGAY</span>
          <h2>Con thử sức với một câu hỏi nhé!</h2>
          <p>Ví dụ từ khóa “Khoa học 4 · Kết nối tri thức”.</p>
          <div className="mini-report"><span>💡</span><div><b>Không cần đăng nhập</b><small>Nhận kết quả và lời giải ngay sau khi trả lời</small></div></div>
        </div>
        <div className="quiz-card">
          <div className="quiz-head"><span>CÂU HỌC THỬ</span><span>Khoa học 4</span></div>
          <div className="quiz-progress"><span/></div>
          <h3>Thực vật cần những yếu tố nào để sống và phát triển?</h3>
          <div className="answers">
            {["A. Chỉ cần nước", "B. Nước, không khí, ánh sáng và chất khoáng", "C. Chỉ cần ánh sáng", "D. Chỉ cần đất"].map((item, index) => (
              <button key={item} onClick={() => setAnswer(index)} className={answer === index ? (index === 1 ? "correct" : "wrong") : ""}>{item}<span>{answer === index ? (index === 1 ? "✓" : "×") : ""}</span></button>
            ))}
          </div>
          {answer !== null && <div className={answer === 1 ? "feedback good" : "feedback"}>{answer === 1 ? "Chính xác! Cây cần đủ nước, không khí, ánh sáng và chất khoáng." : "Chưa đúng. Con hãy nhớ các điều kiện cần thiết để thực vật sống và phát triển."}</div>}
        </div>
      </section>

      <section className="section parent-section" id="parents">
        <div className="parent-panel">
          <div><span className="section-kicker light">DÀNH CHO PHỤ HUYNH</span><h2>Một tài khoản, đồng hành cùng từng con</h2><p>Mua khóa học, tạo hồ sơ học sinh và theo dõi tiến độ riêng biệt. Phụ huynh luôn biết con đã học gì, đang vướng ở đâu và nên luyện tiếp nội dung nào.</p><button className="button button-light" onClick={() => setLoginOpen(true)}>Bắt đầu cùng con →</button></div>
          <div className="report-card"><div className="report-head"><span className="student-avatar">MA</span><div><b>Minh An</b><small>Lớp 4 · Tuần 08–14/07</small></div><span className="status">Đang tiến bộ</span></div><div className="score-row"><div><strong>82%</strong><span>Hoàn thành</span></div><div><strong>7</strong><span>Ngày liên tục</span></div><div><strong>+12%</strong><span>So với tuần trước</span></div></div><div className="skill"><span>Đọc bản đồ</span><b>90%</b><i><em style={{width:"90%"}}/></i></div><div className="skill"><span>Dòng thời gian</span><b>72%</b><i><em style={{width:"72%"}}/></i></div></div>
        </div>
      </section>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">H</span><span>Học Tốt <b>Tiểu Học</b></span></a><p>Học chắc từng chặng. Tiến bộ mỗi ngày.</p><div><a href="#courses">Khóa học</a><a href="#trial">Học thử</a><a href="#parents">Phụ huynh</a></div><small>© 2026 Học Tốt Tiểu Học</small></footer>

      {loginOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setLoginOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Đóng" onClick={() => setLoginOpen(false)}>×</button><span className="modal-logo">H</span><h2 id="login-title">Chào mừng quay lại</h2><p>Đăng nhập để quản lý khóa học và theo dõi hành trình của con.</p><label>Email<input type="email" placeholder="phuhuynh@email.com"/></label><label>Mật khẩu<input type="password" placeholder="••••••••"/></label><button className="button modal-submit" onClick={() => setLoginOpen(false)}>Đăng nhập</button><small>Bản thử nghiệm giao diện — kết nối tài khoản Supabase ở bước tiếp theo.</small></div></div>}
    </main>
  );
}
