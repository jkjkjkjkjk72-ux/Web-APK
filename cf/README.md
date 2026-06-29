# Cloudflare Pages 배포 (카드 없이 무료, 안 잠듦)

한 페이지에서 **누구나 시연 + 비밀번호 아는 주최측만 APK 추가**. 목록은 GitHub `submissions.json`에 저장.
Cloudflare는 가입에 카드가 필요 없다.

## 준비물
- **GitHub 토큰**: 이미 발급한 것 재사용(없으면 fine-grained, `Web-APK` 저장소, Contents 읽기/쓰기).
- **Appetize 키**: `apikey.txt`에 넣은 `tok_...` 값.
- **관리자 비밀번호**: 내가 정한 것.

## 1. Cloudflare 가입
[dash.cloudflare.com](https://dash.cloudflare.com) → Sign up (무료, 카드 안 받음).

## 2. Pages 프로젝트 만들기
1. 좌측 **Workers & Pages** → **Create** → **Pages** 탭 → **Connect to Git**.
2. GitHub 연동 후 **`Web-APK`** 저장소 선택.
3. **Set up builds and deployments**:
   - **Project name**: 아무거나 (예: `apk-contest`) → 주소가 `apk-contest.pages.dev`가 됨.
   - **Production branch**: `main`
   - **Framework preset**: **None**
   - **Build command**: (비워둠)
   - **Build output directory**: `/`
   - **Root directory (advanced)** 펼치기 → **`cf`** 입력  ← 중요(코드가 cf 폴더에 있음)
4. **Save and Deploy**.

## 3. 환경변수 4개 넣기
프로젝트 → **Settings → Environment variables → Production** → **Add variable** 로 4개:

| 변수 | 값 |
|---|---|
| `APPETIZE_API_KEY` | `tok_...` (Appetize 키) |
| `GITHUB_TOKEN` | 발급한 GitHub 토큰 |
| `ADMIN_PASSWORD` | 내가 정한 비밀번호 |
| `GITHUB_REPO` | `jkjkjkjkjk72-ux/Web-APK` |

넣은 뒤 **Deployments → 최신 배포 → Retry deployment**(또는 재배포)해야 변수가 적용됨.

## 4. 완료
`https://<프로젝트>.pages.dev` 열기 → 제출작 갤러리(▶실행) + 맨 아래 **주최측 — 작품 추가**(비번 + 이름 + APK).

## 참고
- 무료·카드X·슬립 없음(첫 접속도 빠름).
- 비번 전송은 HTTPS라 암호화됨.
- 작품 목록은 `Web-APK` 저장소의 `submissions.json` 하나로 관리(기존 정적 사이트와 공유).
