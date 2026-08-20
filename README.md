# 농협 강의용 사이트 클론 — 실습본

기업형 웹사이트를 **HTML · CSS · JS 인라인 단일 파일**로 만드는 강의 자료다.
페이지 하나가 파일 하나이고, 그 안에 스타일과 스크립트가 전부 들어 있다.
빌드 도구도, 프레임워크도, 외부 요청도 없다 — **파일을 더블클릭하면 바로 열린다.**

> **이 사이트는 강의 실습본이다.**
> 실제 기업 · 제품 · 연락처와 무관하며, 화면에 나오는 문구 · 수치 · 게시글 ·
> 대리점 정보는 실습을 위해 새로 지어낸 예시다. 강사 이력만 실제 이력서를 따랐다.
> 자세한 사정은 [`docs/작업기록.md`](docs/작업기록.md) 2장 · 10장에 적었다.

---

## 1. 바로 열어 보기

```
index.html 을 브라우저로 연다.  끝.
```

서버가 필요 없다. `file://` 로 열어도 링크 이동 · 검색 · 모달 · 폼 검사가 전부 돈다.

---

## 2. 폴더 구조

```
.
├─ index.html          메인      — 슬라이더 · 퀵메뉴 · 탭 게시판 · 카운트업
├─ about.html          회사소개  — 좌측 세로 메뉴 · 연혁 타임라인 · CI · 약도
├─ instructor.html     강사 소개 — 프로필 · 학력 · 경력 · 핵심역량 · 자격 · 저서
├─ products.html       제품소개  — 분류 탭 · 검색 · 정렬 · 상세 모달
├─ notice.html         알림마당  — 게시판 · 검색 · 페이지 나누기
├─ support.html        고객지원  — FAQ 아코디언 · 폼 검사 · 연동 select
│
├─ _build/             ← 학생에게 나눠 줄 필요 없는 "만드는 쪽" 자료
│  ├─ parts/
│  │  ├─ style.css       공용 디자인 시스템 (토큰 · 레이아웃 · 반응형)
│  │  ├─ common.js       공용 동작 (메뉴 · 아코디언 · 등장 애니메이션 …)
│  │  ├─ header.html     공용 헤더
│  │  └─ footer.html     공용 푸터
│  ├─ pages/*.html       페이지별 조각 (메타 · 전용 CSS · 본문 · 전용 JS)
│  └─ build.mjs          위 조각들을 합쳐 위쪽 6개 파일을 만든다
│
├─ docs/
│  ├─ 작업기록.md        무엇을 왜 그렇게 했는지, 순서대로
│  └─ 강의노트.md        6차시 강의 진행안과 실습 과제
│
├─ .github/workflows/deploy.yml   GitHub Pages 배포
├─ setup-local.ps1      D:\data\dev\nonghyup 으로 내려받기 (PowerShell)
└─ setup-local.bat      같은 일 (더블클릭용)
```

### 왜 `_build/` 가 따로 있나

인라인 방식은 **공용 CSS 를 페이지 수만큼 복사해 넣는다**는 뜻이다.
6개 페이지면 같은 CSS 가 6벌 들어간다. 손으로 관리하면 한 곳을 고칠 때
여섯 곳을 고쳐야 하고, 반드시 어긋난다.

그래서 **원본은 `_build/` 에 한 벌만 두고, 합치는 일은 스크립트에 맡겼다.**
학생에게 주는 결과물은 여전히 자기완결적인 단일 HTML 이다.

```bash
node _build/build.mjs
```

```
  ✓ about.html       39.6 KB
  ✓ index.html       45.1 KB
  ✓ instructor.html  40.0 KB
  ✓ notice.html      41.9 KB
  ✓ products.html    41.1 KB
  ✓ support.html     48.0 KB
```

Node 18 이상이면 되고, 설치할 패키지는 없다.

> **`_build/` 를 고쳤으면 반드시 다시 만들어 함께 커밋한다.**
> 배포 워크플로가 "커밋된 HTML 이 `_build/` 와 일치하는지" 확인하고,
> 다르면 배포를 멈춘다. 원본과 결과물이 어긋난 채 올라가는 사고를 막는다.

> **강의에서 `_build/` 를 꼭 쓸 필요는 없다.**
> "한 파일만 열어서 고친다"가 목표라면 완성된 `*.html` 만 나눠 주면 된다.

---

## 3. 로컬(`D:\data\dev\`)에 두기

강의 환경이 외부 접속을 막는 경우가 많아, 준비는 미리 로컬에 해 둔다.

**PowerShell**

```powershell
cd D:\data\dev
git clone https://github.com/jungaistar/nonghyup.git
cd nonghyup
```

**이미 받아 둔 자료를 옮길 때**

```powershell
powershell -ExecutionPolicy Bypass -File setup-local.ps1
```

`setup-local.bat` 을 더블클릭해도 같은 일을 한다.

배치가 끝나면 `D:\data\dev\nonghyup\index.html` 을 열어 확인한다.
이 시점 이후로는 **네트워크가 완전히 끊겨 있어도 모든 기능이 그대로 동작한다.**

---

## 4. 외부 요청이 하나도 없다

보안이 걸린 강의실을 염두에 두고 만들었다.

| 흔히 쓰는 것 | 여기서는 |
|---|---|
| 웹폰트 CDN (Pretendard 등) | 안 쓴다. 설치돼 있으면 쓰고, 없으면 OS 기본 글꼴로 떨어진다 |
| 아이콘 폰트 · 아이콘 CDN | 인라인 SVG |
| 지도 API | SVG 로 그린 약도 |
| 제품 · 배경 이미지 | CSS 그라디언트 + SVG |
| 탭 아이콘(favicon) | `data:` URI 로 심어 둔 SVG |
| jQuery · 프레임워크 | 표준 DOM API 만 |

즉 `*.html` 6개 말고는 **아무것도 필요 없다.** USB 로 옮겨도 똑같이 돈다.

---

## 5. 반응형

| 폭 | 무엇이 달라지나 |
|---|---|
| ~640px | 카드가 한 열, 게시판에서 분류 열을 접는다, 버튼이 가로로 꽉 찬다 |
| ~900px | 상단 메뉴가 **서랍**으로, 서브 페이지 좌측 메뉴가 **네이티브 select** 로 바뀐다 |
| 901px~ | 가로 메뉴 + 좌측 세로 메뉴(220px) + 본문 |

지켜지고 있는 것 (브라우저로 확인 완료):

- **본문이 통째로 가로로 밀리지 않는다.** 넓은 표는 `.table-wrap` 안에서만 스크롤한다.
- **입력 필드 글자는 16px 아래로 내려가지 않는다.** iOS 가 화면을 확대해 버린다.
- **터치 대상은 44px 이상**이다.
- 좁은 화면용 마크업을 따로 두지 않는다. 좌측 메뉴 → select 도
  같은 `<ul>` 을 읽어 스크립트가 만든다.

---

## 6. 검증 상태

Chromium 으로 6개 페이지 × 3개 폭(360 · 768 · 1440) = **18개 조합 모두 통과**.
스크립트 오류 0건, 가로 넘침 0px, 16px 미만 입력 필드 0개.

상호작용도 실제 클릭으로 확인했다 — 슬라이더 이동, 탭 전환, 제품 검색과 모달,
게시판 검색 · 페이지 이동 · 주소 반영, 폼 오류 검사와 정상 제출, 연동 select,
모바일 서랍 메뉴. 자세한 내용은 [`docs/작업기록.md`](docs/작업기록.md) 6장.

---

## 7. 배포

`main` 에 푸시하면 GitHub Actions 가 `*.html` 만 모아 Pages 에 올린다.
`_build/` · `docs/` · 배치 스크립트는 웹에 올라가지 않는다.

```
https://jungaistar.github.io/nonghyup/
```

**저장소를 처음 만든 뒤 한 번은 사람이 눌러야 한다:**
`Settings → Pages → Build and deployment → Source` 를 **GitHub Actions** 로.

`nonghyup.miraejob.co.kr` 같은 주소를 붙이려면 Cloudflare 에 `nonghyup` CNAME →
`jungaistar.github.io` (회색 구름)를 만들고, `Settings → Pages → Custom domain` 에
넣은 뒤 저장소 루트에 `CNAME` 파일을 추가한다. **DNS 를 먼저 만들고 나서** 붙인다 —
순서를 바꾸면 그동안 사이트가 안 열린다.

강의는 여전히 로컬 파일로 진행한다. 웹 주소는 확인과 링크 공유용이다.

---

## 8. 다음에 손댈 만한 곳

- 원본 사이트 내용 반영 → `docs/작업기록.md` 2장 · 10장 참고
- 페이지 추가 → `_build/pages/` 에 파일 하나 만들고 `node _build/build.mjs`
- 색을 통째로 바꾸기 → `_build/parts/style.css` 맨 위 `:root` 변수만 고친다
- 강사 사진 → `instructor.html` 의 `.cv-photo` 자리를 `<img>` 로 바꾼다
