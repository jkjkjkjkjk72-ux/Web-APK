// 호스팅용 통합 서버: 한 페이지에서 누구나 시연 + 비밀번호 잠긴 주최측 업로드. 목록은 GitHub에 저장
import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cleanList, addSubmission, removeSubmission } from './lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPETIZE_KEY = process.env.APPETIZE_API_KEY;
const GH_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO || 'jkjkjkjkjk72-ux/Web-APK';
const FILE = process.env.SUBMISSIONS_PATH || 'submissions.json';
const ADMIN_PW = process.env.ADMIN_PASSWORD || '';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

// GitHub 저장소의 submissions.json 읽기/쓰기 (토큰으로 인증)
async function ghGet() {
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'web-apk-contest' }
  });
  if (r.status === 404) return { list: [], sha: null };
  if (!r.ok) throw new Error(`GitHub 읽기 실패(${r.status}): ${await r.text()}`);
  const d = await r.json();
  let list = [];
  try { list = JSON.parse(Buffer.from(d.content, 'base64').toString('utf8')); } catch {}
  return { list: cleanList(list), sha: d.sha };
}
async function ghPut(list, sha, message) {
  const content = Buffer.from(JSON.stringify(list, null, 2) + '\n').toString('base64');
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'web-apk-contest' },
    body: JSON.stringify({ message, content, ...(sha ? { sha } : {}) })
  });
  if (!r.ok) throw new Error(`GitHub 저장 실패(${r.status}): ${await r.text()}`);
}

function denyIfBadPw(req, res) {
  if (!ADMIN_PW) { res.status(500).json({ error: '서버에 ADMIN_PASSWORD 미설정.' }); return true; }
  if ((req.body.password || '') !== ADMIN_PW) { res.status(401).json({ error: '비밀번호가 틀렸습니다.' }); return true; }
  return false;
}

app.get('/api/list', async (req, res) => {
  try { res.json({ list: (await ghGet()).list }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/add', upload.single('apk'), async (req, res) => {
  try {
    if (denyIfBadPw(req, res)) return;
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: '작품 이름을 입력하세요.' });
    if (!req.file) return res.status(400).json({ error: 'APK 파일을 선택하세요.' });
    if (!APPETIZE_KEY) return res.status(500).json({ error: '서버에 APPETIZE_API_KEY 미설정.' });

    const form = new FormData();
    form.append('platform', 'android');
    form.append('file', new Blob([req.file.buffer]), req.file.originalname || 'app.apk');
    const ar = await fetch('https://api.appetize.io/v1/apps', { method: 'POST', headers: { 'X-API-KEY': APPETIZE_KEY }, body: form });
    const text = await ar.text();
    if (!ar.ok) return res.status(400).json({ error: `Appetize 업로드 실패: ${text}` });
    const publicKey = JSON.parse(text).publicKey;
    if (!publicKey) return res.status(400).json({ error: `publicKey 없음: ${text}` });

    const { list, sha } = await ghGet();
    const next = addSubmission(list, name, publicKey);
    await ghPut(next, sha, `작품 추가: ${name}`);
    res.json({ ok: true, list: next });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/remove', async (req, res) => {
  try {
    if (denyIfBadPw(req, res)) return;
    const { list, sha } = await ghGet();
    const next = removeSubmission(list, req.body.publicKey);
    await ghPut(next, sha, '작품 삭제');
    res.json({ ok: true, list: next });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`통합 서버 가동: 포트 ${PORT}, 저장소 ${REPO}`));
