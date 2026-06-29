// GET /api/list — GitHub의 submissions.json 목록 반환
import { json, ghGet } from '../_lib.js';

export async function onRequestGet({ env }) {
  try {
    return json({ list: (await ghGet(env)).list });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
