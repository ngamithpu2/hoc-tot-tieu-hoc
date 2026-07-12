import fs from "node:fs";
import path from "node:path";

const sourcePath = path.resolve(
  "upload/khoa_hoc_4_kntt_giao_dien_benbella_arial(1).html",
);
const outputDir = path.resolve("data/courses/khoa-hoc-4-kntt/versions/v1");
const source = fs.readFileSync(sourcePath, "utf8");

function extractJson(name, until) {
  const pattern = until
    ? new RegExp(`const ${name} = (\\[.*?\\]);\\nconst ${until}`, "s")
    : new RegExp(`const ${name} = (\\[.*?\\]);`, "s");
  const match = source.match(pattern);
  if (!match) throw new Error(`Không tìm thấy ${name} trong file nguồn`);
  return JSON.parse(match[1]);
}

const questions = extractJson("QUESTION_BANK", "LESSONS");
const lessons = extractJson("LESSONS");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  path.join(outputDir, "questions.json"),
  `${JSON.stringify(questions, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(outputDir, "lessons.json"),
  `${JSON.stringify(lessons, null, 2)}\n`,
);

console.log(`Đã trích xuất ${lessons.length} bài và ${questions.length} câu hỏi.`);
