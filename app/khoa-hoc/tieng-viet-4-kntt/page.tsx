import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tiếng Việt 4 · Kết nối tri thức | EduBee",
  description: "Khóa học Tiếng Việt lớp 4 gồm Tập 1 và Tập 2, được cập nhật độc lập.",
};

export default function Vietnamese4CoursePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← Về danh sách khóa học</Link>
        <span className={styles.grade}>Lớp 4</span>
      </header>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
          <h1>Tiếng Việt lớp 4</h1>
          <p>Khóa học được chia thành hai tập độc lập. Tiến độ, dữ liệu và phiên bản của từng tập được quản lý riêng để cập nhật an toàn.</p>
        </div>
        <div className={styles.summary}>
          <strong>2</strong>
          <span>Tập học</span>
          <i><b /></i>
          <small>Đã hoàn thiện 1/2 tập</small>
        </div>
      </section>

      <section className={styles.volumes} aria-label="Chọn tập học">
        <article className={`${styles.volumeCard} ${styles.ready}`}>
          <div className={styles.cardTop}>
            <span className={styles.number}>01</span>
            <span className={styles.status}>Đã sẵn sàng</span>
          </div>
          <div>
            <small>HỌC KÌ I</small>
            <h2>Tập 1</h2>
            <p>Học theo bài, chủ điểm và kỹ năng; luyện hai cấp độ cơ bản – nâng cao.</p>
          </div>
          <dl className={styles.stats}>
            <div><dt>32</dt><dd>Bài học</dd></div>
            <div><dt>4</dt><dd>Chủ điểm</dd></div>
            <div><dt>869</dt><dd>Câu hỏi</dd></div>
          </dl>
          <div className={styles.banks}>
            <span>506 câu cơ bản</span>
            <span>363 câu nâng cao</span>
          </div>
          <Link className={styles.start} href="/khoa-hoc/tieng-viet-4-kntt/tap-1">
            Bắt đầu học Tập 1 <span>→</span>
          </Link>
        </article>

        <article className={`${styles.volumeCard} ${styles.upcoming}`} aria-label="Tập 2, sắp cập nhật">
          <div className={styles.cardTop}>
            <span className={styles.number}>02</span>
            <span className={styles.waiting}>Sắp cập nhật</span>
          </div>
          <div>
            <small>HỌC KÌ II</small>
            <h2>Tập 2</h2>
            <p>Cấu trúc đã được dành riêng. Nội dung Tập 2 sẽ được nhập từ file riêng ở lần cập nhật sau.</p>
          </div>
          <div className={styles.placeholder}>
            <span>○</span>
            <p>Chưa có dữ liệu</p>
          </div>
          <button type="button" disabled>Chưa thể bắt đầu</button>
        </article>
      </section>

      <section className={styles.note}>
        <b>Cập nhật độc lập</b>
        <p>Khi bổ sung Tập 2, hệ thống chỉ thêm dữ liệu và phiên bản của Tập 2; Tập 1 vẫn giữ nguyên và có thể hoàn tác riêng.</p>
      </section>
    </main>
  );
}
