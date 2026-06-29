// 작품 목록(submissions) 추가·삭제·키파싱 순수 헬퍼 — 네트워크 없이 테스트 가능
export function cleanList(list) {
  return (Array.isArray(list) ? list : []).filter(s => s && s.publicKey && s.publicKey !== 'REPLACE_ME');
}

export function addSubmission(list, name, publicKey) {
  const base = cleanList(list).filter(s => s.publicKey !== publicKey); // 같은 키 중복 방지(교체)
  return [...base, { name: String(name || '').trim(), publicKey }];
}

export function removeSubmission(list, publicKey) {
  return cleanList(list).filter(s => s.publicKey !== publicKey);
}

export function playUrl(publicKey) {
  return `https://appetize.io/app/${publicKey}`;
}
