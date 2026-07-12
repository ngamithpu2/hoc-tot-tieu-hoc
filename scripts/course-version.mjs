import fs from "node:fs";
import path from "node:path";

const [, , command, slug, requestedVersion] = process.argv;
if (!command || !slug) {
  console.error("Cách dùng: node scripts/course-version.mjs <clone|validate|activate> <slug> [vN]");
  process.exit(1);
}

const courseDir = path.resolve("data/courses", slug);
const indexPath = path.join(courseDir, "index.ts");
if (!fs.existsSync(indexPath)) throw new Error(`Không tìm thấy khóa học: ${slug}`);

function getActiveVersion() {
  const source = fs.readFileSync(indexPath, "utf8");
  const match = source.match(/ACTIVE_VERSION = "(v\d+)"/);
  if (!match) throw new Error(`Không đọc được ACTIVE_VERSION của ${slug}`);
  return match[1];
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validate(version) {
  const versionDir = path.join(courseDir, "versions", version);
  const required = ["course.json", "lessons.json", "questions.json"];
  for (const file of required) {
    if (!fs.existsSync(path.join(versionDir, file))) throw new Error(`Thiếu ${file} trong ${slug}/${version}`);
  }
  const meta = readJson(path.join(versionDir, "course.json"));
  const lessons = readJson(path.join(versionDir, "lessons.json"));
  const questions = readJson(path.join(versionDir, "questions.json"));
  if (meta.slug !== slug) throw new Error(`Slug trong course.json không khớp: ${meta.slug}`);
  if (!Array.isArray(lessons) || !lessons.length) throw new Error("Danh sách bài/chặng trống");
  if (!Array.isArray(questions) || !questions.length) throw new Error("Ngân hàng câu hỏi trống");

  const lessonIds = new Set(lessons.map((item) => item.lesson));
  const questionIds = new Set();
  for (const question of questions) {
    if (!question.id || questionIds.has(question.id)) throw new Error(`ID câu hỏi thiếu hoặc trùng: ${question.id}`);
    questionIds.add(question.id);
    if (!lessonIds.has(question.lesson)) throw new Error(`${question.id} trỏ tới bài/chặng không tồn tại`);
    if (["mcq", "tf"].includes(question.type) && !question.options?.includes(question.correct)) {
      throw new Error(`${question.id} có đáp án không tồn tại trong options`);
    }
    if (question.type === "multi" && question.correct.some((answer) => !question.options?.includes(answer))) {
      throw new Error(`${question.id} có đáp án nhiều lựa chọn không hợp lệ`);
    }
  }
  console.log(`Hợp lệ: ${slug}/${version} · ${lessons.length} bài/chặng · ${questions.length} câu/mục.`);
}

const activeVersion = getActiveVersion();
const version = requestedVersion ?? activeVersion;

if (command === "validate") {
  validate(version);
} else if (command === "clone") {
  if (!requestedVersion || !/^v\d+$/.test(requestedVersion)) throw new Error("Cần chỉ định phiên bản mới dạng v2, v3...");
  const sourceDir = path.join(courseDir, "versions", activeVersion);
  const targetDir = path.join(courseDir, "versions", requestedVersion);
  if (fs.existsSync(targetDir)) throw new Error(`${slug}/${requestedVersion} đã tồn tại`);
  fs.cpSync(sourceDir, targetDir, { recursive: true, errorOnExist: true });
  const metaPath = path.join(targetDir, "course.json");
  const meta = readJson(metaPath);
  meta.version = Number(requestedVersion.slice(1));
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  console.log(`Đã tạo ${slug}/${requestedVersion} từ ${activeVersion}. Phiên bản đang chạy chưa thay đổi.`);
} else if (command === "activate") {
  if (!requestedVersion) throw new Error("Cần chỉ định phiên bản muốn kích hoạt");
  validate(requestedVersion);
  const source = fs.readFileSync(indexPath, "utf8")
    .replace(/ACTIVE_VERSION = "v\d+"/, `ACTIVE_VERSION = "${requestedVersion}"`)
    .replaceAll(`/versions/${activeVersion}/`, `/versions/${requestedVersion}/`);
  fs.writeFileSync(indexPath, source);
  console.log(`Đã chuyển riêng ${slug}: ${activeVersion} → ${requestedVersion}.`);
} else {
  throw new Error(`Lệnh không hợp lệ: ${command}`);
}
