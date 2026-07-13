import type { Metadata } from "next";
import { ENGLISH_APP_PATH } from "@/data/courses/tieng-anh-4-ben-bella/html-app";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Ben & Bella — Luyện Từ Vựng Tiếng Anh",
  description: "Ứng dụng luyện từ vựng Tiếng Anh 4 Ben & Bella.",
};

export default function English4BenBellaPage() {
  return (
    <main className={styles.page}>
      <iframe
        className={styles.app}
        src={ENGLISH_APP_PATH}
        title="Ben & Bella — Luyện Từ Vựng Tiếng Anh"
      />
    </main>
  );
}
