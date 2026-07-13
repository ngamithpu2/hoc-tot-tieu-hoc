import type { Metadata } from "next";
import Link from "next/link";
import { VIETNAMESE_4_VOLUME_1_APP_PATH } from "@/data/courses/tieng-viet-4-kntt-tap-1/html-app";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tiếng Việt 4 · Tập 1 | EduBee",
  description: "Luyện tập Tiếng Việt lớp 4 Tập 1 theo hai cấp độ cơ bản và nâng cao.",
};

export default function Vietnamese4Volume1Page() {
  return (
    <main className={styles.page}>
      <iframe
        className={styles.app}
        src={VIETNAMESE_4_VOLUME_1_APP_PATH}
        title="Tiếng Việt lớp 4 · Tập 1"
      />
      <Link className={styles.back} href="/khoa-hoc/tieng-viet-4-kntt" aria-label="Quay lại chọn tập">
        ← Chọn tập
      </Link>
    </main>
  );
}
