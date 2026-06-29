// POST /api/add — 비밀번호 검증 → APK를 Appetize 업로드 → GitHub 목록에 저장
import { json, ghGet, ghPut, addSubmission } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const password = (form.get('password') || '').toString();
    if (!env.ADMIN_PASSWORD) return json({ error: '서버에 ADMIN_PASSWORD 미설정.' }, 500);
    if (password !== env.ADMIN_PASSWORD) return json({ error: '비밀번호가 틀렸습니다.' }, 401);

    const name = (form.get('name') || '').toString().trim();
    const apk = form.get('apk');
    if (!name) return json({ error: '작품 이름을 입력하세요.' }, 400);
    if (!apk || typeof apk === 'string') return json({ error: 'APK 파일을 선택하세요.' }, 400);
    if (!env.APPETIZE_API_KEY) return json({ error: '서버에 APPETIZE_API_KEY 미설정.' }, 500);

    const up = new FormData();
    up.append('platform', 'android');
    up.append('file', apk, apk.name || 'app.apk');
    const ar = await fetch('https://api.appetize.io/v1/apps', { method: 'POST', headers: { 'X-API-KEY': env.APPETIZE_API_KEY }, body: up });
    const text = await ar.text();
    if (!ar.ok) return json({ error: `Appetize 업로드 실패: ${text}` }, 400);
    const publicKey = JSON.parse(text).publicKey;
    if (!publicKey) return json({ error: `publicKey 없음: ${text}` }, 400);

    const { list, sha } = await ghGet(env);
    const next = addSubmission(list, name, publicKey);
    await ghPut(env, next, sha, `작품 추가: ${name}`);
    return json({ ok: true, list: next });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
