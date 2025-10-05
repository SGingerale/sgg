const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ==== 設定 ====
const POSTS_DIR = path.join(__dirname, "../posts");

// 日時フォルダ名を生成（例：20251006-0310）
function getTimestampFolderName() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  return `${yyyy}${mm}${dd}-${hh}${min}`;
}

// テンプレート
const TEMPLATE = ({ title, imagePath, caption }) => `---
title: "${title}"
layout: layout.njk
image: ${imagePath}
---

${caption}
`;

// --- メイン処理 ---
async function main() {
  const imagePath = process.argv[2];
  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error("❌ 画像ファイルパスを指定してください");
    process.exit(1);
  }

  // 画像情報
  const ext = path.extname(imagePath);
  const imageFileName = path.basename(imagePath);

  // フォルダ名
  const folderName = getTimestampFolderName();
  const postDir = path.join(POSTS_DIR, folderName);

  // CLI入力プロンプト
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 入力をPromise化
  const question = (q) =>
    new Promise((res) => rl.question(q, (answer) => res(answer)));

  // タイトル・キャプション入力
  let title = await question("📝 投稿のタイトルを入力してください（未入力で自動）: ");
  const caption = await question("🗒️ キャプションを入力してください（空欄でも可）: ");
  rl.close();

  if (!title.trim()) {
    title = folderName;  // ← タイトルが空なら日時を使う
  }

  // フォルダ作成
  fs.mkdirSync(postDir, { recursive: true });

  // 画像コピー
  const destImagePath = path.join(postDir, imageFileName);
  fs.copyFileSync(imagePath, destImagePath);

  // index.md 作成
  const mdPath = path.join(postDir, "index.md");
  const imageMarkdownPath = `/posts/${folderName}/${imageFileName}`;
  const mdContent = TEMPLATE({ title, imagePath: imageMarkdownPath, caption });
  fs.writeFileSync(mdPath, mdContent);

  console.log(`✅ 投稿作成完了: posts/${folderName}/`);
}

main();
