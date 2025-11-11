
const BASE = "https://marcconrad.com/uob/heart/api.php";

export async function fetchHeartQuestion() {
  const url = `${BASE}?out=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch question");
  const j = await res.json();
  // j shape may vary; return normalized object:
  // try to find image url and solution
  const keys = Object.keys(j || {});
  let image = null;
  let solution = null;
  keys.forEach(k => {
    const v = j[k];
    if (!image && typeof v === "string" && (v.startsWith("http://") || v.startsWith("https://"))) {
      image = v;
    }
    if (!solution && (k.toLowerCase().includes("solution") || k.toLowerCase().includes("answer") || k.toLowerCase() === "solution")) {
      solution = v;
    }
  });
  // fallback: some APIs include "img" or similar
  if (!image && j.img) image = j.img;
  return { raw: j, image, solution, id: j.id || j.qid || null };
}
