// POST /api/remove — 비밀번호 검증 → GitHub 목록에서 해당 작품 제거
import { json, ghGet, ghPut, removeSubmission } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!env.ADMIN_PASSWORD || body.password !== env.ADMIN_PASSWORD) return json({ error: '비밀번호가 틀렸습니다.' }, 401);
    const { list, sha } = await ghGet(env);
    const next = removeSubmission(list, body.publicKey);
    await ghPut(env, next, sha, '작품 삭제');
    return json({ ok: true, list: next });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
