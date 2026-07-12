import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const sourcePath = path.resolve("upload/BenBella_UNIFIED(1).html");
const outputDir = path.resolve("data/courses/tieng-anh-4-ben-bella");
const source = fs.readFileSync(sourcePath, "utf8");

const cardsMatch = source.match(/const CARDS = (\[.*?\]);\n/s);
const seriesMatch = source.match(/const SERIES_INFO = (\[.*?\]);/s);
if (!cardsMatch || !seriesMatch) throw new Error("Không tìm thấy CARDS hoặc SERIES_INFO");

const cards = JSON.parse(cardsMatch[1]).map((card) => ({
  ...card,
  example: card.example.replaceAll("**", "").trim(),
}));
const seriesInfo = vm.runInNewContext(`(${seriesMatch[1]})`);
const seriesNames = new Map(seriesInfo.map((item) => [item.n, item.name]));
const tapNames = new Map();
for (const series of seriesInfo) {
  for (const tap of series.taps ?? []) tapNames.set(`${series.n}-${tap.n}`, tap.name);
}

const levelToDifficulty = {
  "A1-A2": "Nền tảng",
  "A2-B1": "Mở rộng",
  "B1-B2": "Nâng cao",
};

const pairs = [...new Set(cards.map((card) => `${card.series}-${card.tap}`))]
  .map((key) => key.split("-").map(Number))
  .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
const lessonNumber = new Map(pairs.map(([series, tap], index) => [`${series}-${tap}`, index + 1]));

const lessons = pairs.map(([series, tap], index) => {
  const group = cards.filter((card) => card.series === series && card.tap === tap);
  return {
    chapterId: `S${String(series).padStart(2, "0")}`,
    chapter: seriesNames.get(series) ?? `Loạt ${series}`,
    lesson: index + 1,
    title: tapNames.get(`${series}-${tap}`) ?? `Tập ${tap}`,
    level: group[0]?.level ?? "",
  };
});

function optionsFor(card, index) {
  const local = cards.filter(
    (candidate) =>
      candidate.level === card.level &&
      candidate.meaning !== card.meaning,
  );
  const picked = [];
  for (let offset = 1; picked.length < 3 && offset < local.length + 1; offset += 1) {
    const candidate = local[(index + offset * 23) % local.length]?.meaning;
    if (candidate && !picked.includes(candidate)) picked.push(candidate);
  }
  const options = [card.meaning, ...picked];
  const shift = card.id % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
}

const questions = cards.map((card, index) => ({
  id: `EN4_BB_${String(card.id).padStart(4, "0")}`,
  chapterId: `S${String(card.series).padStart(2, "0")}`,
  chapter: seriesNames.get(card.series) ?? `Loạt ${card.series}`,
  lesson: lessonNumber.get(`${card.series}-${card.tap}`),
  type: "mcq",
  question: `“${card.word}” có nghĩa là gì?`,
  options: optionsFor(card, index),
  correct: card.meaning,
  explanation: `${card.word} — ${card.meaning}. Ví dụ: ${card.example}`,
  difficulty: levelToDifficulty[card.level] ?? "Mở rộng",
  skill: card.type === "phrase" ? "Từ và cụm từ" : "Từ vựng",
  level: card.level,
  term: card.word,
  meaning: card.meaning,
  example: card.example,
}));

fs.mkdirSync(outputDir, { recursive: true });
for (const [name, value] of [
  ["vocabulary.json", cards],
  ["lessons.json", lessons],
  ["questions.json", questions],
]) {
  fs.writeFileSync(path.join(outputDir, name), `${JSON.stringify(value, null, 2)}\n`);
}

console.log(`Đã trích xuất ${cards.length} mục từ, ${lessons.length} chặng và ${questions.length} câu luyện.`);
