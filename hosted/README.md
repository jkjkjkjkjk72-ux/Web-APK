# 통합 호스팅 버전 (한 페이지 = 시연 + 주최측 업로드)

Render(무료)에 올리는 작은 Node 서버. 한 페이지에서 **누구나 시연**, **비밀번호 아는 주최측만 APK 추가**.
작품 목록은 GitHub 저장소(`submissions.json`)에 저장된다.

## 사용자가 준비할 것 (한 번)
### 1) GitHub 토큰 발급 (목록 저장용)
- GitHub → 우상단 프로필 → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
- Repository access: **Only select repositories → `Web-APK`** 선택.
- Permissions → Repository permissions → **Contents: Read and write**.
- Generate → **토큰 복사**(한 번만 보임).

### 2) Render 배포
- [render.com](https://render.com) → GitHub로 로그인(무료) → **New + → Web Service**.
- 저장소 **`Web-APK`** 선택.
- 설정:
  - **Root Directory**: `hosted`
  - **Build Command**: `npm install`
  - **Start Command**: `node server.mjs`
  - Instance Type: **Free**
- **Environment(환경변수)** 4개 입력:
  | Key | Value |
  |---|---|
  | `APPETIZE_API_KEY` | Appetize에서 받은 키 (`tok_...`) |
  | `GITHUB_TOKEN` | 위 1)에서 받은 토큰 |
  | `ADMIN_PASSWORD` | 내가 정한 관리자 비밀번호 |
  | `GITHUB_REPO` | `jkjkjkjkjk72-ux/Web-APK` |
- **Create Web Service** → 1~2분 빌드 후 주소 생성(`https://xxx.onrender.com`).

## 쓰는 법
- 그 주소를 열면 **제출작 갤러리**. 작품의 **▶ 실행** → 새 탭에서 앱 시연.
- 아래 **"주최측 — 작품 추가"** 펼치기 → **비밀번호 + 이름 + APK** → 업로드 + 게시.
- 심사위원은 비밀번호 없이 보고 실행만 가능. 추가는 주최측만.

## 참고
- 무료 플랜은 15분 미사용 시 잠들어, 첫 접속이 ~30초 느릴 수 있음(이후 빠름).
- 주소는 HTTPS라 비밀번호 전송은 암호화됨.
- 목록 저장소·파일은 환경변수 `GITHUB_REPO`, `SUBMISSIONS_PATH`(기본 `submissions.json`)로 바꿀 수 있음.
