// Cloudflare Pages Functions 공용 헬퍼: 목록 가공 + GitHub 읽기/쓰기 + base64
export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

export function cleanList(list) {
  return (Array.isArray(list) ? list : []).filter(s => s && s.publicKey && s.publicKey !== 'REPLACE_ME');
}
export function addSubmission(list, name, publicKey) {
  const base = cleanList(list).filter(s => s.publicKey !== publicKey); // 같은 키 교체(중복 방지)
  return [...base, { name: String(name || '').trim(), publicKey }];
}
export function removeSubmission(list, publicKey) {
  return cleanList(list).filter(s => s.publicKey !== publicKey);
}

const repo = env => env.GITHUB_REPO || 'jkjkjkjkjk72-ux/Web-APK';
const file = env => env.SUBMISSIONS_PATH || 'submissions.json';
const ghHeaders = env => ({ Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'cf-web-apk' });

export async function ghGet(env) {
  const r = await fetch(`https://api.github.com/repos/${repo(env)}/contents/${file(env)}`, { headers: ghHeaders(env) });
  if (r.status === 404) return { list: [], sha: null };
  if (!r.ok) throw new Error(`GitHub 읽기 실패(${r.status}): ${await r.text()}`);
  const d = await r.json();
  let list = [];
  try { list = JSON.parse(b64decodeUtf8(d.content)); } catch {}
  return { list: cleanList(list), sha: d.sha };
}
export async function ghPut(env, list, sha, message) {
  const content = b64encodeUtf8(JSON.stringify(list, null, 2) + '\n');
  const r = await fetch(`https://api.github.com/repos/${repo(env)}/contents/${file(env)}`, {
    method: 'PUT', headers: ghHeaders(env),
    body: JSON.stringify({ message, content, ...(sha ? { sha } : {}) })
  });
  if (!r.ok) throw new Error(`GitHub 저장 실패(${r.status}): ${await r.text()}`);
}

// 작은 JSON 문자열용 base64 (UTF-8 안전). APK 파일은 base64 안 거치고 그대로 Appetize에 전송.
export function b64encodeUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
export function b64decodeUtf8(b64) {
  const bin = atob(String(b64).replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
